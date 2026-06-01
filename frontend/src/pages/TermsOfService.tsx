export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 prose prose-invert prose-blue fade-in">
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using FocusMaster ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service.</p>
      
      <h2>2. Description of Service</h2>
      <p>FocusMaster provides productivity tools including task management, Pomodoro timers, and analytics. We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice.</p>
      
      <h2>3. User Accounts</h2>
      <p>You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
      
      <h2>4. Acceptable Use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Violate any local, state, national, or international laws.</li>
        <li>Attempt to bypass any security measures or access data not intended for you.</li>
        <li>Interfere with or disrupt the Service or servers.</li>
        <li>Automate usage of the Service (e.g., bots, scrapers) without explicit permission.</li>
      </ul>
      
      <h2>5. Intellectual Property</h2>
      <p>The Service and its original content, features, and functionality are owned by FocusMaster and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>In no event shall FocusMaster be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
      
      <h2>7. Termination</h2>
      <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
      
      <h2>8. Dispute Resolution</h2>
      <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which FocusMaster operates, without regard to its conflict of law provisions.</p>
      
      <h2>9. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at legal@focusmaster.app.</p>
    </div>
  );
}
