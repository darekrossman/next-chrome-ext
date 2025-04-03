/**
 * Models Configuration
 *
 * This file contains the available AI models from different providers
 * that can be used throughout the application.
 */
import { registry } from "@/lib/providers";

export interface AIModel {
  id: string;
  name: string;
  provider: "openai" | "anthropic";
  description: string;
  capabilities: string[];
  supportsImages?: boolean;
  supportsPdf?: boolean;
  supportsReasoning?: boolean;
}

// Convert registry models to our application model format
export const AI_MODELS: AIModel[] = [
  // Anthropic models from registry
  {
    id: "anthropic:fast",
    name: "Claude 3 Haiku (Fast)",
    provider: "anthropic",
    description: "Fast and efficient model for basic tasks",
    capabilities: ["Text", "Images", "Code"],
    supportsImages: true,
  },
  {
    id: "anthropic:writing",
    name: "Claude 3.7 Sonnet (Writing)",
    provider: "anthropic",
    description: "Anthropic's model optimized for content creation",
    capabilities: ["Text", "Images", "Code", "PDFs"],
    supportsImages: true,
    supportsPdf: true,
  },
  {
    id: "anthropic:reasoning",
    name: "Claude 3.7 Sonnet (Reasoning)",
    provider: "anthropic",
    description: "Anthropic's model with enhanced reasoning capabilities",
    capabilities: ["Text", "Images", "Code", "Reasoning", "PDFs"],
    supportsImages: true,
    supportsPdf: true,
    supportsReasoning: true,
  },
];

/**
 * Group models by provider for UI rendering
 */
export const getModelsByProvider = () => {
  const groupedModels: Record<string, AIModel[]> = {};

  AI_MODELS.forEach((model) => {
    if (!groupedModels[model.provider]) {
      groupedModels[model.provider] = [];
    }
    groupedModels[model.provider].push(model);
  });

  return groupedModels;
};

/**
 * Get default model ID for a provider
 */
export const getDefaultModelId = (provider: string): string => {
  switch (provider) {
    case "openai":
      return "anthropic:writing"; // Fallback to Anthropic until we add OpenAI to registry
    case "anthropic":
      return "anthropic:reasoning";
    default:
      return "anthropic:reasoning";
  }
};

/**
 * Find model by ID
 */
export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === modelId);
};
