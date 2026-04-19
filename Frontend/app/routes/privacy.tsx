export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-light text-text-muted hover:text-text-primary transition-colors mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </a>

        <div className="legal-container rounded-3xl p-8 md:p-12">
          <h1 className="mb-2" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.03em" }}>
            <span className="font-extralight text-text-primary">Privacy </span>
            <span className="font-bold text-gradient-red">Policy</span>
          </h1>
          <p className="text-xs font-light text-text-muted mb-10">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="space-y-8 text-sm font-light text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">1. Information We Collect</h2>
              <p>
                When you create an account via Google OAuth, we receive your name, email address, and profile picture from Google. We also collect transaction data you voluntarily enter — amounts, descriptions, and friend associations.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
              <p>
                Your data is used solely to provide the BroBalance service: tracking shared expenses, managing friend connections, and sending reminders. We do not sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">3. Data Storage &amp; Security</h2>
              <p>
                Your data is stored in a secured MongoDB database. We use JWT-based authentication and HTTPS encryption to protect data in transit. While no system is 100% secure, we take reasonable measures to safeguard your information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">4. Cookies &amp; Sessions</h2>
              <p>
                We use session cookies to maintain your login state. These are essential cookies required for the app to function. We do not use advertising or tracking cookies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">5. Newsletter</h2>
              <p>
                If you subscribe to our newsletter, we store your email address to send periodic updates. You can unsubscribe at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">6. Your Rights</h2>
              <p>
                You may request access to, correction of, or deletion of your personal data at any time by contacting us. Upon account deletion, all associated data will be permanently removed.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">7. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">8. Contact</h2>
              <p>
                If you have questions about this Privacy Policy, please reach out through the Contact form on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
