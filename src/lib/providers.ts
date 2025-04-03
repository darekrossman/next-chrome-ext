import { anthropic, type AnthropicProviderOptions } from "@ai-sdk/anthropic";
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from "ai";

/**
 * Custom Anthropic provider with model aliases and pre-configured settings
 */
export const customAnthropicProvider = customProvider({
  languageModels: {
    fast: anthropic("claude-3-haiku-20240307"),

    // simple model
    writing: anthropic("claude-3-7-sonnet-20250219"),

    // extended reasoning model configuration:
    reasoning: wrapLanguageModel({
      model: anthropic("claude-3-7-sonnet-20250219"),
      middleware: defaultSettingsMiddleware({
        settings: {
          maxTokens: 100000, // example default setting
          providerMetadata: {
            anthropic: {
              thinking: {
                type: "enabled",
                budgetTokens: 32000,
              },
            } satisfies AnthropicProviderOptions,
          },
        },
      }),
    }),
  },
  fallbackProvider: anthropic,
});

/**
 * Provider registry with custom providers
 *
 * Allows accessing models with namespaced IDs like:
 * - anthropic:fast
 * - anthropic:writing
 * - anthropic:reasoning
 *
 * Also allows direct access to all available Anthropic models through
 * the fallback provider configuration.
 */
export const registry = createProviderRegistry(
  {
    anthropic: customAnthropicProvider,
  },
  { separator: ":" }
);
