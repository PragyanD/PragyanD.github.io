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

  return (
    <>
      <Head>
        <title>PDOS</title>
        <meta name="description" content="Pragyan Das — Software Engineer. Interactive desktop portfolio." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {booting ? <BootSequence onComplete={handleBootComplete} /> : <Desktop />}
    </>
  );
}