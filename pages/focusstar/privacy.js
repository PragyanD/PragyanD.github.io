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
          <p>AI providers process this data according to their own privacy policies:</p>
          <ul>
            <li><a href="https://www.anthropic.com/privacy" style={{ color: "#6cb4ff" }}>Anthropic Privacy Policy</a></li>
            <li><a href="https://openai.com/privacy" style={{ color: "#6cb4ff" }}>OpenAI Privacy Policy</a></li>
          </ul>
          <p>You can use the App without the Brain Dump feature. All other features work entirely offline.</p>
        </Section>

        <Section title="HealthKit Data">
          <p>If you grant permission, the App reads the following HealthKit data types: sleep analysis, exercise minutes, and heart rate variability (HRV).</p>
          <p>This data is displayed within the App to help you understand how physical health relates to your productivity. HealthKit data is never transmitted externally, never sent to AI services, never shared with third parties, and never used for advertising or analytics. You can revoke HealthKit access at any time in iOS Settings.</p>
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

        <Section title="Children's Privacy">
          <p>The App does not knowingly collect data from children under 13. The App does not require an account and stores all data locally.</p>
        </Section>

        <Section title="Changes to This Policy">
          <p>If this policy changes, the updated version will be posted at this URL with a new &ldquo;last updated&rdquo; date.</p>
        </Section>

        <Section title="Contact">
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
