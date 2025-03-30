import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-6">AI Assistant Chrome Extension</h1>
        <p className="mb-4">
          Access the AI assistant through the Chrome side panel by clicking on the
          extension icon.
        </p>
        <div className="mt-6">
          <Link href="/sidepanel" className="text-blue-500 underline">
            Open SidePanel Interface
          </Link>
        </div>
      </div>
    </main>
  );
}
