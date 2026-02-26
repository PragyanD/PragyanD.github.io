import Head from "next/head";
import Desktop from "../components/Desktop";

export default function Home() {
  return (
    <>
      <Head>
        <title>PragyanOS</title>
        <meta name="description" content="Pragyan Das — Software Engineer. Interactive desktop portfolio." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Desktop />
    </>
  );
}