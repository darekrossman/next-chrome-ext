'use client';

import ChatWithTools from '@/components/chat/ChatWithTools';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

export default function SidePanel() {
  const [provider, setProvider] = useState('openai');

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
        <div className="mt-2">
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatWithTools provider={provider} />
      </main>
    </div>
  );
}
