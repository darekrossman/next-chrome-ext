"use client";

import ChatWithTools from "@/components/chat/ChatWithTools";
import { useState } from "react";

export default function SidePanel() {
  const [provider, setProvider] = useState("openai");

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <div className="mt-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
          </select>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatWithTools provider={provider} />
      </main>
    </div>
  );
}
