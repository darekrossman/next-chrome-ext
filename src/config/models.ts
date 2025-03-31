/**
 * Models Configuration
 *
 * This file contains the available AI models from different providers
 * that can be used throughout the application.
 */

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic';
  description: string;
  capabilities: string[];
  supportsImages?: boolean;
  supportsPdf?: boolean;
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: "OpenAI's most capable multimodal model",
    capabilities: ['Text', 'Images', 'Code', 'Reasoning'],
    supportsImages: true,
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Fast and powerful text model',
    capabilities: ['Text', 'Code', 'Reasoning'],
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    description: 'Fast and efficient model for basic tasks',
    capabilities: ['Text', 'Code'],
  },

  // Anthropic Models
  {
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet',
    provider: 'anthropic',
    description: "Anthropic's powerful model with balanced capabilities",
    capabilities: ['Text', 'Images', 'Code', 'Reasoning', 'PDFs'],
    supportsImages: true,
    supportsPdf: true,
  },
  {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Balanced model for most tasks',
    capabilities: ['Text', 'Images', 'Code', 'Reasoning', 'PDFs'],
    supportsImages: true,
    supportsPdf: true,
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: "Anthropic's most powerful model",
    capabilities: ['Text', 'Images', 'Code', 'Reasoning', 'PDFs'],
    supportsImages: true,
    supportsPdf: true,
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fast and efficient model for basic tasks',
    capabilities: ['Text', 'Images', 'Code'],
    supportsImages: true,
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
    case 'openai':
      return 'gpt-4o';
    case 'anthropic':
      return 'claude-3-7-sonnet-20250219';
    default:
      return 'gpt-4o';
  }
};

/**
 * Find model by ID
 */
export const getModelById = (modelId: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === modelId);
};
