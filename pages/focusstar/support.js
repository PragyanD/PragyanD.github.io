import Head from "next/head";

export default function Support() {
  return (
    <>
      <Head>
        <title>Support — FocusStar</title>
        <meta name="description" content="FocusStar Support" />
      </Head>
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
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>Can I export my data?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>Yes. Go to Settings and use the data export option to export your tasks, habits, and mood data.</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, color: "#fff", marginBottom: 4 }}>My streak paused — is that a bug?</h3>
            <p style={{ color: "#ccc", lineHeight: 1.7 }}>No! FocusStar uses forgiving streaks. When you miss a day, your streak pauses instead of resetting to zero. Pick up where you left off.</p>
          </div>
        </section>

        <p style={{ color: "#555", marginTop: 40, fontSize: 14 }}>FocusStar is built and maintained by Pragyan Das.</p>
      </div>
    </>
  );
}
