import Head from "next/head";
import Link from "next/link";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — FocusStar</title>
        <meta name="description" content="FocusStar Terms of Service" />
      </Head>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e0e0e0", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Terms of Service — FocusStar</h1>
        <p style={{ color: "#888", marginBottom: 32 }}>Last updated: April 6, 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>By downloading, installing, or using FocusStar (&ldquo;the App&rdquo;), you agree to these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the App. You must be at least 13 years old to use the App.</p>
          <p>These Terms supplement, and do not replace, Apple&apos;s standard Licensed Application End User License Agreement (EULA). In the event of a conflict, the more restrictive term applies.</p>
        </Section>

        <Section title="2. License">
          <p>Pragyan Das (&ldquo;Developer&rdquo;) grants you a limited, non-exclusive, non-transferable, revocable license to use the App on any Apple device you own or control, as permitted by the App Store Terms of Service. You may not:</p>
          <ul>
            <li>Copy, modify, distribute, sell, or lease any part of the App.</li>
            <li>Reverse-engineer, decompile, or disassemble the App.</li>
            <li>Use the App for any unlawful purpose.</li>
            <li>Attempt to extract the source code of the App.</li>
          </ul>
        </Section>

        <Section title="3. Subscriptions and Payments">
          <p>FocusStar offers an optional auto-renewable subscription (&ldquo;FocusStar Pro&rdquo;) available as a monthly or yearly plan. FocusStar Pro unlocks premium features including additional AI brain dumps, cosmetic themes, and advanced analytics.</p>
          <ul>
            <li>Payment is charged to your Apple ID account at confirmation of purchase.</li>
            <li>Your subscription automatically renews unless you turn off auto-renewal at least 24 hours before the end of the current billing period.</li>
            <li>Your account will be charged for renewal within 24 hours prior to the end of the current period at the rate of your selected plan.</li>
            <li>You can manage your subscription and turn off auto-renewal in your device&apos;s Account Settings at any time after purchase, or via <a href="https://apps.apple.com/account/subscriptions" style={{ color: "#6cb4ff" }}>Apple Subscription Management</a>.</li>
            <li>If you cancel, you retain access to Pro features until the end of your current billing period.</li>
            <li>Any unused portion of a free trial period, if offered, is forfeited when you purchase a subscription.</li>
          </ul>
          <p>Subscription prices are displayed in the App at the point of purchase and may vary by region. The Developer reserves the right to change pricing; any price change will take effect at the start of your next billing cycle after notice.</p>
        </Section>

        <Section title="4. AI Features">
          <p>The App&apos;s Brain Dump feature uses third-party AI services (Anthropic Claude API and OpenAI API) to process text you submit. By using this feature, you acknowledge that:</p>
          <ul>
            <li>Only the text you explicitly submit is sent to the AI provider. No other app data is included.</li>
            <li>AI-generated output (task suggestions, organization) may not always be accurate, complete, or appropriate. You are responsible for reviewing and accepting any AI suggestions before acting on them.</li>
            <li>AI features are subject to rate limits (5 per day for free users, 100 per day for Pro users) and may be unavailable due to third-party service outages.</li>
            <li>Third-party AI providers process your data under their own terms and privacy policies.</li>
            <li>You must not submit illegal, harmful, or abusive content to the AI features.</li>
          </ul>
          <p>If you encounter objectionable or inappropriate AI-generated content, please report it to <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a>.</p>
        </Section>

        <Section title="5. Health Data">
          <p>The App may request access to Apple HealthKit data (sleep analysis, exercise minutes, heart rate variability). By granting access, you acknowledge that:</p>
          <ul>
            <li>HealthKit data is used solely to display wellness context within the App.</li>
            <li>HealthKit data is never transmitted externally, sold, shared with third parties, used for advertising, or used for data mining.</li>
            <li>HealthKit data is not stored in iCloud.</li>
            <li>You may revoke HealthKit access at any time in iOS Settings.</li>
          </ul>
        </Section>

        <Section title="6. Calendar Data">
          <p>If you grant calendar access, the App reads your events in read-only mode to display upcoming events and countdowns. Calendar data is never modified, stored externally, or shared.</p>
        </Section>

        <Section title="7. User Data and Privacy">
          <p>Your use of the App is also governed by our <Link href="/focusstar/privacy" style={{ color: "#6cb4ff" }}>Privacy Policy</Link>. All task, habit, mood, and gamification data is stored locally on your device. The App does not require an account, does not collect personal information, and does not use analytics or advertising trackers.</p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>All content, design, graphics, and code in the App are owned by the Developer and protected by applicable intellectual property laws. The FocusStar name, logo, and associated branding are the property of the Developer.</p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. The Developer does not warrant that the App will be uninterrupted, error-free, or free of harmful components.</p>
          <p>The App is a productivity tool and is not a substitute for professional medical, psychological, or therapeutic advice. Do not rely on the App for health decisions.</p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, the Developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, use, or profits, arising out of or related to your use of the App, regardless of the theory of liability.</p>
          <p>In no event shall the Developer&apos;s total liability exceed the amount you paid for the App or subscription in the twelve (12) months preceding the claim.</p>
        </Section>

        <Section title="11. Termination">
          <p>The Developer may terminate or suspend your access to the App at any time, without notice, for conduct that violates these Terms or is otherwise harmful. Upon termination, your license to use the App is revoked. Sections 8 through 10 survive termination.</p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>The Developer may update these Terms from time to time. The updated version will be posted at this URL with a new &ldquo;last updated&rdquo; date. Continued use of the App after changes constitutes acceptance of the revised Terms.</p>
        </Section>

        <Section title="13. Grievance Officer">
          <p>In accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, the Grievance Officer for the App is:</p>
          <p>Name: Pragyan Das</p>
          <p>Email: <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a></p>
          <p>Complaints will be acknowledged within 48 hours and resolved within one month of receipt.</p>
        </Section>

        <Section title="14. Dispute Resolution">
          <p>If you have a dispute regarding the App or these Terms, please contact the Grievance Officer by email first. The Developer will attempt to resolve the dispute informally within 30 days.</p>
          <p>Nothing in these Terms restricts your statutory rights under the Consumer Protection Act, 2019, including your right to approach the appropriate Consumer Disputes Redressal Commission in your jurisdiction.</p>
          <p>For disputes not covered under consumer protection laws, the courts in Kolkata, India shall have exclusive jurisdiction.</p>
        </Section>

        <Section title="15. Severability">
          <p>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions will remain in full force and effect.</p>
        </Section>

        <Section title="16. Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000, the Consumer Protection Act, 2019, and the Digital Personal Data Protection Act, 2023 (to the extent notified and in force).</p>
        </Section>

        <Section title="17. Contact">
          <p>For questions about these Terms:</p>
          <p>Email: <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a></p>
          <p>GitHub: <a href="https://github.com/PragyanD" style={{ color: "#6cb4ff" }}>github.com/PragyanD</a></p>
        </Section>

        <p style={{ color: "#555", marginTop: 40, fontSize: 14 }}>FocusStar is built and maintained by Pragyan Das as an independent developer.</p>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12, color: "#fff" }}>{title}</h2>
      <div style={{ lineHeight: 1.7, color: "#ccc" }}>{children}</div>
    </section>
  );
}
