# Chrome Extension with Next.js and AI Integration

This project is a Chrome extension that leverages Next.js 15 App Router and AI capabilities through the latest Vercel AI SDK. The extension utilizes Chrome's sidePanel feature for its primary user interface, providing a seamless and accessible AI assistant experience directly within the browser.

## Features

- Multi-modal chatbot supporting text and images
- Tool calling capabilities
- Integration with OpenAI GPT-4.5 and Claude 3.7 Sonnet
- Support for Claude's extended thinking/reasoning capabilities
- Modern UI built with Radix, Shadcn, and Tailwind CSS
- Chrome SidePanel integration

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm/yarn
- Chrome browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/next-chrome-ext.git
cd next-chrome-ext
```

2. Install dependencies with pnpm:
```bash
# Install pnpm if you don't have it yet
npm install -g pnpm

# Install project dependencies
pnpm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Development

Run the development server:

```bash
pnpm dev
```

### Building for Production

1. Build the Next.js application:
```bash
pnpm build
```

2. Load the unpacked extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome` directory from this project

## Project Structure

```
next-chrome-ext/
├── .next/            # Next.js build output
├── chrome/           # Chrome extension files
│   ├── manifest.json # Extension manifest
│   ├── background.js # Background script
│   ├── sidepanel.html # SidePanel entry point
│   └── next/         # Built Next.js assets (after build)
├── public/           # Public assets
├── src/              # Source code
│   ├── app/          # Next.js App Router
│   │   ├── api/      # API routes
│   │   │   └── chat/ # Chat API endpoint
│   │   ├── sidepanel/# SidePanel pages
│   │   └── page.tsx  # Main page
│   ├── components/   # React components
│   │   ├── ui/       # UI components (Shadcn)
│   │   └── chat/     # Chat components
│   └── lib/          # Utility functions
├── next.config.js    # Next.js configuration
├── tailwind.config.js# Tailwind configuration
└── package.json      # Project dependencies
```

## Technologies Used

- [Next.js 15](https://nextjs.org/)
- [AI SDK Core](https://sdk.vercel.ai/docs/ai-sdk-core/overview) - Unified API to call any LLM
- [AI SDK UI](https://sdk.vercel.ai/docs/ai-sdk-ui/overview) - Components for building chat interfaces
- [Claude 3.7 Sonnet](https://sdk.vercel.ai/docs/guides/sonnet-3-7) - Anthropic's most intelligent model
- [GPT-4.5](https://sdk.vercel.ai/docs/guides/gpt-4-5) - OpenAI's latest model
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/) - Browser extension development

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [OpenAI](https://openai.com/)
- [Anthropic](https://www.anthropic.com/)
- [Chrome Extensions API](https://developer.chrome.com/docs/extensions/) 