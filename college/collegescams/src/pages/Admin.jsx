import React, { useState, useEffect } from "react";

const API_BASE = "https://backend-hzn5lagqd-dhaneshs-projects-fb9f1328.vercel.app";

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);

    // Static Password (Change this if you want)
    const ADMIN_PASSWORD = "admin";

    useEffect(() => {
        const savedAuth = localStorage.getItem("admin_auth");
        if (savedAuth === "true") {
            setIsAuthenticated(true);
            fetchReports();
        }
    }, []);

    function handleLogin() {
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
            fetchReports();
        } else {
            alert("F*ck off! You are not the admin.");
        }
    }

    function handleLogout() {
        setIsAuthenticated(false);
        localStorage.removeItem("admin_auth");
    }

    async function fetchReports() {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/reports`);
            const data = await res.json();
            setReports(data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    }

    async function deletePost(postId) {
        if (!window.confirm("Are you sure you want to DELETE this post? This cannot be undone.")) return;

        try {
            const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Post Deleted Successfully");
                fetchReports(); // Refresh list
            } else {
                alert("Failed to delete post");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting post");
        }
    }

    // Group reports by post_id
    const groupedReports = reports.reduce((acc, report) => {
        if (!report.post) return acc; // Skip orphaned reports
        const postId = report.post_id;
        if (!acc[postId]) {
            acc[postId] = {
                post: report.post,
                reports: []
            };
        }
        acc[postId].reports.push(report);
        return acc;
    }, {});

    const groupedList = Object.values(groupedReports);

    const renderProof = (url) => {
        if (!url) return null;
        const isVideo = url.match(/\.(mp4|webm|ogg)$/i);
        if (isVideo) {
            return (
                <div style={{ marginTop: '10px' }}>
                    <video src={url} controls style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                    <br />
                    <a href={url} target="_blank" rel="noreferrer" style={styles.link}>Open Video ↗</a>
                </div>
            );
        }
        return (
            <div style={{ marginTop: '10px' }}>
                <img src={url} alt="Proof" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />
            </div>
        );
    };

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <div style={styles.loginBox}>
                    <h1 style={{ color: "#fff", marginBottom: "20px" }}>Admin Access</h1>
                    <input
                        type="password"
                        placeholder="Enter Request ID"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                    />
                    <button onClick={handleLogin} style={styles.btn}>Access</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-narrow" style={{ paddingTop: '40px', maxWidth: '900px' }}>
            <header style={styles.header}>
                <h1 style={{ color: "#fff" }}>Admin Dashboard</h1>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </header>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ color: "#ccc" }}>Flagged Posts ({groupedList.length})</h2>
                    <button onClick={fetchReports} style={styles.refreshBtn}>Refresh</button>
                </div>

                {loading ? (
                    <p style={{ color: "#fff" }}>Loading reports...</p>
                ) : groupedList.length === 0 ? (
                    <p style={{ color: "#666" }}>No active reports. Clean sheet!</p>
                ) : (
                    <div style={styles.list}>
                        {groupedList.map((group) => (
                            <div key={group.post.id} style={styles.reportCard}>

                                {/* POST HEADER */}
                                <div style={styles.postPreview}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ color: "#fff", margin: "0 0 5px 0" }}>{group.post.college}</h3>
                                        <span style={{ color: '#666', fontSize: '12px' }}>{new Date(group.post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ color: "#ccc", fontSize: "15px" }}>{group.post.caption}</p>
                                    {group.post.media_url && <a href={group.post.media_url} target="_blank" rel="noreferrer" style={styles.link}>View Post Media</a>}
                                </div>

                                <h4 style={{ color: "#ff4d4d", marginTop: "20px", marginBottom: "10px" }}>
                                    Reports ({group.reports.length})
                                </h4>

                                {/* REPORT LIST */}
                                <div style={styles.reportsGrid}>
                                    {group.reports.map(report => (
                                        <div key={report.id} style={styles.miniReport}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={report.report_type === 'true' ? styles.badgeTrue : styles.badgeFalse}>
                                                    Claim: {report.report_type?.toUpperCase()}
                                                </span>
                                                <span style={{ color: '#555', fontSize: '11px' }}>{new Date(report.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ color: "#ddd", margin: "8px 0", fontSize: "13px" }}>"{report.report_text}"</p>
                                            {report.proof_url && renderProof(report.proof_url)}
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.actions}>
                                    <button
                                        onClick={() => deletePost(group.post.id)}
                                        style={styles.deleteBtn}
                                    >
                                        DELETE POST & DATA
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
    },
    loginBox: {
        background: "#1a1a1a",
        padding: "40px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.1)",
        textAlign: "center",
        width: "300px"
    },
    input: {
        display: "block",
        width: "100%",
        padding: "10px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#000",
        color: "#fff",
    },
    btn: {
        width: "100%",
        padding: "10px",
        background: "#fff",
        color: "#000",
        fontWeight: "bold",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        paddingBottom: "20px"
    },
    logoutBtn: {
        background: "none",
        border: "1px solid #333",
        color: "#ccc",
        padding: "5px 15px",
        borderRadius: "5px",
        cursor: "pointer"
    },
    refreshBtn: {
        background: "none",
        color: "#00f2ea",
        border: "none",
        cursor: "pointer",
        fontSize: "14px"
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "30px"
    },
    reportCard: {
        background: "#111",
        padding: "25px",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.05)"
    },
    postPreview: {
        background: "#1a1a1a",
        padding: "20px",
        borderRadius: "15px",
        border: "1px solid rgba(255,255,255,0.05)"
    },
    reportsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '15px'
    },
    miniReport: {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        padding: '15px',
        border: '1px solid rgba(255,255,255,0.05)'
    },
    badgeTrue: {
        background: "rgba(0, 255, 0, 0.1)",
        color: "#00ff00",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: "bold"
    },
    badgeFalse: {
        background: "rgba(255, 0, 0, 0.1)",
        color: "#ff4d4d",
        padding: "2px 6px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: "bold"
    },
    link: {
        color: "#00f2ea",
        textDecoration: "none",
        fontSize: "12px"
    },
    actions: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "flex-end",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "20px"
    },
    deleteBtn: {
        background: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "100px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(255, 77, 77, 0.3)"
    }
};
