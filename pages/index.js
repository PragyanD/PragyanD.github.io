import { useState, useEffect } from "react";
import Head from "next/head";
import Desktop from "../components/Desktop";
import BootSequence from "../components/BootSequence";
import { remove, removeByPrefix, STORAGE_KEYS } from "../lib/storage";

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
    const layoutKeys = [STORAGE_KEYS.OPEN_WINDOWS, STORAGE_KEYS.PILL_ORDER, STORAGE_KEYS.TRASH];
    layoutKeys.forEach(k => remove(k));
    // Clear all window position/size entries
    removeByPrefix('window_state_');
    sessionStorage.removeItem("pdos_booted");
    setBooting(true);
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a1e] text-white p-8 text-center">
        <div className="text-4xl mb-6">💻</div>
        <h1 className="text-xl font-semibold mb-3">PDOS works best on desktop</h1>
        <p className="text-sm text-white/60 mb-6 max-w-xs">
          This portfolio is a full desktop OS experience. Please visit on a larger screen for the full experience.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <a href="/Pragyans_Resume.pdf" target="_blank" rel="noopener noreferrer"
             className="py-3 px-6 rounded-xl bg-blue-600 text-white text-sm font-medium text-center hover:bg-blue-700 transition-colors">
            View Resume
          </a>
          <a href="https://github.com/PragyanD" target="_blank" rel="noopener noreferrer"
             className="py-3 px-6 rounded-xl border border-white/20 text-white/80 text-sm font-medium text-center hover:bg-white/5 transition-colors">
            GitHub Profile
          </a>
          <a href="mailto:pragyan0506@gmail.com"
             className="py-3 px-6 rounded-xl border border-white/20 text-white/80 text-sm font-medium text-center hover:bg-white/5 transition-colors">
            Get In Touch
          </a>
        </div>
      </div>
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

        {/* Preload default wallpaper so it's ready after boot */}
        <link rel="preload" as="image" href="/wallpaper_bliss.avif" type="image/avif" />
        <link rel="preload" as="image" href="/wallpaper_bliss.jpg" />

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