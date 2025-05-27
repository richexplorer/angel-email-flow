# Angel Email Flow

A powerful tool for managing angel investor outreach, featuring automated email generation, LinkedIn integration, and contact management.

## Features

- **Smart Email Generation**: Generate personalized emails using GPT-4
- **LinkedIn Integration**: Create personalized LinkedIn connection messages
- **Voice Notes**: Record and transcribe notes using voice-to-text
- **Contact Management**: Organize and manage investor leads
- **Custom Templates**: Save and manage your email templates
- **Settings Management**: Configure OpenAI API keys and preferences

## Getting Started

### Prerequisites

- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- OpenAI API key for email generation

### Local Development

```bash
# Clone the repository
git clone https://github.com/richexplorer/angel-email-flow.git

# Navigate to project directory
cd angel-email-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

## Technologies

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **AI Integration**: OpenAI GPT-4
- **Data Storage**: Local storage, Supabase
- **Voice**: Web Speech API

## Project Structure

```
angel-email-flow/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── lib/           # Utility functions
│   └── styles/        # Global styles
├── public/           # Static assets
└── package.json      # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.
