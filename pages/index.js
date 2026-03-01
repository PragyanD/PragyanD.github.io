import { useState, useEffect } from "react";
import Head from "next/head";
import Desktop from "../components/Desktop";
import BootSequence from "../components/BootSequence";

export default function Home() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("pdos_booted");
    if (hasBooted) {
      setBooting(false);
    }
  }, []);

  const handleBootComplete = () => {
    setBooting(false);
    sessionStorage.setItem("pdos_booted", "true");
  };

  const handleRestart = () => {
    // Clear layout state so the session starts fresh
    const layoutKeys = ['pdos_open_windows', 'pdos_pill_order'];
    layoutKeys.forEach(k => localStorage.removeItem(k));
    // Clear all window position/size entries
    Object.keys(localStorage)
      .filter(k => k.startsWith('window_state_'))
      .forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem("pdos_booted");
    setBooting(true);
  };

  return (
    <>
      <Head>
        <title>PDOS</title>
        <meta name="description" content="Pragyan Das — Software Engineer. Interactive desktop portfolio." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {booting ? <BootSequence onComplete={handleBootComplete} /> : <Desktop onRestart={handleRestart} />}
    </>
  );
}