import Head from "next/head";
import {
  AiFillLinkedin,
  AiFillGithub,
} from "react-icons/ai";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useState } from "react";
import deved from "../public/profilePic.jpg";
import Image from "next/image";


export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Head>
        <title>Pragyan Das</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" bg-white px-10 dark:bg-gray-900 md:px-20 lg:px-40">
        <section className="min-h-screen">
          <nav className="py-10 mb-12 flex justify-between dark:text-white">
            <h1 className="font-burtons text-xl"><BsFillMoonStarsFill
                  onClick={() => setDarkMode(!darkMode)}
                  className=" cursor-pointer text-2xl"
                /></h1>
            
            <ul className="flex items-center">
              <li>
                
              </li>
              <li>
                <a
                  className="bg-gradient-to-r from-cyan-500 text- to-teal-500 text-white px-4 py-2 border-none rounded-md ml-8"
                  download href= "../public/Resume.pdf" 
                >
                  Resume
                </a>
              </li>
            </ul>
          </nav>
          <div className="text-center p-10 py-10">
            <h2 className="text-5xl py-2 text-teal-600 font-medium dark:text-teal-400 md:text-6xl">
              Pragyan Das
            </h2>
            <h3 className="text-2xl py-2 dark:text-white md:text-3xl">
              Software Developer.
            </h3>
            <p className="text-md py-5 leading-8 text-gray-800 dark:text-gray-200 max-w-xl mx-auto md:text-xl">
              Transforming ideas into code
            </p>
            <div className="text-5xl flex justify-center gap-16 py-3 text-gray-600 dark:text-gray-400">
              
            <a href="https://www.linkedin.com/in/daspragyan/">
            <AiFillLinkedin />      
            </a> 
            <a href="https://www.github.com/PragyanD">
            <AiFillGithub />     
            </a> 
              
            </div>
            <div className="mx-auto bg-gradient-to-b from-teal-500 rounded-full w-80 h-80 relative overflow-hidden mt-20 md:h-96 md:w-96">
              <Image src={deved} layout="fill" objectFit="cover" />
            </div>
          </div>
        </section>
      </main>
      </div>
  )
}