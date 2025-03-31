'use client';

import { Badge } from '@/components/ui/badge';
import { type AIModel, getModelById } from '@/config/models';
import { useChat } from '@ai-sdk/react';
import { ArrowUp, PaperclipIcon } from 'lucide-react';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config/api';
import { useChatSubmit } from '../../hooks/useChatSubmit';
import { useFileAttachments } from '../../hooks/useFileAttachments';
import { useModels } from '../../hooks/useModels';
import { useTextareaAutoResize } from '../../hooks/useTextareaAutoResize';
import { getCurrentTabUrl } from '../../lib/chromeUtils';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { AttachmentPreviews } from './AttachmentPreviews';
import { MessageList } from './MessageList';

interface ChatWithToolsProps {
  modelId: string;
  setModelId: Dispatch<SetStateAction<string>>;
}

/**
 * ChatWithTools - Main chat interface component that supports file attachments
 * and integrates with AI providers for conversation.
 */
export default function ChatWithTools({ modelId, setModelId }: ChatWithToolsProps) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const { groupedModels, loading: loadingModels } = useModels();

  // Custom hooks for handling specific functionality
  const {
    attachments,
    setAttachments,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handlePaste,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
  } = useFileAttachments();

  const { textareaRef, handleTextareaChange } = useTextareaAutoResize();

  // Fetch current tab URL on component mount
  useEffect(() => {
    const fetchCurrentUrl = async () => {
      try {
        const url = await getCurrentTabUrl();
        setCurrentUrl(url);
        console.log('Current tab URL:', url);
      } catch (error) {
        console.error('Error fetching current tab URL:', error);
      }
    };

    fetchCurrentUrl();
  }, []);

  // Base chat functionality from AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `${API_BASE_URL}/api/chat/`,
    body: {
      modelId,
      currentUrl,
    },
    onError: (error) => console.error(error),
  });

  // Custom hook for handling chat submission with attachments
  const { handleFormSubmit, handleKeyDown } = useChatSubmit({
    input,
    attachments,
    handleSubmit,
    setAttachments,
    textareaRef,
  });

  return (
    <div
      className="flex flex-col h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-background p-6 rounded-lg shadow-lg text-center">
            <p>Drop files here</p>
            <p className="text-sm text-muted-foreground">(images and text)</p>
          </div>
        </div>
      )}

      {/* Message list component */}
      <MessageList messages={messages} />

      <form onSubmit={handleFormSubmit} className="border-t p-4 pt-2 bg-card">
        {/* Attachment previews */}
        {attachments && (
          <AttachmentPreviews attachments={attachments} setAttachments={setAttachments} />
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,text/*,application/pdf"
          className="hidden"
          multiple
        />

        <div className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              handleInputChange(e);
              handleTextareaChange(e);
            }}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Ask anything..."
            disabled={isLoading}
            className="min-h-[40px] max-h-[150px] w-full resize-none overflow-y-auto border-none outline-none focus:ring-0 py-2"
            rows={1}
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleUploadClick}
                variant="outline"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Attach files"
              >
                <PaperclipIcon size={18} />
              </Button>

              <div className="flex items-center gap-2">
                <Select value={modelId} onValueChange={setModelId} disabled={loadingModels}>
                  <SelectTrigger className="w-[180px] rounded-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingModels ? (
                      <SelectItem value="loading" disabled>
                        Loading models...
                      </SelectItem>
                    ) : (
                      Object.entries(groupedModels).map(([provider, models]) => (
                        <SelectGroup key={provider}>
                          <SelectLabel className="uppercase">{provider}</SelectLabel>
                          {models.map((model: AIModel) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={isLoading} size="icon">
              <ArrowUp size={16} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
