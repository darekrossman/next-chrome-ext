"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImageUploader } from "./ImageUploader";

// Base URL for API requests - localhost in development, relative in production
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_MODE === "development" ? "http://localhost:3000" : "";

// Debug info for the current environment
console.log("API mode:", process.env.NEXT_PUBLIC_API_MODE);
console.log("API base URL:", API_BASE_URL);

interface ChatWithToolsProps {
  provider: string;
}

export default function ChatWithTools({ provider }: ChatWithToolsProps) {
  const [attachments, setAttachments] = useState<File[]>([]);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `${API_BASE_URL}/api/chat/`, // Added trailing slash to prevent redirects
    body: {
      attachments,
      provider,
    },
    onFinish: () => {
      setAttachments([]);
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
              {/* Display reasoning if available */}
              {message?.parts?.map((part, idx) => {
                if (part.type === "reasoning") {
                  return (
                    <pre
                      key={`reasoning-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        idx
                      }`}
                      className="mt-2 text-xs bg-gray-100 p-2 rounded"
                    >
                      {part.details?.map((detail) =>
                        detail.type === "text" ? detail.text : "<redacted>"
                      )}
                    </pre>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex mb-2">
          <ImageUploader onUpload={(files) => setAttachments(files)} />
        </div>
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 mr-2"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
