import Head from "next/head";

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — FocusStar</title>
        <meta name="description" content="FocusStar Privacy Policy" />
      </Head>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e0e0e0", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Privacy Policy — FocusStar</h1>
        <p style={{ color: "#888", marginBottom: 32 }}>Last updated: April 6, 2026</p>

        <Section title="Summary">
          <ul>
            <li>All your data stays on your device.</li>
            <li>No accounts. No sign-up. No server.</li>
            <li>AI features send only the text you choose to process. Nothing else.</li>
            <li>No ads. No tracking. No analytics.</li>
          </ul>
        </Section>

        <Section title="Data Storage">
          <p>All task, habit, mood, focus session, and gamification data is stored locally on your device using Apple&apos;s SwiftData framework. No data is transmitted to any server owned or operated by the Developer. There is no user account system and no cloud sync.</p>
          <p>If you use widgets, task and habit data is shared between the main app and widget extension via a local App Group container on your device. This data never leaves your device.</p>
        </Section>

        <Section title="AI Features (Brain Dump)">
          <p>The Brain Dump feature sends the text you enter to Anthropic&apos;s Claude API (primary) or OpenAI&apos;s API (fallback) for processing. Only the text you explicitly submit is sent. No other app data — including tasks, moods, health data, or usage patterns — is included in AI requests.</p>
          <p>By using the Brain Dump feature, you consent to the transfer of the text you submit to servers operated by Anthropic (USA) and/or OpenAI (USA). This constitutes a cross-border transfer of data. These providers process your data according to their own privacy policies:</p>
          <ul>
            <li><a href="https://www.anthropic.com/privacy" style={{ color: "#6cb4ff" }}>Anthropic Privacy Policy</a></li>
            <li><a href="https://openai.com/privacy" style={{ color: "#6cb4ff" }}>OpenAI Privacy Policy</a></li>
          </ul>
          <p>You can use the App without the Brain Dump feature. All other features work entirely offline.</p>
          <p>If you encounter objectionable or inappropriate AI-generated content, please report it to <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a>.</p>
        </Section>

        <Section title="HealthKit Data (Sensitive Personal Data)">
          <p>If you grant permission, the App reads the following HealthKit data types: sleep analysis, exercise minutes, and heart rate variability (HRV). Under the Information Technology (SPDI) Rules, 2011, health data is classified as Sensitive Personal Data or Information.</p>
          <p>This data is used solely to display wellness context within the App to help you understand how physical health relates to your productivity. HealthKit data is never transmitted externally, never sent to AI services, never shared with third parties, never stored in iCloud, and never used for advertising, data mining, or analytics. You can revoke HealthKit access and withdraw consent at any time in iOS Settings.</p>
        </Section>

        <Section title="Calendar Data">
          <p>If you grant permission, the App reads your calendar events to display upcoming events and time-until-next-event countdowns. Calendar data is read-only, never modified, and never transmitted externally.</p>
        </Section>

        <Section title="Subscriptions">
          <p>FocusStar Pro subscriptions are managed by RevenueCat. RevenueCat processes your subscription status using your anonymous App Store identifier. No personal information (name, email, etc.) is shared with RevenueCat. See <a href="https://www.revenuecat.com/privacy" style={{ color: "#6cb4ff" }}>RevenueCat&apos;s privacy policy</a>.</p>
        </Section>

        <Section title="Data Collection Summary">
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={{ textAlign: "left", padding: 8 }}>Data Type</th>
                <th style={{ textAlign: "left", padding: 8 }}>Collected?</th>
                <th style={{ textAlign: "left", padding: 8 }}>Shared?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Tasks, habits, moods", "Stored locally", "No"],
                ["Brain dump text", "Sent to AI provider", "Anthropic/OpenAI"],
                ["HealthKit data", "Read locally", "No"],
                ["Calendar events", "Read locally", "No"],
                ["Subscription status", "Via RevenueCat", "Anonymous ID only"],
                ["Usage analytics", "No", "No"],
                ["Advertising data", "No", "No"],
                ["Location data", "No", "No"],
              ].map(([type, collected, shared], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: 8 }}>{type}</td>
                  <td style={{ padding: 8 }}>{collected}</td>
                  <td style={{ padding: 8 }}>{shared}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Data Retention and Deletion">
          <p>All data is stored locally on your device. You can delete all app data at any time by deleting the App or using the data reset option in Settings. No data is retained by the Developer after deletion because no data is ever transmitted to the Developer&apos;s servers.</p>
        </Section>

        <Section title="Your Privacy Rights">
          <p>Because FocusStar does not collect, store, or transmit personal data to any server, there is no personal data held by the Developer to access, correct, or delete. HealthKit and calendar data are read locally and never transmitted.</p>
          <p>You have the right to withdraw consent for any data processing at any time. For HealthKit and calendar data, revoke access in iOS Settings. For the Brain Dump feature, simply stop using the feature — no prior submissions are stored by the Developer.</p>
          <p>This applies regardless of your jurisdiction, including under the Digital Personal Data Protection Act, 2023 (India), the IT (SPDI) Rules, 2011 (India), the GDPR (EU), and the CCPA (California).</p>
        </Section>

        <Section title="Tracking">
          <p>FocusStar does not use Apple&apos;s AppTrackingTransparency framework because no cross-app or cross-site tracking occurs. The App contains no advertising SDKs, analytics trackers, or fingerprinting.</p>
        </Section>

        <Section title="Children's Privacy">
          <p>The App is intended for users aged 13 and above. The App does not knowingly collect or transmit data from children under 13. All data is stored locally on the device.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>If this policy changes, the updated version will be posted at this URL with a new &ldquo;last updated&rdquo; date.</p>
        </Section>

        <Section title="Grievance Officer">
          <p>In accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, the Grievance Officer is:</p>
          <p>Name: Pragyan Das</p>
          <p>Email: <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a></p>
          <p>Complaints will be acknowledged within 48 hours and resolved within one month of receipt.</p>
        </Section>

        <Section title="Contact">
          <p>Email: <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff" }}>pragyan0506@gmail.com</a></p>
          <p>GitHub: <a href="https://github.com/PragyanD" style={{ color: "#6cb4ff" }}>github.com/PragyanD</a></p>
        </Section>

        <Section title="Applicable Law">
          <p>This Privacy Policy is published in compliance with the Information Technology Act, 2000 (Section 43A), the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023 (to the extent notified and in force).</p>
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
