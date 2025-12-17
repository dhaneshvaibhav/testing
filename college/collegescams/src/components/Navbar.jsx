import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const location = useLocation()
    const active = location.pathname

    return (
        <nav style={styles.navbar}>
            <div style={styles.container}>
                <div style={styles.navBrand}>
                    <span style={{ color: 'var(--primary)' }}>Colleg</span>
                    <span style={{ color: '#fff' }}>A</span>
                    <span style={{ color: 'var(--primary)' }}>e</span>
                    <span style={{ color: '#fff' }}>SS</span>
                </div>

                <div style={styles.navLinks}>
                    <Link style={active === '/home' ? styles.activeLink : styles.link} to="/home">Home</Link>
                    <Link style={active === '/' ? styles.activeLink : styles.link} to="/">Stream</Link>
                    <Link style={active === '/search' ? styles.activeLink : styles.link} to="/search">Search</Link>
                    <Link style={active === '/about' ? styles.activeLink : styles.link} to="/about">About</Link>
                </div>
            </div>
        </nav>
    )
}

const styles = {
    navbar: {
        width: '100%',
        padding: '20px 0',
        background: 'rgba(5, 5, 5, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-light)',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navBrand: {
        fontWeight: 800,
        fontSize: '24px',
        letterSpacing: '-1px',
        color: '#fff',
    },
    navLinks: {
        display: 'flex',
        gap: '30px',
    },
    link: {
        color: 'var(--text-secondary)',
        fontWeight: '600',
        fontSize: '15px',
        transition: 'color 0.2s',
    },
    activeLink: {
        color: 'var(--primary)',
        fontWeight: '600',
        fontSize: '15px',
    }
}

export default Navbar
