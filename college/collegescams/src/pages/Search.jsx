import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "https://testing-7ctl.vercel.app";

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                fetchPosts(query);
            } else {
                setPosts([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    async function fetchPosts(searchTerm) {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/posts?search=${encodeURIComponent(searchTerm)}`);
            const data = await res.json();
            setPosts(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container-narrow" style={{ paddingTop: '40px' }}>
            <header style={styles.header}>
                <h1 className="text-gradient" style={styles.title}>Search Posts</h1>
                <input
                    type="text"
                    placeholder="Search by college, caption, tags, or text..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.searchInput}
                    autoFocus
                />
                {query && <p style={styles.searchHint}>Searching across college name, captions, tags, and post content</p>}
            </header>


            <section className="feed-grid">
                {loading ? (
                    <div style={styles.loading}>Searching...</div>
                ) : posts.length === 0 && query ? (
                    <div style={styles.empty}>No posts found matching "{query}"</div>
                ) : posts.length === 0 ? (
                    <div style={styles.empty}>Start typing to search posts...</div>
                ) : (
                    posts.map(post => (
                        <article
                            key={post.id}
                            className="post-card"
                            style={{ ...styles.postCard, cursor: 'pointer' }}
                            onClick={() => navigate(`/${post.college}/${post.id}`)}
                        >
                            <div style={styles.postHeader}>
                                <div style={styles.userInfo}>
                                    <div style={styles.avatar}>{post.college ? post.college[0].toUpperCase() : "?"}</div>
                                    <div>
                                        <h3 style={styles.alias}>{post.college}</h3>
                                        <span style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span style={styles.typeBadge}>{post.type?.toUpperCase()}</span>
                            </div>
                            <div style={styles.content}>
                                <h2 style={styles.caption}>{post.caption || post.body?.substring(0, 60)}</h2>
                            </div>
                        </article>
                    ))
                )}
            </section>
        </div>
    );
}

const styles = {
    header: { textAlign: "center", marginBottom: "40px" },
    title: { fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "800", marginBottom: "20px" },
    searchInput: {
        width: '100%',
        maxWidth: '500px',
        padding: '16px 24px',
        borderRadius: '100px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        color: '#fff',
        fontSize: '18px',
        outline: 'none',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    },
    searchHint: { marginTop: "12px", fontSize: "13px", color: "#999", fontStyle: "italic" },
    loading: { textAlign: "center", color: "#999", padding: "40px" },
    empty: { textAlign: "center", color: "#666", padding: "40px", fontSize: "18px" },
    postCard: {
        background: "#1a1a1a",
        borderRadius: "24px",
        padding: "24px",
        marginBottom: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
        transition: 'transform 0.2s',
    },
    postHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
    userInfo: { display: "flex", alignItems: "center", gap: "12px" },
    avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#628141", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px", color: "#fff" },
    alias: { fontSize: "16px", fontWeight: "700", color: "#fff" },
    date: { fontSize: "12px", color: "#666", display: 'block' },
    typeBadge: { fontSize: "10px", background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "6px", color: "#999", fontWeight: "600" },
    content: { color: '#ccc' },
    caption: { fontSize: "1.1rem", fontWeight: "600", color: "#f0f0f0", margin: 0 },
};
