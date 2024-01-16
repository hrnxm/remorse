import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Avatar from "../../public/avatar.png";
import LoadingPulser from "../components/LoadingPulser";
import { RouterOutputs, api } from "~/utils/api";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import Kbd from "~/components/Kbd";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "~/components/ui/use-toast";
import { Toaster } from "~/components/ui/toaster";

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
  const [input, setInput] = useState("");

  if (!sessionData?.user) return null;

  const ctx = api.useUtils();

  const { toast } = useToast();

  const { mutate: createPost, isLoading: isPosting } =
    api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        ctx.posts.getAll.invalidate();
      },
      onError(error) {
        const message =
          error.data?.zodError?.fieldErrors.content?.at(0) ||
          "Unknown error :(";
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: message,
        });
      },
    });

  return (
    <div className="flex w-full items-start gap-3 border-b border-slate-400 p-4">
      <Image
        src={sessionData.user.image || Avatar}
        alt="user avatar"
        width={55}
        height={55}
        className="rounded-full"
      />
      <div className="flex w-full flex-col gap-3">
        <Textarea
          placeholder="Type some morse code..."
          maxLength={750}
          className="max-h-32 resize-y"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPosting}
          spellCheck={false}
        />
        <div className="flex justify-between">
          <div className="flex items-start gap-3">
            <Kbd>•</Kbd>
            <Kbd>—</Kbd>
          </div>
          {isPosting ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Posting
            </Button>
          ) : (
            <Button
              disabled={!input.trim().length}
              onClick={() => createPost({ content: input })}
            >
              Post
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: { post: PostWithUser }) => {
  const { post } = props;
  return (
    <div className="flex items-start gap-4 border-b border-slate-400 p-4">
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

  if (isLoading || status === "loading") return <LoadingPulser />;

  return (
    <>
      <Head>
        <title>Remorse</title>
        <meta name="description" content="Generated by create-t3-app" />
        <Logos />
      </Head>
      <main className="flex min-h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-3xl">
          <header className="sticky top-0 flex h-20 w-full items-center justify-between border-y border-slate-400 bg-background p-3">
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
      <Toaster />
    </>
  );
};

export default Home;
