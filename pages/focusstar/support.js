import Head from "next/head";
import Link from "next/link";

export default function Support() {
  return (
    <>
      <Head>
        <title>Support — FocusStar</title>
        <meta name="description" content="FocusStar Support" />
      </Head>
      <style jsx global>{`
        html, body {
          overflow: auto !important;
          height: auto !important;
          user-select: text !important;
          -webkit-user-select: text !important;
        }
      `}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#e0e0e0", backgroundColor: "#0a0a0a", minHeight: "100vh" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>FocusStar Support</h1>
        <p style={{ color: "#888", marginBottom: 32 }}>Get help with FocusStar</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: "#fff" }}>Contact</h2>
          <p style={{ lineHeight: 1.7, color: "#ccc" }}>
            For bugs, feature requests, or questions, email me directly:
          </p>
          <p style={{ marginTop: 12 }}>
            <a href="mailto:pragyan0506@gmail.com" style={{ color: "#6cb4ff", fontSize: 18 }}>pragyan0506@gmail.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: "#fff" }}>FAQ</h2>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>Where is my data stored?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>All data is stored locally on your device. There are no accounts, no cloud sync, and no servers. Your tasks, moods, and habits never leave your phone.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>How does Brain Dump work?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>Brain Dump sends the text you type to an AI service (Claude or OpenAI) to organize it into tasks. Only the text you submit is sent — no other app data. Free users get 5 brain dumps per day; Pro users get 100.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>What does FocusStar Pro include?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>Pro unlocks 100 daily AI brain dumps, cosmetic sky themes and star styles, advanced analytics, and more. All core productivity features are free.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>How do I cancel FocusStar Pro?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>Open the Settings app on your iPhone, tap your name at the top, then tap Subscriptions. Find FocusStar and tap Cancel Subscription. You can also manage your subscription directly at <a href="https://apps.apple.com/account/subscriptions" style={{ color: "#6cb4ff" }}>Apple Subscription Management</a>. If you cancel, you keep Pro features until the end of your current billing period.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>Can I export my data?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>Yes. Go to Settings and use the data export option to export your tasks, habits, and mood data.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>My streak paused — is that a bug?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>No! FocusStar uses forgiving streaks. When you miss a day, your streak pauses instead of resetting to zero. Pick up where you left off.</p>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: "#fff" }}>Legal</h2>
          <p style={{ lineHeight: 1.7, color: "#ccc" }}>
            <Link href="/focusstar/privacy" style={{ color: "#6cb4ff" }}>Privacy Policy</Link>
            {" · "}
            <Link href="/focusstar/terms" style={{ color: "#6cb4ff" }}>Terms of Service</Link>
          </p>
        </section>

        <p style={{ color: "#555", marginTop: 40, fontSize: 14 }}>FocusStar is built and maintained by Pragyan Das. I typically respond to support emails within 48 hours.</p>
      </div>
    </>
  );
}
