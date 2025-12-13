import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#1a1a1a',
      color: '#ccc',
      padding: '20px 0',
      marginTop: 'auto',
      borderTop: '1px solid #333'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <h3 style={{
            color: '#00FFE4',
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            collegaess
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.4',
            color: '#999'
          }}>
            Anonymous platform for sharing college experiences and information.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '30px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Link
            to="/about"
            style={{
              color: '#ccc',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#00FFE4'}
            onMouseOut={(e) => e.target.style.color = '#ccc'}
          >
            About
          </Link>

          <Link
            to="/privacy"
            style={{
              color: '#ccc',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#00FFE4'}
            onMouseOut={(e) => e.target.style.color = '#ccc'}
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms"
            style={{
              color: '#ccc',
              textDecoration: 'none',
              fontSize: '14px',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#00FFE4'}
            onMouseOut={(e) => e.target.style.color = '#ccc'}
          >
            Terms of Service
          </Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '20px auto 0',
        padding: '0 20px',
        borderTop: '1px solid #333',
        paddingTop: '15px',
        textAlign: 'center'
      }}>
        <p style={{
          margin: 0,
          fontSize: '12px',
          color: '#777'
        }}>
          © 2025 collegaess. All rights reserved. |
          <span style={{ marginLeft: '10px' }}>
            Built for educational transparency and student empowerment.
          </span>
        </p>
      </div>
    </footer>
  );
}