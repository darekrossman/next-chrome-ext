'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { Message } from 'ai';
import { Bot, Brain, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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
  // Track open state of each reasoning collapsible
  const [openReasonings, setOpenReasonings] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleReasoning = (id: string) => {
    setOpenReasonings((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground mt-10">
          <p className="mb-2">Hi there! Welcome to AI Chat Bot.</p>
          <p>How can I help you today?</p>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={cn('flex justify-start items-start gap-3 p-2', {
            'bg-muted rounded-lg py-3': message.role === 'user',
          })}
        >
          <div className={'flex items-center justify-center rounded-full shrink-0 mt-[-1px]'}>
            {message.role === 'user' ? (
              <UserIcon className="h-5 w-4 text-secondary-foreground/50" />
            ) : (
              <Bot className="h-5 w-4 text-secondary-foreground/50" />
            )}
          </div>
          <div className="text-sm flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Markdown>{message.content}</Markdown>
            </div>

            {/* Display reasoning if available */}
            {message?.parts?.map((part: MessagePart, idx) => {
              if (part.type === 'reasoning') {
                const reasoningId = `reasoning-${message.id}-${idx}`;

                return (
                  <Collapsible
                    key={reasoningId}
                    open={openReasonings[reasoningId]}
                    onOpenChange={() => toggleReasoning(reasoningId)}
                  >
                    <div className="flex items-center">
                      <CollapsibleTrigger className="text-muted-foreground hover:text-primary transition-colors border rounded-full px-2 py-1">
                        <div
                          className={`flex items-center gap-1 text-xs ${!message.content ? 'animate-pulse' : ''}`}
                        >
                          <Brain className="w-3 h-3" />
                          <div>Reasoning</div>
                        </div>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="text-xs mt-1 border rounded-lg p-2">
                      <div className="text-xs flex flex-col gap-2 text-muted-foreground">
                        <Markdown>
                          {`${part.details
                            ?.map((detail) => (detail.type === 'text' ? detail.text : '<redacted>'))
                            .join('\n')}`}
                        </Markdown>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              return null;
            })}

            {message?.experimental_attachments && (
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
            )}
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
}
