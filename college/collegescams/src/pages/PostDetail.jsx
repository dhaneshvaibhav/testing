import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "https://collegeass.onrender.com";
import { useQuery } from '@tanstack/react-query';
import SEO from "../components/SEO.jsx";
import { MessageCircle, Heart, AlertTriangle, ChevronLeft, ArrowUp, ArrowDown } from 'lucide-react';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [interactions, setInteractions] = useState({});
    const [newComment, setNewComment] = useState("");
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState(null);
    const [reportText, setReportText] = useState("");
    const [reportFile, setReportFile] = useState(null);

    // --- 1. POST QUERY ---
    const { data: post, isLoading: loading } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            const res = await fetch(`${API_BASE}/api/posts/${id}`);
            if (!res.ok) throw new Error(`Post not found`);
            return res.json();
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });

    // --- 2. INTERACTIONS FETCH ---
    useEffect(() => {
        if (id) {
            fetchInteractions();
        }
    }, [id]);

    async function fetchInteractions() {
        try {
            const resInt = await fetch(`${API_BASE}/api/posts/${id}/interactions`);
            if (resInt.ok) {
                const intData = await resInt.json();
                setInteractions(intData);
            }
        } catch (err) {
            console.error('Error fetching interactions:', err);
        }
    }

    async function submitReport() {
        if (!reportType) {
            alert("Please select TRUE or FALSE");
            return;
        }

        const formData = new FormData();
        formData.append("report_type", reportType);
        formData.append("report_text", reportText);
        if (reportFile) formData.append("proof", reportFile);

        const res = await fetch(`${API_BASE}/api/posts/${id}/report`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            alert("Report submitted");
            setShowReport(false);
            setReportText("");
            setReportType(null);
            setReportFile(null);
        } else {
            alert("Error submitting report");
        }
    }

    /* --- BATCHING & OPTIMISTIC UI LOGIC --- */
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

    function interact(type, commentText) {
        // 1. Optimistic UI Update
        setInteractions(prev => {
            const current = prev || { upvotes: 0, downvotes: 0, comments: [], reports: 0 };
            return {
                ...current,
                upvotes: type === 'upvote' ? (current.upvotes || 0) + 1 : current.upvotes,
                downvotes: type === 'downvote' ? (current.downvotes || 0) + 1 : current.downvotes,
                comments: type === 'comment' ? [
                    { id: 'temp-' + Date.now(), comment_text: commentText, created_at: new Date().toISOString() },
                    ...(current.comments || [])
                ] : current.comments
            };
        });

        // 2. Add to Batch Queue
        pendingInteractions.current.push({
            postId: id,
            action_type: type,
            comment_text: commentText
        });
    }

    function postComment() {
        if (!newComment.trim()) return;
        interact('comment', newComment.trim());
        setNewComment("");
    }

    if (loading) return <div style={{ textAlign: "center", color: "#666", padding: "40px" }}>Loading post...</div>;
    if (!post) return <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>Post not found</div>;

    const upvotes = interactions.upvotes || 0;
    const downvotes = interactions.downvotes || 0;

    return (
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
            <SEO title={`${post.college} - Post`} />

            <button
                onClick={() => navigate(-1)}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: '20px', cursor: 'pointer', fontSize: '16px'
                }}
            >
                <ChevronLeft size={20} /> Back
            </button>

            <article className="post-card">
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
                    <span className="tag" style={{ background: 'rgba(255,255,255,0.1)', color: '#999' }}>
                        {post.type?.toUpperCase() || "POST"}
                    </span>
                </div>

                {/* CONTENT */}
                <div className="post-content">
                    {post.caption && <h1 className="post-title" style={{ fontSize: '24px', marginBottom: '16px' }}>{post.caption}</h1>}

                    {post.media_url && (
                        <div className="media-container">
                            {post.type === "video" ? (
                                <video src={post.media_url} controls className="post-media" />
                            ) : (
                                <img src={post.media_url} className="post-media" />
                            )}
                        </div>
                    )}

                    {post.body && <p className="caption" style={{ whiteSpace: 'pre-wrap', WebkitLineClamp: 'unset', display: 'block' }}>{post.body}</p>}

                    <div className="tags" style={{ marginTop: '20px' }}>
                        {post.tags && post.tags.map((tag, i) => <span key={i} className="tag">#{tag}</span>)}
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="action-row" style={{ marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '4px 12px' }}>
                        <button
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: upvotes > 0 ? 'var(--secondary)' : 'white', cursor: 'pointer' }}
                            onClick={() => interact('upvote')}
                        >
                            <UpIcon />
                            <span style={{ fontWeight: 'bold' }}>{upvotes}</span>
                        </button>
                        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <button
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: downvotes > 0 ? 'var(--text-secondary)' : 'white', cursor: 'pointer' }}
                            onClick={() => interact('downvote')}
                        >
                            <DownIcon />
                            <span style={{ fontWeight: 'bold' }}>{downvotes}</span>
                        </button>
                    </div>

                    <button
                        className="action-btn"
                        onClick={() => setShowReport(true)}
                        style={{ marginLeft: 'auto' }}
                    >
                        <span style={{ marginRight: '8px', fontSize: '14px', fontWeight: '600' }}>Report</span>
                        <AlertTriangle size={20} color="var(--error)" />
                    </button>
                </div>

                {/* COMMENTS SECTION */}
                <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "var(--text-main)" }}>
                        Comments ({Array.isArray(interactions.comments) ? interactions.comments.length : 0})
                    </h3>

                    <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
                        <input
                            value={newComment}
                            placeholder="Share your thoughts..."
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && postComment()}
                            style={{
                                flex: 1,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid var(--border-light)",
                                padding: "12px 16px",
                                borderRadius: "12px",
                                color: "#fff",
                                outline: "none",
                                fontSize: "16px"
                            }}
                        />
                        <button
                            onClick={postComment}
                            style={{
                                background: "var(--primary)",
                                color: "#000",
                                padding: "0 24px",
                                borderRadius: "12px",
                                fontWeight: "700",
                                fontSize: "16px",
                                cursor: "pointer",
                                border: 'none'
                            }}
                        >
                            Send
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {Array.isArray(interactions.comments) && interactions.comments.length > 0 ? (
                            interactions.comments.map(c => (
                                <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", border: "1px solid var(--border-light)" }}>
                                    <p style={{ fontSize: "15px", color: "#eee", lineHeight: "1.5", marginBottom: "8px" }}>{c.comment_text}</p>
                                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-secondary)', padding: '10px' }}>No comments yet.</p>
                        )}
                    </div>
                </div>

            </article>

            {showReport && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    background: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center"
                }} onClick={() => setShowReport(false)}>
                    <div style={{ background: "#1a1a1a", padding: "20px", borderRadius: "16px", width: "90%", maxWidth: "400px", border: "1px solid var(--border-light)" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ marginBottom: "0", color: "white" }}>Report Post</h3>
                            <button onClick={() => setShowReport(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: '24px', cursor: 'pointer' }}>×</button>
                        </div>

                        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>Is this post True or False?</p>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: reportType === 'true' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: reportType === 'true' ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setReportType("true")}
                            >
                                TRUE
                            </button>
                            <button
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', background: reportType === 'false' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: reportType === 'false' ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setReportType("false")}
                            >
                                FALSE
                            </button>
                        </div>

                        <textarea
                            placeholder="Explain details..."
                            style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '10px', color: 'white', marginBottom: '10px' }}
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                        />

                        <button onClick={submitReport} style={{ width: '100%', background: "var(--primary)", color: "#000", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: 'bold', border: 'none' }}>
                            Submit Report
                        </button>
                    </div>
                </div>
            )}
        </div>
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
