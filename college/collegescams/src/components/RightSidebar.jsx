import React from 'react';

export default function RightSidebar() {
    const trends = [
        { title: "#CampusLife", posts: "2.4k posts" },
        { title: "#Exams2024", posts: "1.1k posts" },
        { title: "#CollegeScams", posts: "856 posts" },
        { title: "#Freshers", posts: "540 posts" },
        { title: "#HostelFood", posts: "125 posts" }
    ];

    return (
        <aside style={styles.container}>
            {/* SEARCH BOX MOCKUP */}
            <div style={styles.searchBox}>
                <span style={styles.searchIcon}>🔍</span>
                <input type="text" placeholder="Search" style={styles.input} />
            </div>

            {/* TRENDING CARD */}
            <div style={styles.card}>
                <h3 style={styles.title}>Trending Now</h3>
                <div style={styles.list}>
                    {trends.map((t, i) => (
                        <div
                            key={i}
                            style={styles.item}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <div>
                                <div style={styles.trendTitle}>{t.title}</div>
                                <div style={styles.trendCount}>{t.posts}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER LINKS */}
            <div style={styles.footer}>
                <span style={styles.link}>Privacy</span> •
                <span style={styles.link}>Terms</span> •
                <span style={styles.link}>About</span>
                <div style={{ marginTop: '5px' }}>© 2025 CollegeApp</div>
            </div>
        </aside>
    );
}

const styles = {
    container: {
        width: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'sticky',
        top: '90px',
        height: 'fit-content'
    },
    searchBox: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '30px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease',
    },
    searchIcon: {
        color: 'var(--text-secondary)',
        fontSize: '18px',
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        outline: 'none',
        fontSize: '16px',
        width: '100%',
        fontWeight: '500',
    },
    card: {
        background: 'rgba(20, 20, 20, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    },
    title: {
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '20px',
        color: '#fff',
        letterSpacing: '-0.5px',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    item: {
        cursor: 'pointer',
        padding: '12px',
        borderRadius: '16px',
        transition: 'background 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trendTitle: {
        fontWeight: '700',
        color: '#fff',
        fontSize: '15px',
        marginBottom: '4px',
    },
    trendCount: {
        fontSize: '13px',
        color: 'var(--text-secondary)',
        fontWeight: '500',
    },
    footer: {
        fontSize: '13px',
        color: 'var(--text-tertiary)',
        padding: '0 16px',
        lineHeight: '1.6',
        fontWeight: '500',
    },
    link: {
        margin: '0 6px',
        cursor: 'pointer',
        transition: 'color 0.2s',
    }
};
