'use client';

import type { Message } from 'ai';
import Image from 'next/image';
import { Markdown } from '../markdown';

// Utility function to get text from data URL
const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(',')[1];
  return window.atob(base64);
};

// Types for message parts from AI response
type MessagePart = {
  type: 'source' | 'text' | 'file' | 'tool-invocation' | 'step-start' | 'reasoning' | 'audio';
  details?: Array<{ type: string; text?: string }>;
};

interface MessageListProps {
  messages: Message[];
}

/**
 * MessageList component displays a list of chat messages with support for:
 * - Text messages with markdown formatting
 * - Image attachments
 * - PDF documents (iframe)
 * - Text file content
 * - Audio messages (UI only, no playback functionality)
 * - Reasoning explanations from AI
 */
export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground mt-10">
          <p className="mb-2">Hi there! Welcome to AI Chat Bot.</p>
          <p>How can I help you today?</p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
        >
          <div className={`max-w-[80%] ${message.role === 'user' ? '' : ''}`}>
            <div className="flex flex-col gap-4">
              <Markdown>{message.content}</Markdown>
            </div>

            <div>
              {message?.experimental_attachments
                ?.filter((attachment) => attachment?.contentType?.startsWith('image/'))
                .map((attachment, index) => (
                  <Image
                    key={`${message.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={500}
                    alt={attachment.name ?? `attachment-${index}`}
                    className="mt-2 rounded-md"
                  />
                ))}

              {message?.experimental_attachments
                ?.filter((attachment) => attachment?.contentType?.startsWith('application/pdf'))
                .map((attachment, index) => (
                  <iframe
                    key={`${message.id}-pdf-${index}`}
                    src={attachment.url}
                    width={500}
                    height={600}
                    title={attachment.name ?? `attachment-${index}`}
                    className="mt-2 rounded-md"
                  />
                ))}

              {message?.experimental_attachments
                ?.filter((attachment) => attachment?.contentType?.startsWith('text/'))
                .map((attachment, index) => (
                  <div
                    key={`${message.id}-text-${index}`}
                    className="mt-2 p-2 rounded-md bg-secondary text-secondary-foreground text-sm max-h-40 overflow-auto"
                  >
                    {getTextFromDataUrl(attachment.url)}
                  </div>
                ))}
            </div>

            {/* Display reasoning if available */}
            {message?.parts?.map((part: MessagePart, idx) => {
              if (part.type === 'reasoning') {
                return (
                  <pre key={`reasoning-${message.id}-${idx}`} className="mt-2 text-xs">
                    {part.details?.map((detail) =>
                      detail.type === 'text' ? detail.text : '<redacted>'
                    )}
                  </pre>
                );
              }
              if (part.type === 'audio') {
                return (
                  <div
                    key={`audio-${message.id}-${idx}`}
                    className="mt-2 flex items-center bg-[#252525] p-2 rounded"
                  >
                    <button
                      type="button"
                      aria-label="Play audio message"
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <div className="ml-3 h-5">
                      <svg
                        width="70"
                        height="20"
                        viewBox="0 0 70 20"
                        aria-hidden="true"
                        role="presentation"
                      >
                        <path
                          d="M1,10 L5,5 L9,15 L13,10 L17,12 L21,8 L25,10 L29,5 L33,12 L37,5 L41,10 L45,5 L49,10 L53,5 L57,10 L61,8 L65,12 L69,10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          className="text-primary"
                        />
                      </svg>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
