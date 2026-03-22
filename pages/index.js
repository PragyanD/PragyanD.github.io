import { useState, useEffect } from "react";
import Head from "next/head";
import Desktop from "../components/Desktop";
import BootSequence from "../components/BootSequence";
import MobileLayout from "../components/MobileLayout";

export default function Home() {
  const [booting, setBooting] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("pdos_booted");
    if (hasBooted) {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleBootComplete = () => {
    setBooting(false);
    sessionStorage.setItem("pdos_booted", "true");
  };

  const handleRestart = () => {
    // Clear layout state so the session starts fresh
    const layoutKeys = ['pdos_open_windows', 'pdos_pill_order', 'pdos_trash'];
    layoutKeys.forEach(k => localStorage.removeItem(k));
    // Clear all window position/size entries
    Object.keys(localStorage)
      .filter(k => k.startsWith('window_state_'))
      .forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem("pdos_booted");
    setBooting(true);
  };

  if (isMobile) {
    return (
      <>
        <Head>
          <title>Pragyan Das — Software Engineer</title>
        </Head>
        <MobileLayout />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>PDOS</title>
        <meta name="description" content="Pragyan Das — Software Engineer. Explore my interactive desktop OS portfolio featuring projects, experience, and resume." />
        <meta name="keywords" content="Pragyan Das, software engineer, portfolio, developer, projects, resume" />
        <meta name="author" content="Pragyan Das" />
        <meta name="theme-color" content="#0078d4" />
        <link rel="canonical" href="https://pragyand.github.io" />
        <link rel="icon" href="/favicon.png" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pragyand.github.io" />
        <meta property="og:title" content="Pragyan Das — Software Engineer" />
        <meta property="og:description" content="Explore my interactive desktop OS portfolio featuring projects, experience, and resume." />
        <meta property="og:image" content="https://pragyand.github.io/favicon.png" />
        <meta property="og:site_name" content="PDOS" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Pragyan Das — Software Engineer" />
        <meta name="twitter:description" content="Explore my interactive desktop OS portfolio featuring projects, experience, and resume." />
        <meta name="twitter:image" content="https://pragyand.github.io/favicon.png" />

        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="JvnKHVqiGJCAFCVpiUHze6qvOx8xvj-1fGDqOfXcB7g" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Pragyan Das",
              url: "https://pragyand.github.io",
              jobTitle: "Software Engineer",
              sameAs: [
                "https://github.com/PragyanD",
                "https://www.linkedin.com/in/daspragyan",
              ],
            }),
          }}
        />
      </Head>

      {/* Crawlable fallback for search engines */}
      <noscript>
        <div>
          <h1>Pragyan Das — Software Engineer</h1>
          <p>Interactive desktop OS portfolio featuring projects, experience, and resume.</p>
          <ul>
            <li><a href="https://github.com/PragyanD">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/daspragyan">LinkedIn</a></li>
            <li><a href="mailto:pragyan0506@gmail.com">Email</a></li>
            <li><a href="/Pragyans_Resume.pdf">Resume</a></li>
          </ul>
        </div>
      </noscript>

      {booting ? <BootSequence onComplete={handleBootComplete} /> : <Desktop onRestart={handleRestart} />}
    </>
  );
}