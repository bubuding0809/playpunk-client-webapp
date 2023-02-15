import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const exampleQuery = api.example.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Play Punk client portal</title>
        <meta name="description" content="Client portal for Playpunk studios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#48434e] to-[#1f1f23]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <Image
            src="/playpunk.png"
            alt="Playpunk logo"
            width={300}
            height={300}
          />
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  const [notionPageState, setNotionPageState] = useState({
    title: "Test title",
    content: "Test content",
  });

  const createNotionPage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if form is valid
    if (!notionPageState.title || !notionPageState.content) {
      alert("Please fill out all fields");
      return;
    }
    try {
      const response = await fetch("/api/notion_client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notionPageState),
      });
      alert("Page created successfully");
      console.log("success", response);
    } catch (error) {
      console.log("error", error);
    }
    return;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      {sessionData && (
        <form onSubmit={(e) => createNotionPage(e)}>
          <div className="roun flex w-96 flex-col items-center justify-center gap-4 rounded-lg border bg-gray-700 p-4 px-10">
            <p className="text-center text-2xl text-white">
              Create a new Notion page
            </p>
            <label className="flex w-full flex-col text-white">
              Title
              <input
                className="rounded-full bg-white/50 px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                type="text"
                value={notionPageState.title}
                onChange={(e) =>
                  setNotionPageState({
                    ...notionPageState,
                    title: e.target.value,
                  })
                }
              />
            </label>
            <label className="flex w-full flex-col text-white">
              Content
              <input
                className="rounded-full bg-white/50 px-4 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                type="text"
                value={notionPageState.content}
                onChange={(e) =>
                  setNotionPageState({
                    ...notionPageState,
                    content: e.target.value,
                  })
                }
              />
            </label>
            <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
              Test Notion API
            </button>
          </div>
        </form>
      )}
      <button
        className="mt-6 rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
