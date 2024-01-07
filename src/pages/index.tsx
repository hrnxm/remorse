import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Avatar from "../../public/avatar.png";

import { RouterOutputs, api } from "~/utils/api";

const Logos = () => {
  return (
    <>
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/android-chrome-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/android-chrome-512x512.png"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="shortcut icon" href="/favicon.ico" />
    </>
  );
};

const Auth = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center">
      {sessionData ? (
        <Image
          src={sessionData.user.image || Avatar}
          alt="user avatar"
          width={40}
          height={40}
          className="rounded-full hover:cursor-pointer"
          onClick={() => void signOut()}
        />
      ) : (
        <button
          className="rounded-full border-2 border-slate-400 px-8 py-2 font-semibold text-white no-underline transition hover:bg-slate-900"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      )}
    </div>
  );
};

const CreatePortWizard = () => {
  const { data: sessionData } = useSession();

  if (!sessionData?.user) return null;

  return (
    <div className="flex w-full gap-3 border-b border-slate-400 p-4">
      <Image
        src={sessionData.user.image || Avatar}
        alt="user avatar"
        width={55}
        height={55}
        className="rounded-full"
      />
      <input
        placeholder="Type some morse code!"
        className="w-full bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: { post: PostWithUser }) => {
  const { post } = props;
  return (
    <div className="flex gap-4 border-b border-slate-400 p-4">
      <Image
        src={post.user.image || Avatar}
        alt="user avatar"
        width={55}
        height={55}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <span className="cursor-default text-slate-200">
          @{post.user.email?.split("@")[0]} ·{" "}
          <span className="text-slate-400">
            {post.createdAt.getDate() + "."}
          </span>{" "}
          <span className="text-slate-400">
            {post.createdAt
              .toLocaleString("default", { month: "long" })
              .slice(0, 3)}
          </span>
        </span>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

const Home = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  const { data: sessionData, status } = useSession();

  if (isLoading || status === "loading")
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="relative flex h-14 w-14">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-14 w-14 rounded-full bg-slate-300"></span>
        </span>
      </div>
    );

  return (
    <>
      <Head>
        <title>Remorse</title>
        <meta name="description" content="Generated by create-t3-app" />
        <Logos />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-3xl">
          <header className="flex h-20 items-center justify-between border-y border-slate-400 p-3">
            <Image
              src="/logo-white.svg"
              alt="Logo"
              height={0}
              width={0}
              style={{ width: "auto", height: "90%" }}
            />
            <Auth />
          </header>
          {sessionData?.user && <CreatePortWizard />}
          {data?.map((post) => {
            return <PostView key={post.id} post={post} />;
          })}
        </div>
      </main>
    </>
  );
};

export default Home;
