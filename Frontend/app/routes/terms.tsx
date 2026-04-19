export default function TermsOfService() {
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
            <span className="font-extralight text-text-primary">Terms of </span>
            <span className="font-bold text-gradient-red">Service</span>
          </h1>
          <p className="text-xs font-light text-text-muted mb-10">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="space-y-8 text-sm font-light text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using BroBalance, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">2. Description of Service</h2>
              <p>
                BroBalance is a web application that helps friends track shared expenses, manage balances, and settle debts. It is provided as-is for personal, non-commercial use.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">3. User Accounts</h2>
              <p>
                You must create an account to use BroBalance. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">4. Acceptable Use</h2>
              <p>
                You agree not to misuse the service, including but not limited to: attempting to gain unauthorized access, transmitting harmful code, using the service for fraudulent purposes, or violating any applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">5. Content &amp; Data</h2>
              <p>
                You retain ownership of the data you enter into BroBalance. By using the service, you grant us a limited license to store and process your data as necessary to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">6. Limitation of Liability</h2>
              <p>
                BroBalance is not a financial institution. We do not process payments or handle real money. The service is a tracking tool only. We are not liable for any disputes, losses, or damages arising from the use of this service.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account at our discretion if you violate these terms. You may delete your account at any time.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">8. Changes to Terms</h2>
              <p>
                We may modify these Terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-text-primary mb-3">9. Contact</h2>
              <p>
                For questions about these Terms, please reach out through the Contact form on our website.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
