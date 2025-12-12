import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { useQuery } from '@tanstack/react-query';

export default function PostDetail() {
    const { id, college } = useParams();
    const navigate = useNavigate();
    // const [post, setPost] = useState(null); // Removed locally managed state
    const [interactions, setInteractions] = useState({});
    const [newComment, setNewComment] = useState("");
    // const [loading, setLoading] = useState(true); // Handled by useQuery
    const [showReport, setShowReport] = useState(false);
    const [reportType, setReportType] = useState(null);
    const [reportText, setReportText] = useState("");
    const [reportFile, setReportFile] = useState(null);

    // --- 1. POST QUERY ---
    const { data: post, isLoading: loading, error } = useQuery({
        queryKey: ['post', id],
        queryFn: async () => {
            console.log(`Fetching post ${id} via React Query...`);
            const res = await fetch(`${API_BASE}/api/posts/${id}`);
            if (!res.ok) throw new Error(`Post not found`);
            return res.json();
        },
        enabled: !!id, // Only run if ID exists
        staleTime: 1000 * 60 * 5, // 5 minutes fresh
    });

    // --- 2. INTERACTIONS FETCH ---
    // Fetch interactions when post loads. 
    useEffect(() => {
        if (id) {
            fetchInteractions();
        }
    }, [id]);

    useEffect(() => {
        console.log('PostDetail interactions updated:', interactions);
    }, [interactions]);

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
            // fetchPostData(true); // No longer needed for main post
        } else {
            alert("Error submitting report");
        }
    }

    // Kept interact logic below...

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
            } else {
                console.log("Batch sync successful");
            }
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

    if (loading) return <div style={styles.loading}>Loading post...</div>;
    if (!post) return <div style={styles.loading}>Post not found</div>;

    return (
        <div className="container-narrow" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

            <article className="post-card" style={styles.postCard}>
                {/* HEADER */}
                <div style={styles.postHeader}>
                    <div style={styles.userInfo}>
                        <div style={styles.avatar}>{post.college ? post.college[0].toUpperCase() : "?"}</div>
                        <div>
                            <h3 style={styles.alias}>{post.college || "Unknown College"}</h3>
                            <p style={styles.college}>{post.alias || "Anonymous"}</p>
                        </div>
                    </div>
                    <span style={styles.typeBadge}>{post.type?.toUpperCase() || "POST"}</span>
                </div>

                {/* CONTENT */}
                <div style={styles.content}>
                    <h1 style={styles.title}>{post.caption}</h1>

                    {post.media_url && (
                        <div style={styles.mediaContainer}>
                            {post.type === "video" ? <video src={post.media_url} controls style={styles.media} /> : <img src={post.media_url} style={styles.media} />}
                        </div>
                    )}

                    {post.body && <p style={styles.body}>{post.body}</p>}

                    {post.tags && (
                        <div style={styles.tags}>
                            {post.tags.map((tag, i) => <span key={i} style={styles.tag}>#{tag}</span>)}
                        </div>
                    )}
                </div>

                {/* ACTIONS */}
                <div style={styles.actionRow}>
                    <div style={styles.votePill}>
                        <button
                            style={styles.voteBtn}
                            onClick={() => interact('upvote')}
                            onMouseEnter={(e) => e.target.style.color = '#00f2ea'}
                            onMouseLeave={(e) => e.target.style.color = '#fff'}
                            title={`Upvotes: ${typeof interactions.upvotes === 'number' ? interactions.upvotes : 0}`}
                        >
                            <UpIcon />
                            <span style={styles.count}>{typeof interactions.upvotes === 'number' ? interactions.upvotes : 0}</span>
                        </button>
                        <div style={styles.divider}></div>
                        <button
                            style={styles.voteBtn}
                            onClick={() => interact('downvote')}
                            onMouseEnter={(e) => e.target.style.color = '#ff0055'}
                            onMouseLeave={(e) => e.target.style.color = '#fff'}
                            title={`Downvotes: ${typeof interactions.downvotes === 'number' ? interactions.downvotes : 0}`}
                        >
                            <DownIcon />
                            <span style={styles.count}>{typeof interactions.downvotes === 'number' ? interactions.downvotes : 0}</span>
                        </button>
                    </div>
                    <button
                        style={styles.reportBtn}
                        onClick={() => setShowReport(true)}
                    >
                        Report
                    </button>
                </div>

                {/* COMMENTS SECTION */}
                <div style={styles.commentsSection}>
                    <h3 style={styles.commentHeader}>Comments ({Array.isArray(interactions.comments) ? interactions.comments.length : 0})</h3>

                    <div style={styles.commentInputBox}>
                        <input
                            value={newComment}
                            placeholder="Share your thoughts..."
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && postComment()}
                            style={styles.input}
                        />
                        <button onClick={postComment} style={styles.sendBtn}>Send</button>
                    </div>

                    <div style={styles.commentList}>
                        {Array.isArray(interactions.comments) && interactions.comments.length > 0 ? (
                            interactions.comments.map(c => (
                                <div key={c.id} style={styles.commentBubble}>
                                    <p style={styles.commentText}>{c.comment_text}</p>
                                    <span style={styles.timestamp}>{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#888', padding: '10px' }}>No comments yet. Be the first!</p>
                        )}
                    </div>
                </div>

            </article>
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
                            Is this post True or False? - {post.college}
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

// ICONS (Same as Post.jsx)
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

const styles = {
    loading: { textAlign: "center", color: "#999", padding: "40px", fontSize: "18px" },
    backBtn: { background: "none", border: "none", color: "var(--text-muted)", fontSize: "16px", cursor: "pointer", marginBottom: "20px", display: "flex", alignItems: "center", gap: "5px" },

    postCard: { background: "#1a1a1a", borderRadius: "32px", padding: "40px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)" },

    postHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
    userInfo: { display: "flex", alignItems: "center", gap: "16px" },
    avatar: { width: "56px", height: "56px", borderRadius: "50%", background: "#628141", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "24px", color: "#fff" },
    alias: { fontSize: "clamp(1rem, 4vw, 1.25rem)", fontWeight: "700", color: "#fff", textTransform: "uppercase" },
    college: { fontSize: "14px", color: "#8BAE66", letterSpacing: "0.5px", fontWeight: "600" },
    typeBadge: { fontSize: "12px", background: "rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "8px", color: "#999", fontWeight: "600" },

    content: { marginBottom: "40px" },
    title: { fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "800", marginBottom: "20px", lineHeight: "1.2", color: "#fff" },
    body: { fontSize: "18px", lineHeight: "1.6", color: "#e0e0e0", marginBottom: "20px", whiteSpace: "pre-wrap" },
    mediaContainer: { borderRadius: "24px", overflow: "hidden", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.1)", background: "#000" },
    media: { width: "100%", maxHeight: "700px", objectFit: "contain", display: "block" },
    tags: { display: "flex", gap: "10px", flexWrap: "wrap" },
    tag: { fontSize: "14px", color: "#8BAE66", background: "rgba(0,242,234,0.05)", padding: "6px 12px", borderRadius: "8px" },
    reportBtn: {
        marginLeft: "auto",
        background: "rgba(255,0,0,0.1)",
        border: "1px solid rgba(255,0,0,0.3)",
        color: "#ff4d4d",
        padding: "10px 18px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 600,
    },

    actionRow: { display: "flex", gap: "12px", alignItems: "center", paddingBottom: "30px", borderBottom: "1px solid rgba(255,255,255,0.1)" },
    votePill: {
        display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)",
        borderRadius: "100px", border: "1px solid rgba(255,255,255,0.08)", padding: "4px"
    },
    voteBtn: {
        display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px",
        background: "none", border: "none", color: "#fff", cursor: "pointer", transition: "color 0.2s"
    },
    divider: { width: "1px", height: "20px", background: "rgba(255,255,255,0.1)" },
    count: { fontSize: "16px", fontWeight: 700 },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },
    modal: {
        background: "#1a1a1a",
        padding: "30px",
        borderRadius: "20px",
        width: "90%",
        maxWidth: "500px",
        border: "1px solid rgba(255,255,255,0.1)"
    },
    reportButtons: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px"
    },
    choiceBtn: {
        flex: 1,
        padding: "12px",
        background: "rgba(255,255,255,0.1)",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        cursor: "pointer"
    },
    selectedBtn: {
        flex: 1,
        padding: "12px",
        background: "#628141",
        border: "none",
        borderRadius: "10px",
        color: "#000",
        cursor: "pointer",
        fontWeight: "700"
    },
    textArea: {
        width: "100%",
        height: "100px",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px",
        color: "#fff",
        marginBottom: "10px"
    },
    submitBtn: {
        width: "100%",
        background: "#628141",
        padding: "14px 0",
        color: "#000",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: 700,
        marginTop: "10px"
    },

    commentsSection: { marginTop: "40px" },
    commentHeader: { fontSize: "24px", fontWeight: "700", marginBottom: "20px", color: "var(--text-main)" },
    commentInputBox: { display: "flex", gap: "12px", marginBottom: "40px" },
    input: { flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px 20px", borderRadius: "16px", color: "#fff", outline: "none", fontSize: "16px" },
    sendBtn: { background: "#628141", color: "#000", padding: "0 30px", borderRadius: "16px", fontWeight: "700", fontSize: "16px", cursor: "pointer" },

    commentList: { display: "flex", flexDirection: "column", gap: "16px" },
    commentBubble: { background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" },
    commentText: { fontSize: "16px", color: "#eee", lineHeight: "1.5", marginBottom: "8px" },
    timestamp: { fontSize: "12px", color: "var(--text-muted)" }
};
