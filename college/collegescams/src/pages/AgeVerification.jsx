import React, { useState, useEffect } from 'react';

export default function AgeVerification({ onVerified }) {
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    // Check if user has already verified age
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setIsVerified(true);
      setShowModal(false);
      onVerified && onVerified();
    }
  }, [onVerified]);

  const handleVerification = (confirmed) => {
    if (confirmed) {
      localStorage.setItem('ageVerified', 'true');
      setIsVerified(true);
      setShowModal(false);
      onVerified && onVerified();
    } else {
      // Redirect or show message for users under 13
      window.location.href = 'https://www.google.com/search?q=educational+resources+for+children';
    }
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>
            Age Verification Required
          </h2>
          <div style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#00FFE4',
            margin: '0 auto 20px'
          }}></div>
        </div>

        <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
          <p style={{ fontSize: '16px', color: '#555', marginBottom: '15px' }}>
            <strong>collegAeSS</strong> is designed for educational discussions and information sharing.
          </p>

          <div style={{
            backgroundColor: '#fff3cd',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #ffeaa7'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#856404' }}>
              <strong>COPPA Compliance Notice:</strong> This platform is not intended for children under 13 years of age.
              By proceeding, you confirm that you are at least 13 years old or have obtained parental consent.
            </p>
          </div>

          <p style={{ fontSize: '14px', color: '#666' }}>
            If you are under 13, please exit this site and visit age-appropriate educational resources.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '15px' }}>
            Are you at least 13 years old?
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleVerification(true)}
            style={{
              backgroundColor: '#00FFE4',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              minWidth: '120px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#00E4D1'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#00FFE4'}
          >
            Yes, I'm 13+
          </button>

          <button
            onClick={() => handleVerification(false)}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '12px 25px',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              minWidth: '120px'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            No, I'm under 13
          </button>
        </div>

        <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '12px', color: '#888', lineHeight: '1.4' }}>
            By continuing, you agree to our{' '}
            <a href="/terms" style={{ color: '#4CAF50', textDecoration: 'none' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" style={{ color: '#4CAF50', textDecoration: 'none' }}>
              Privacy Policy
            </a>.
            <br />
            This verification is stored locally and helps us comply with children's privacy laws.
          </p>
        </div>
      </div>
    </div>
  );
}