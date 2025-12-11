import React, { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "https://testing-7ctl.vercel.app";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useGeoLocation from "../hooks/useGeoLocation"; // Import Hook
import { MapPin } from "lucide-react";

export default function Posts({ refreshKey }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { city, state, detectLocation, loading: locLoading } = useGeoLocation(); // Use Hook

  const [interactions, setInteractions] = useState({});
  const [newComment, setNewComment] = useState({});
  const [openComments, setOpenComments] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportPost, setReportPost] = useState(null);
  const [reportType, setReportType] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportFile, setReportFile] = useState(null);

  // --- 1. POSTS QUERY (Filtered by Location) ---
  const { data: posts = [], isLoading: loading, isError } = useQuery({
    queryKey: ['posts', city, state], // Refetch when location changes
    queryFn: async () => {
      console.log(`Fetching posts... Location: ${city}, ${state}`);
      let url = `${API_BASE}/api/posts`;

      // Append query params if location exists
      const params = new URLSearchParams();
      if (city) params.append('city', city);
      else if (state) params.append('state', state);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    staleTime: 1000 * 60, // 1 minute fresh
  });

  // --- 2. INTERACTIONS STATE SYNC ---
  // When posts change (or initial load), we sync interactions. 
  // NOTE: Ideally, interactions should also be a query, but to keep optimistic UI logic simple with current batching,
  // we will just fetch them once on mount/posts-change effectively.
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


  async function fetchInteractions(currentPosts) {
    // Fetch interactions for all posts (could be optimized to bulk fetch in future)
    const interData = {};

    // OPTIMIZATION: Only fetch if we don't have it (optional, but good for cache)
    // For now, we fetch to be safe on refresh.

    await Promise.all(currentPosts.map(async (p) => {
      try {
        const resInt = await fetch(`${API_BASE}/api/posts/${p.id}/interactions`);
        if (resInt.ok) {
          const intJson = await resInt.json();
          interData[p.id] = intJson;
        }
      } catch (err) {
        console.error(`Error fetching interactions for ${p.id}:`, err);
      }
    }));

    setInteractions(prev => ({ ...prev, ...interData }));
  }

  /* --- BATCHING & OPTIMISTIC UI LOGIC --- */
  const pendingInteractions = React.useRef([]);
  const batchTimer = React.useRef(null);

  // Flush interactions to backend every 3 seconds if there are any
  useEffect(() => {
    batchTimer.current = setInterval(flushInteractions, 3000);
    return () => clearInterval(batchTimer.current);
  }, []);

  async function flushInteractions() {
    if (pendingInteractions.current.length === 0) return;

    const batch = [...pendingInteractions.current];
    pendingInteractions.current = []; // Clear queue

    try {
      console.log("Flushing interactions:", batch);
      const res = await fetch(`${API_BASE}/api/interact-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interactions: batch }),
      });

      if (!res.ok) {
        console.error("Failed to flush interactions", await res.text());
        // Potential rollback logic could go here, but for now we prioritize speed.
      } else {
        console.log("Batch sync successful");
      }
    } catch (err) {
      console.error("Batch flush error:", err);
    }
  }

  function interact(postId, type, commentText) {
    // 1. Optimistic UI Update
    setInteractions(prev => {
      const current = prev[postId] || { upvotes: 0, downvotes: 0, comments: [], reports: 0 };
      let updated = { ...current };

      if (type === 'upvote') updated.upvotes = (current.upvotes || 0) + 1;
      if (type === 'downvote') updated.downvotes = (current.downvotes || 0) + 1;
      if (type === 'comment') {
        const newCommentObj = {
          id: 'temp-' + Date.now(),
          comment_text: commentText,
          created_at: new Date().toISOString()
        };
        updated.comments = [newCommentObj, ...(current.comments || [])];
      }

      return { ...prev, [postId]: updated };
    });

    // 2. Add to Batch Queue
    pendingInteractions.current.push({
      postId,
      action_type: type,
      comment_text: commentText
    });
  }

  function toggleComments(postId) {
    setOpenComments(openComments === postId ? null : postId);
  }

  function postComment(postId) {
    const text = (newComment[postId] || "").trim();
    if (!text) return;
    interact(postId, 'comment', text);
    setNewComment(prev => ({ ...prev, [postId]: "" }));
  }

  return (
    <div className="container-narrow" style={{ paddingTop: '40px' }}>
      <header style={styles.header}>
        <h1 className="text-gradient" style={styles.title}>Trending Posts</h1>
        <p style={styles.subtitle}>Discover, vote & discuss ideas openly.</p>

        {/* Location Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px', fontSize: '14px', color: city ? '#00f2ea' : '#888' }}>
          <MapPin size={16} />
          {locLoading ? "Locating..." :
            city ? <span>Nearby: <strong>{city}</strong></span> :
              <span onClick={detectLocation} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Enable Location</span>
          }
        </div>
      </header>

      {/* Location Filter Message */}
      {!loading && city && posts.length === 0 && (
        <div style={styles.empty}>
          No posts found in <strong>{city}</strong>.<br />
          <span style={{ fontSize: '14px', color: '#888' }}>Be the first to post!</span>
        </div>
      )}

      <section className="feed-grid">
        {loading ? <div style={styles.loading}>Loading posts...</div> : posts.length === 0 ? (
          <div style={styles.empty}>No posts yet...</div>
        ) : posts.map(post => (
          <article
            key={post.id}
            className="post-card"
            style={{ ...styles.postCard, cursor: 'pointer' }}
            onClick={() => navigate(`/${post.college}/${post.id}`)}
          >
            {/* HEADER */}
            <div style={styles.postHeader}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>{post.college ? post.college[0].toUpperCase() : "?"}</div>
                <div>
                  <h3 style={styles.alias}>{post.college || "Unknown College"}</h3>
                  {/* <p style={styles.college}>{post.alias || "Anonymous"}</p> */}
                </div>
              </div>
              <span style={styles.typeBadge}>{post.type?.toUpperCase() || "POST"}</span>
            </div>

            {/* MEDIA */}
            {post.media_url && (
              <div style={styles.mediaContainer}>
                {post.type === "video" ? <video src={post.media_url} controls style={styles.media} /> : <img src={post.media_url} style={styles.media} />}
              </div>
            )}

            {/* CONTENT */}
            <div style={styles.content}>
              <h2 style={styles.caption}>{post.caption || post.body?.substring(0, 60)}</h2>
              {post.tags && post.tags.map((tag, i) => <span key={i} style={styles.tag}>#{tag}</span>)}
            </div>

            {/* ACTIONS - MINIMAL REDESIGN */}
            <div style={styles.actionRow}>
              {/* VOTE PILL */}
              <div style={styles.votePill}>
                <button
                  style={styles.voteBtn}
                  onClick={(e) => { e.stopPropagation(); interact(post.id, 'upvote'); }}
                  onMouseEnter={(e) => e.target.style.color = '#00f2ea'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                  title={`Upvotes: ${interactions[post.id]?.upvotes || 0}`}
                >
                  <UpIcon />
                  <span style={styles.count}>{typeof interactions[post.id]?.upvotes === 'number' ? interactions[post.id].upvotes : 0}</span>
                </button>
                <div style={styles.divider}></div>
                <button
                  style={styles.voteBtn}
                  onClick={(e) => { e.stopPropagation(); interact(post.id, 'downvote'); }}
                  onMouseEnter={(e) => e.target.style.color = '#ff0055'}
                  onMouseLeave={(e) => e.target.style.color = '#fff'}
                  title={`Downvotes: ${interactions[post.id]?.downvotes || 0}`}
                >
                  <DownIcon />
                  <span style={styles.count}>{typeof interactions[post.id]?.downvotes === 'number' ? interactions[post.id].downvotes : 0}</span>
                </button>
                <button
                  style={styles.reportBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openReportModal(post);
                  }}
                >
                  Report
                </button>

              </div>

              {/* COMMENT BUTTON */}
              <button
                style={styles.commentBtn}
                onClick={(e) => { e.stopPropagation(); toggleComments(post.id); }}
                title={`Comments: ${Array.isArray(interactions[post.id]?.comments) ? interactions[post.id].comments.length : 0}`}
              >
                <CommentIcon />
                <span>{Array.isArray(interactions[post.id]?.comments) ? interactions[post.id].comments.length : 0}</span>
              </button>

            </div>

            {/* COMMENTS */}
            {openComments === post.id && (
              <div style={styles.commentsSection} onClick={(e) => e.stopPropagation()}>
                <div style={{ marginBottom: '15px' }}>
                  {Array.isArray(interactions[post.id]?.comments) && interactions[post.id].comments.length > 0 ? (
                    interactions[post.id].comments.map(c => (
                      <div key={c.id} style={styles.commentBubble}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#fff' }}>{c.comment_text}</p>
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {new Date(c.created_at).toLocaleDateString()} {new Date(c.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#888', fontSize: '14px' }}>No comments yet. Be the first!</p>
                  )}
                </div>
                <div style={styles.commentInputBox}>
                  <input value={newComment[post.id] || ""} placeholder="Add comment..." onChange={e => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && postComment(post.id)} style={styles.input} />
                  <button onClick={() => postComment(post.id)} style={styles.sendBtn}>Send</button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
      {showReport && (
        <div style={styles.modalOverlay} onClick={() => setShowReport(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ color: "#fff", margin: 0 }}>
                Report Post
              </h2>
              <button
                onClick={(e) => { e.stopPropagation(); setShowReport(false); }}
                style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              Is this post True or False? - {reportPost?.college}
            </p>

            <p style={{ color: "#aaa", marginBottom: "20px" }}>
              Is this post True or False?
            </p>

            <div style={styles.reportButtons}>
              <button
                style={reportType === "true" ? styles.selectedBtn : styles.choiceBtn}
                onClick={() => setReportType("true")}
              >
                TRUE
              </button>

              <button
                style={reportType === "false" ? styles.selectedBtn : styles.choiceBtn}
                onClick={() => setReportType("false")}
              >
                FALSE
              </button>
            </div>

            <textarea
              placeholder="Explain why you think this is true/false..."
              style={styles.textArea}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />

            <input
              type="file"
              accept="image/*,video/*"
              style={{ marginTop: "10px", color: "#fff" }}
              onChange={(e) => setReportFile(e.target.files[0])}
            />

            <button style={styles.submitBtn} onClick={submitReport}>
              Submit Report
            </button>

          </div>
        </div>
      )}

    </div>

  );

}

// ICONS
const UpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const DownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CommentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const styles = {
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", marginBottom: "10px" },
  subtitle: { color: "#999", fontSize: "1.125rem" },
  loading: { textAlign: "center", color: "#999", padding: "40px" },
  empty: { textAlign: "center", padding: "60px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.1)", color: "#eee", fontSize: "20px" },
  postCard: { background: "#1a1a1a", borderRadius: "24px", padding: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" },
  postHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  userInfo: { display: "flex", alignItems: "center", gap: "12px" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#628141", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px", color: "#fff" },
  alias: { fontSize: "16px", fontWeight: "700", color: "#fff", textTransform: "uppercase" },
  college: { fontSize: "12px", color: "#8BAE66", letterSpacing: "0.5px", fontWeight: "600" },
  typeBadge: { fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "6px", color: "#999", fontWeight: "600" },
  mediaContainer: { borderRadius: "16px", overflow: "hidden", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.1)", background: "#000" },
  media: { width: "100%", maxHeight: "500px", objectFit: "contain", display: "block" },
  content: { marginBottom: "20px" },
  caption: { fontSize: "1.25rem", fontWeight: "700", marginBottom: "10px", lineHeight: "1.3", color: "#f0f0f0" },
  tag: { fontSize: "12px", color: "#8BAE66", background: "rgba(0,242,234,0.05)", padding: "4px 8px", borderRadius: "6px" },

  actionRow: { display: "flex", gap: "12px", alignItems: "center", paddingTop: "6px" },
  votePill: {
    display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)",
    borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)"
  },
  voteBtn: {
    display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px",
    background: "none", border: "none", color: "#fff", cursor: "pointer", transition: "color 0.2s"
  },
  divider: { width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" },
  commentBtn: {
    display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px",
    background: "rgba(255,255,255,0.05)", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "background 0.2s"
  },
  count: { fontSize: "14px", fontWeight: 700 },
  reportBtn: {
    padding: "8px 16px",
    background: "rgba(255,0,0,0.1)",
    border: "1px solid rgba(255,0,0,0.3)",
    borderRadius: "100px",
    color: "#ff4d4d",
    cursor: "pointer",
    fontWeight: "700",
  },

  modalOverlay: {
    position: "fixed",
    top: 0, left: 0,
    width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  modal: {
    background: "#1a1a1a",
    padding: "30px",
    borderRadius: "20px",
    width: "90%",
    maxWidth: "480px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  choiceBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
    width: "45%",
  },

  selectedBtn: {
    padding: "10px 20px",
    background: "#628141",
    border: "1px solid #8BAE66",
    color: "#000",
    borderRadius: "10px",
    cursor: "pointer",
    width: "45%",
    fontWeight: "700",
  },

  reportButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  textArea: {
    width: "100%",
    height: "100px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "12px",
    color: "#fff",
    borderRadius: "10px",
    resize: "none",
  },

  submitBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px 16px",
    background: "#628141",
    color: "#000",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },

  commentsSection: { marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.1)" },
  commentBubble: { background: "rgba(255,255,255,0.05)", padding: "10px 14px", borderRadius: "12px", fontSize: "14px", color: "#eee", marginBottom: "6px" },
  commentInputBox: { display: "flex", gap: "10px" },
  input: { flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 16px", borderRadius: "12px", color: "#fff", outline: "none", fontSize: "14px" },
  sendBtn: { background: "#628141", color: "#000", padding: "0 20px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
};
