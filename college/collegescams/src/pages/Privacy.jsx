import React from 'react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', borderBottom: '2px solid #00FFE4', paddingBottom: '10px' }}>Privacy Policy</h1>
      <p style={{ color: '#666', fontSize: '14px' }}><strong>Last updated:</strong> December 13, 2025</p>

      <h2 style={{ color: '#4CAF50', marginTop: '30px' }}>1. Information We Collect</h2>
      <p>We collect minimal information to operate this anonymous platform:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li><strong>No personal data:</strong> We do not collect names, emails, phone numbers, or any personally identifiable information</li>
        <li><strong>Anonymous content:</strong> Posts, comments, and votes are completely anonymous</li>
        <li><strong>College information:</strong> Only college names for content organization and search functionality</li>
        <li><strong>Technical data:</strong> Basic analytics for platform improvement (no IP addresses stored)</li>
        <li><strong>Cookies:</strong> Only essential cookies for functionality (see our cookie policy)</li>
      </ul>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>2. How We Use Your Information</h2>
      <ul style={{ lineHeight: '1.6' }}>
        <li>Display anonymous posts and comments on the platform</li>
        <li>Organize content by college for better user experience</li>
        <li>Prevent spam and abuse through basic rate limiting</li>
        <li>Improve platform functionality and user experience</li>
        <li>Comply with legal obligations when required</li>
      </ul>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>3. Data Sharing and Third Parties</h2>
      <p style={{ fontWeight: 'bold', color: '#d32f2f' }}><strong>We do NOT sell, trade, or share your data with third parties.</strong></p>
      <p>Data is only used within our platform for content display and necessary platform operations. We may share information only when:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li>Required by law enforcement with proper legal documentation</li>
        <li>Necessary to prevent imminent harm or illegal activities</li>
        <li>You explicitly consent to data sharing</li>
      </ul>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>4. Your Rights (GDPR Compliance)</h2>
      <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>Important: Since our platform is completely anonymous and collects no personal data, traditional GDPR rights do not apply in the same way as platforms that collect user accounts or personal information.</p>
      <p>However, you still have rights regarding content you create:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li><strong>Content Removal:</strong> You can request removal of specific content you've created by providing identifiable details about the post/comment</li>
        <li><strong>No Personal Data Storage:</strong> We don't store any personal data, so rights like "right to access" or "right to data portability" don't apply</li>
        <li><strong>Anonymous Nature:</strong> Due to the anonymous design, we cannot verify content ownership or fulfill traditional data subject rights</li>
        <li><strong>Report for Removal:</strong> If you can identify your own content, you can report it for removal through our reporting system</li>
        <li><strong>Platform Transparency:</strong> You have the right to know that no personal data is collected or stored</li>
      </ul>
      <p style={{ fontStyle: 'italic', color: '#666' }}>For users concerned about GDPR compliance: Our anonymous design means we don't process personal data, so GDPR data subject rights are not applicable to this platform.</p>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>5. Data Retention</h2>
      <p>Anonymous posts and comments are retained indefinitely unless:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li>Content is reported and removed for violating our terms of service</li>
        <li>Legal requirements demand removal</li>
        <li>Platform is discontinued</li>
        <li>Content is identified for removal through our content moderation process</li>
      </ul>
      <p style={{ fontStyle: 'italic', color: '#666' }}>Due to the anonymous nature of our platform, individual users cannot directly request deletion of their content. Content removal occurs through our moderation system or legal requirements.</p>
      <p>Technical logs are automatically deleted after 30 days.</p>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>6. Cookies and Tracking</h2>
      <p>We use minimal cookies for essential functionality:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li><strong>Essential cookies:</strong> Required for platform operation</li>
        <li><strong>Preference cookies:</strong> Remember your settings (optional)</li>
        <li><strong>Analytics cookies:</strong> Basic usage statistics (optional)</li>
      </ul>
      <p>You can control cookie preferences through our cookie consent banner.</p>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>7. Children's Privacy (COPPA)</h2>
      <p>Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are under 13, please do not use this platform.</p>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>8. Data Security</h2>
      <p>We implement appropriate technical and organizational measures to protect your data:</p>
      <ul style={{ lineHeight: '1.6' }}>
        <li>Data encryption in transit and at rest</li>
        <li>Regular security audits</li>
        <li>Limited access to data</li>
        <li>Secure hosting infrastructure</li>
      </ul>

      <h2 style={{ color: '#00FFE4', marginTop: '30px' }}>9. International Data Transfers</h2>
      <p>Your data may be processed and stored in different countries. We ensure appropriate safeguards are in place for international data transfers.</p>

      <h2 style={{ color: '#4CAF50', marginTop: '30px' }}>10. Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify users of significant changes through platform announcements or email (if applicable).</p>

      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
          <strong>Disclaimer:</strong> This platform provides a space for anonymous sharing of experiences.
          While we strive to protect user privacy, the nature of anonymous platforms means we cannot guarantee
          complete anonymity. Users should exercise caution when sharing sensitive information.
        </p>
      </div>
    </div>
  );
}