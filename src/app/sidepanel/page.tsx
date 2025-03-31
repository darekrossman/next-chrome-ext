'use client';

import ChatWithTools from '@/components/chat/ChatWithTools';
import { getDefaultModelId } from '@/config/models';
import { useState } from 'react';

export default function SidePanel() {
  const [modelId, setModelId] = useState(getDefaultModelId('anthropic'));

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4">
        <h1 className="text-xl font-bold">AI Assistant</h1>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatWithTools modelId={modelId} setModelId={setModelId} />
      </main>
    </div>
  );
}
