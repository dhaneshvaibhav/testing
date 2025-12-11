import React from 'react';
import { Home, PlusCircle, Search, Info, MapPin, Shield, EyeOff } from 'lucide-react';

export default function About() {
    return (
        <div className="container-narrow" style={{ paddingTop: '80px', color: '#fff' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: '900' }}>
                    The REAL Truth Comes Out
                </h1>
                <p style={{ color: '#ff6b6b', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto', fontWeight: '600' }}>
                    Tired of lies? Colleges hiding their dirty secrets? Students suffering in silence? <br />
                    Welcome to the place where truth cannot be suppressed.
                </p>
            </header>

            <section style={styles.section}>
                <h2 style={styles.heading}>What Is This?</h2>
                <p style={styles.text}>
                    This is YOUR private space. No accounts. No tracking. No bullshit. Just raw, unfiltered truth about colleges,
                    students, placements, faculty, infrastructure, and everything else that institutions want to hide from the world.
                </p>
                <p style={styles.text}>
                    You've been lied to enough. Cut-throat placements? Fake statistics? Toxic campus culture?
                    Overpriced fees? Pathetic faculty? Call it out HERE. No one will know who you are. Fear disappears. Shyness vanishes.
                    <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}> Only the truth remains.</span>
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>Location & Privacy</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <p style={styles.text}>
                            <MapPin style={{ verticalAlign: 'middle', marginRight: '8px', color: '#00f2ea' }} />
                            <strong style={{ color: '#fff' }}>Location Features:</strong> We ask for your location ONLY when you want to
                            see "Nearby" posts or when you create a post. This helps us show you what's happening around you.
                        </p>
                        <p style={styles.text}>
                            <Shield style={{ verticalAlign: 'middle', marginRight: '8px', color: '#00f2ea' }} />
                            <strong style={{ color: '#fff' }}>City-Level Only:</strong> We DO NOT store your exact coordinates.
                            We only save your <strong>City</strong> (e.g., "Mumbai"). Your precise location remains private.
                        </p>
                        <p style={styles.text}>
                            <EyeOff style={{ verticalAlign: 'middle', marginRight: '8px', color: '#00f2ea' }} />
                            <strong style={{ color: '#fff' }}>Optional:</strong> You DO NOT need to give location permission to
                            view posts or comment. It's completely optional.
                        </p>
                    </div>
                </div>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>Your Voice, Your Power</h2>
                <p style={styles.text}>
                    Complete anonymity. Zero login required. Zero tracking. You don't need to be anyone.
                    Just come, speak, and vanish. Your college can't identify you. Your peers can't trace you.
                    Your fears are gone.
                </p>
                <p style={styles.text}>
                    Workplaces, colleges, coaching centers, universities - it doesn't matter.
                    If the truth needs to come out, THIS is the platform.
                </p>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>How To Use This</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <Home size={32} color="#00f2ea" style={{ marginBottom: '15px' }} />
                        <h3 style={styles.cardTitle}>HOME</h3>
                        <p style={styles.cardText}>Browse all the hot posts from your college and others. See what everyone's really thinking.</p>
                    </div>

                    <div style={styles.card}>
                        <PlusCircle size={32} color="#00f2ea" style={{ marginBottom: '15px' }} />
                        <h3 style={styles.cardTitle}>POST</h3>
                        <p style={styles.cardText}>Drop your truth. Spill the tea. Share what happened. Let the world know. Anonymous. Always.</p>
                    </div>

                    <div style={styles.card}>
                        <Search size={32} color="#00f2ea" style={{ marginBottom: '15px' }} />
                        <h3 style={styles.cardTitle}>SEARCH</h3>
                        <p style={styles.cardText}>Find posts by college, topic, tags, or anything. Search for specific truths you need to know.</p>
                    </div>

                    <div style={styles.card}>
                        <Info size={32} color="#00f2ea" style={{ marginBottom: '15px' }} />
                        <h3 style={styles.cardTitle}>ABOUT</h3>
                        <p style={styles.cardText}>You're here. Get to know what this platform is really about.</p>
                    </div>
                </div>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>What Can You Do?</h2>
                <div style={styles.featureList}>
                    <div style={styles.feature}>
                        <h3 style={{ color: '#00f2ea', marginBottom: '8px' }}>UPVOTE & DOWNVOTE</h3>
                        <p style={styles.text}>
                            No limits. Vote as many times as you want. Upvote if you agree? Do it 5 times.
                            Downvote if it's nonsense? Smash that button 10 times. Let your emotions flow.
                        </p>
                    </div>

                    <div style={styles.feature}>
                        <h3 style={{ color: '#00f2ea', marginBottom: '8px' }}>COMMENTS</h3>
                        <p style={styles.text}>
                            Scold. Appreciate. Argue. Thank. Debate. Expose. Comment as much as you want,
                            however you want. Express your real thoughts without filters.
                        </p>
                    </div>

                    <div style={styles.feature}>
                        <h3 style={{ color: '#ff6b6b', marginBottom: '8px' }}>REPORT FALSE CLAIMS</h3>
                        <p style={styles.text}>
                            Found a lie? Call it out. Mark it as TRUE or FALSE. Upload proof. Let the community know
                            which posts are spreading fake information. Actions will be taken against misleading posts.
                        </p>
                    </div>
                </div>
            </section>

            <section style={styles.section}>
                <h2 style={styles.heading}>The Rules</h2>
                <p style={styles.text}>
                    Spread lies? Report false info. Make false claims without proof? The community will expose you.
                    This isn't a platform to destroy anyone - it's a platform for TRUTH.
                    Report posts that are clearly fake, defamatory, or misleading. Evidence matters. Truth wins.
                </p>
            </section>

            <section style={{ ...styles.section, background: 'rgba(255, 107, 107, 0.1)', borderColor: '#ff6b6b' }}>
                <h2 style={{ ...styles.heading, color: '#ff6b6b' }}>One Mission</h2>
                <p style={styles.text}>
                    Institutions. Professors. Companies. They don't want you to know the truth.
                    They want you to stay in the dark. Stay scared. Stay silent.
                </p>
                <p style={{ ...styles.text, color: '#fff', fontWeight: '600', fontSize: '1.2rem' }}>
                    But here? Here, silence is broken. Fear is gone. And TRUTH takes the throne.
                </p>
                <p style={styles.text}>
                    This is your space. Own it. Use it. Change things with it.
                    Because sometimes, anger brings the most powerful truth.
                </p>
            </section>
        </div>
    );
}

const styles = {
    section: {
        marginBottom: '60px',
        background: '#1a1a1a',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)'
    },
    heading: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#fff',
        fontWeight: '800'
    },
    text: {
        fontSize: '1.05rem',
        lineHeight: '1.8',
        color: '#ddd',
        marginBottom: '16px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '30px'
    },
    card: {
        background: 'rgba(255,255,255,0.03)',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        transition: 'all 0.3s',
        cursor: 'pointer',
    },
    cardTitle: {
        fontSize: '1.3rem',
        marginBottom: '12px',
        color: '#00f2ea',
        fontWeight: '700'
    },
    cardText: {
        color: '#aaa',
        fontSize: '0.98rem',
        lineHeight: '1.6'
    },
    featureList: {
        marginTop: '30px'
    },
    feature: {
        background: 'rgba(255,255,255,0.03)',
        padding: '28px',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '20px'
    }
};
