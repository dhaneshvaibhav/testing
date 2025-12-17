import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SEO from "../components/SEO.jsx";
import { MessageCircle, Heart, Share2, MoreHorizontal, AlertTriangle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || "https://collegeass.onrender.com";

export default function Posts({ refreshKey }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [interactions, setInteractions] = useState({});
  const [newComment, setNewComment] = useState({});
  const [openComments, setOpenComments] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null); // Track open menu
  const [hiddenPosts, setHiddenPosts] = useState([]); // Track hidden posts locally
  const [showReport, setShowReport] = useState(false);
  const [reportPost, setReportPost] = useState(null);

  // --- 1. POSTS QUERY ---
  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60,
  });

  // --- 2. INTERACTIONS SYNC ---
  useEffect(() => {
    if (posts.length > 0) {
      fetchInteractions(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (refreshKey > 0) {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  }, [refreshKey, queryClient]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);


  async function fetchInteractions(currentPosts) {
    const interData = {};
    await Promise.all(currentPosts.map(async (p) => {
      try {
        const resInt = await fetch(`${API_BASE}/api/posts/${p.id}/interactions`);
        if (resInt.ok) {
          interData[p.id] = await resInt.json();
        }
      } catch (err) {
        console.error(err);
      }
    }));
    setInteractions(prev => ({ ...prev, ...interData }));
  }

  /* --- BATCHING LOGIC --- */
  const pendingInteractions = useRef([]);
  const batchTimer = useRef(null);

  useEffect(() => {
    batchTimer.current = setInterval(flushInteractions, 3000);
    return () => clearInterval(batchTimer.current);
  }, []);

  async function flushInteractions() {
    if (pendingInteractions.current.length === 0) return;
    const batch = [...pendingInteractions.current];
    pendingInteractions.current = [];

    try {
      await fetch(`${API_BASE}/api/interact-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interactions: batch }),
      });
    } catch (err) {
      console.error("Batch flush error:", err);
    }
  }

  function interact(postId, type, commentText) {
    setInteractions(prev => {
      const current = prev[postId] || { upvotes: 0, downvotes: 0, comments: [], reports: 0 };
      let updated = { ...current };

      if (type === 'upvote') updated.upvotes = (current.upvotes || 0) + 1;
      if (type === 'downvote') updated.downvotes = (current.downvotes || 0) + 1;
      if (type === 'comment') {
        const newCommentObj = { id: 'temp-' + Date.now(), comment_text: commentText, created_at: new Date().toISOString() };
        updated.comments = [newCommentObj, ...(current.comments || [])];
      }
      return { ...prev, [postId]: updated };
    });

    pendingInteractions.current.push({ postId, action_type: type, comment_text: commentText });
  }

  const handleShare = (post) => {
    const url = `${window.location.origin}/${post.college}/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
      setOpenMenuId(null);
    });
  };

  const handleHide = (postId) => {
    setHiddenPosts(prev => [...prev, postId]);
    setOpenMenuId(null);
  };

  return (
    <>
      <SEO
        title="College Reviews & Experiences"
        description="Anonymous college reviews and student experiences."
        keywords="college reviews, anonymous reviews"
        type="website"
      />

      <div className="container" style={{ paddingTop: '20px' }}>

        {/* Mobile Header */}
        <header style={{ marginBottom: '20px', padding: '0 10px' }}>
          <h1 className="text-gradient" style={{ fontSize: '24px' }}>Stream</h1>
        </header>

        <section className="feed-grid">
          {loading ? (
            <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>Loading...</div>
          ) : posts.filter(p => !hiddenPosts.includes(p.id)).length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>No posts yet...</div>
          ) : posts.filter(p => !hiddenPosts.includes(p.id)).map(post => {
            const postInt = interactions[post.id] || {};
            const upvotes = postInt.upvotes || 0;
            const downvotes = postInt.downvotes || 0;
            const comments = postInt.comments || [];

            return (
              <article
                key={post.id}
                className="post-card"
                onClick={() => navigate(`/${post.college}/${post.id}`)}
              >
                {/* HEADER */}
                <div className="post-header">
                  <div className="user-info">
                    <div className="avatar">
                      {post.college ? post.college[0].toUpperCase() : "?"}
                    </div>
                    <div>
                      <div className="alias">{post.college || "Unknown College"}</div>
                      {post.college && <div className="college-name">{post.alias || "Anonymous Student"}</div>}
                    </div>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <button
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === post.id ? null : post.id);
                      }}
                    >
                      <MoreHorizontal size={20} color="var(--text-secondary)" />
                    </button>

                    {openMenuId === post.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: '#1a1a1a',
                        border: '1px solid var(--border-light)',
                        borderRadius: '12px',
                        padding: '8px',
                        zIndex: 10,
                        minWidth: '140px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleShare(post)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            width: '100%', padding: '8px',
                            background: 'none', border: 'none',
                            color: 'white', fontSize: '14px', cursor: 'pointer',
                            textAlign: 'left', borderRadius: '8px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.target.style.background = 'none'}
                        >
                          <Share2 size={16} /> Share Link
                        </button>
                        <button
                          onClick={() => handleHide(post.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            width: '100%', padding: '8px',
                            background: 'none', border: 'none',
                            color: '#ff4d4d', fontSize: '14px', cursor: 'pointer',
                            textAlign: 'left', borderRadius: '8px',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255,0,0,0.1)'}
                          onMouseLeave={(e) => e.target.style.background = 'none'}
                        >
                          <AlertTriangle size={16} /> Hide Post
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* MEDIA */}
                {post.media_url && (
                  <div className="media-container">
                    {post.type === "video" ? (
                      <video src={post.media_url} controls className="post-media" />
                    ) : (
                      <img src={post.media_url} className="post-media" loading="lazy" />
                    )}
                  </div>
                )}

                {/* CONTENT */}
                <div className="post-content">
                  {post.caption && <h3 className="post-title">{post.caption}</h3>}
                  {post.body && <p className="caption">{post.body}</p>}
                  {!post.body && !post.caption && <p className="caption">...</p>}
                  <div className="tags">
                    {post.tags && post.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="action-row">
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px 12px' }}>
                      <button
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: upvotes > 0 ? 'var(--secondary)' : 'white', cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); interact(post.id, 'upvote'); }}
                      >
                        <UpIcon />
                        <span style={{ fontWeight: 'bold' }}>{upvotes}</span>
                      </button>
                      <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
                      <button
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: downvotes > 0 ? 'var(--text-secondary)' : 'white', cursor: 'pointer' }}
                        onClick={(e) => { e.stopPropagation(); interact(post.id, 'downvote'); }}
                      >
                        <DownIcon />
                        <span style={{ fontWeight: 'bold' }}>{downvotes}</span>
                      </button>
                    </div>

                    <button
                      className="action-btn"
                      onClick={(e) => { e.stopPropagation(); setOpenComments(openComments === post.id ? null : post.id); }}
                    >
                      <MessageCircle size={24} />
                      <span>{comments.length}</span>
                    </button>
                  </div>

                  <button
                    className="action-btn"
                    onClick={(e) => { e.stopPropagation(); setReportPost(post); setShowReport(true); }}
                  >
                    <AlertTriangle size={20} color="var(--text-secondary)" />
                  </button>
                </div>

                {/* COMMENTS PREVIEW (If Open) */}
                {openComments === post.id && (
                  <div style={{ marginTop: '15px', padding: '0 16px', borderTop: '1px solid var(--border-light)', paddingTop: '15px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Comments</h4>
                      <button
                        onClick={() => setOpenComments(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}
                      >
                        Close
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment[post.id] || ""}
                        onChange={e => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--border-light)',
                          color: 'white',
                          padding: '8px 0',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!newComment[post.id]) return;
                          interact(post.id, 'comment', newComment[post.id]);
                          setNewComment(prev => ({ ...prev, [post.id]: "" }));
                        }}
                        style={{ color: 'var(--primary)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Post
                      </button>
                    </div>
                    <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {comments.map((c, idx) => (
                        <div key={idx} style={{ fontSize: '14px' }}>
                          <span style={{ fontWeight: '700', marginRight: '8px' }}>User</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{c.comment_text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </article>
            )
          })}
        </section>

        {showReport && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center"
          }} onClick={() => setShowReport(false)}>
            <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "16px", width: "90%", maxWidth: "400px", border: "1px solid var(--border-light)" }} onClick={e => e.stopPropagation()}>
              <h3 style={{ marginBottom: "10px", color: "white" }}>Report Post</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Are you sure you want to report this post?</p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowReport(false)} style={{ color: "white", padding: "8px 16px", cursor: "pointer" }}>Cancel</button>
                <button onClick={() => { alert("Report submitted!"); setShowReport(false); }} style={{ background: "red", color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer" }}>Report</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

const UpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const DownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
