import React from 'react';
import { Ban, Camera, Zap, Plus } from 'lucide-react';

function StartingPage() {
    return (
        <div className="container">
            <div style={styles.content}>
                <header style={styles.hero}>
                    <div style={styles.pill}>Anonymous student voices</div>
                    <h1 style={styles.title}>Welcome to <span>
                        <span style={{ color: 'var(--primary)' }}>Colleg</span>
                        <span style={{ color: '#fff' }}>A</span>
                        <span style={{ color: 'var(--primary)' }}>e</span>
                        <span style={{ color: '#fff' }}>SS</span>
                    </span></h1>
                    <p style={{ ...styles.subtitle, fontSize: 'var(--font-size-lg)' }}>
                        Dumb things that our indian colleges do. Photos, videos, or text. <br />
                        <span style={{ color: '#fff', fontWeight: '600' }}>100% Anonymous.</span>
                    </p>

                    <div style={styles.bullets}>
                        <div style={styles.bullet}><Ban size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> No Names</div>
                        <div style={styles.bullet}><Camera size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Media Support</div>
                        <div style={styles.bullet}><Zap size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Instant</div>
                    </div>

                    <p style={styles.note}>Tap the <span style={{ color: 'var(--primary)', fontWeight: 'bold', display: 'inline-flex', verticalAlign: 'middle' }}><Plus size={16} /></span> button to start.</p>
                </header>

                {/* INFO GRID */}
                <section className="feed-grid" style={{ ...styles.infoGrid, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>What to post?</h3>
                        <ul style={styles.list}>
                            <li>Campus vibes & hostels</li>
                            <li>Classroom reality checks</li>
                            <li>Honest faculty reviews</li>
                        </ul>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Why we exist</h3>
                        <ul style={styles.list}>
                            <li>Unfiltered student truth</li>
                            <li>Safe space for opinions</li>
                            <li>Community awareness</li>
                        </ul>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Safety First</h3>
                        <ul style={styles.list}>
                            <li>Hide faces & IDs</li>
                            <li>No personal bullying</li>
                            <li>Keep it constructive</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
}

const styles = {
    content: {
        padding: '40px 0 120px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    hero: {
        textAlign: 'center',
        padding: '60px 20px',
        background: 'linear-gradient(180deg, rgba(20,20,20,0) 0%, rgba(0, 242, 234, 0.05) 100%)',
        borderRadius: '32px',
        border: '1px solid var(--glass-border)',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden',
    },
    pill: {
        display: 'inline-block',
        padding: '6px 16px',
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        color: 'var(--primary)',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '16px',
        letterSpacing: '-1px',
    },
    subtitle: {
        color: 'var(--text-muted)',
        lineHeight: '1.6',
        marginBottom: '30px',
    },
    bullets: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '30px',
    },
    bullet: {
        background: 'rgba(255,255,255,0.05)',
        padding: '10px 20px',
        borderRadius: '12px',
        fontWeight: '600',
        fontSize: '14px',
        border: '1px solid var(--glass-border)',
    },
    note: {
        fontSize: '14px',
        color: 'var(--text-muted)',
        opacity: 0.8,
    },
    infoGrid: {
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
    },
    card: {
        background: 'var(--bg-card)',
        backdropFilter: 'blur(var(--glass-blur))',
        padding: '30px',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        transition: 'transform 0.3s ease',
        flex: '1 1 280px',
        minWidth: '280px',
    },
    cardTitle: {
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '16px',
        color: 'var(--text-main)',
        borderBottom: '2px solid rgba(255,255,255,0.1)',
        paddingBottom: '10px',
        display: 'inline-block',
    },
    list: {
        paddingLeft: '20px',
        lineHeight: '1.8',
        color: 'var(--text-muted)',
    },
};

export default StartingPage;
