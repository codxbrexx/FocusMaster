export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 prose prose-invert prose-blue fade-in">
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <h2>1. Information We Collect</h2>
      <p>We collect information to provide better services to our users. This includes:</p>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, and hashed password.</li>
        <li><strong>Activity Data:</strong> Tasks, focus sessions, work logs, and timestamps.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, and device information (only with explicit consent when submitting bug reports).</li>
        <li><strong>Analytics:</strong> Page views and feature usage (only if you consent to analytics cookies).</li>
      </ul>
      
      <h2>2. How We Use Your Data</h2>
      <p>Your data is used exclusively to:</p>
      <ul>
        <li>Provide, maintain, and improve our services.</li>
        <li>Send you important administrative updates and security alerts.</li>
        <li>Analyze usage patterns to improve user experience (with consent).</li>
        <li>Comply with legal obligations.</li>
      </ul>
      
      <h2>3. Data Retention</h2>
      <p>We have strict data retention policies to ensure we only keep data as long as necessary:</p>
      <ul>
        <li><strong>Account Information:</strong> Kept until you request account deletion.</li>
        <li><strong>Activity Data (Tasks/Sessions):</strong> Kept for 30 days of inactivity, then permanently deleted.</li>
        <li><strong>Analytics & Error Logs:</strong> Kept for up to 90 days.</li>
      </ul>
      
      <h2>4. Your Rights (GDPR / CCPA)</h2>
      <p>Depending on your location, you may have the following rights regarding your data:</p>
      <ul>
        <li><strong>Right to Access:</strong> You can download a complete JSON export of your data from the Settings page.</li>
        <li><strong>Right to Erasure (Right to be Forgotten):</strong> You can permanently delete your account and all associated data from the Settings page.</li>
        <li><strong>Right to Restrict Processing:</strong> You can opt-out of non-essential cookies via our Cookie Preferences.</li>
      </ul>
      
      <h2>5. Third-Party Services</h2>
      <p>We may use third-party services such as Spotify (for music integration). We do not sell your personal data to any third party.</p>
      
      <h2>6. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy or your data, please contact our support team at privacy@focusmaster.app.</p>
    </div>
  );
}
