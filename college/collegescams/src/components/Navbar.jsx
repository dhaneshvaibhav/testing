import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
    const location = useLocation()
    const active = location.pathname
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="navbar">
            <div style={styles.navBrand}>
                <span style={{ color: 'var(--primary)' }}>Colleg</span>
                <span style={{ color: '#fff' }}>A</span>
                <span style={{ color: 'var(--primary)' }}>e</span>
                <span style={{ color: '#fff' }}>SS</span>
            </div>

            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <Link className={`nav-link ${active === '/home' ? 'active' : ''}`} to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link className={`nav-link ${active === '/' ? 'active' : ''}`} to="/" onClick={() => setIsMenuOpen(false)}>Posts</Link>
                <Link className={`nav-link ${active === '/search' ? 'active' : ''}`} to="/search" onClick={() => setIsMenuOpen(false)}>Search</Link>
                <Link className={`nav-link ${active === '/about' ? 'active' : ''}`} to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
            </div>
        </nav>
    )
}

const styles = {
    navBrand: {
        fontWeight: 800,
        fontSize: '20px',
        letterSpacing: '-0.5px',
        color: '#fff',
    }
}

export default Navbar
