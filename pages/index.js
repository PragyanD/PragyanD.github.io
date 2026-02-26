import Head from "next/head";
import Desktop from "../components/Desktop";

export default function Home() {
  return (
    <>
      <Head>
        <title>Pragyan Das — Portfolio</title>
        <meta name="description" content="Pragyan Das — Software Engineer. Interactive desktop portfolio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Desktop />
    </>
  );
}