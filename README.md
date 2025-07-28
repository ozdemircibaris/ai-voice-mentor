# 🎙️ VoiceMentor

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**VoiceMentor** is an AI-powered speech coaching platform that helps users improve their public speaking and presentation skills through advanced speech analysis and personalized feedback.

## ✨ Features

### 🤖 AI-Powered Speech Analysis

- **Advanced Transcription**: Azure OpenAI Whisper integration for accurate speech-to-text
- **Speech Metrics**: Real-time analysis of speaking pace, tone, and clarity
- **Filler Word Detection**: Identify and track usage of "um", "uh", "like" and other filler words
- **Confidence Scoring**: AI-generated confidence assessment (0-100 scale)
- **Emotion Analysis**: Sentiment and emotion detection in speech patterns

### 📊 Visual Analytics & Insights

- **Interactive Charts**: Radar charts, bar charts, and performance metrics visualization
- **Progress Tracking**: Historical comparison of improvements over time
- **Word-Level Timestamps**: Precise audio playback with synchronized transcription
- **Performance Benchmarks**: Compare against optimal speaking standards

### 🎯 Personalized Coaching

- **Improvement Areas**: AI-identified areas needing attention
- **Strengths Recognition**: Highlight what you're doing well
- **Actionable Feedback**: Specific recommendations for improvement
- **Practice Mode**: Guided sessions with real-time feedback

### 🔐 User Management & Subscriptions

- **Auth0 Integration**: Secure authentication and user management
- **Subscription Tiers**: Free, Premium, and Enterprise plans
- **Usage Tracking**: Monitor monthly limits and upgrade notifications
- **User Dashboard**: Comprehensive overview of recordings and progress

### 📱 Modern User Experience

- **Responsive Design**: Works seamlessly on desktop and mobile
- **Audio Recording**: Built-in audio recorder with waveform visualization
- **File Upload**: Support for existing audio file analysis
- **Beautiful UI**: Modern, clean interface built with Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & Database

- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Backend API

### AI & Audio Processing

- **[Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)** - Whisper model for transcription
- **[Microsoft Cognitive Services](https://azure.microsoft.com/en-us/products/cognitive-services/)** - Speech SDK
- **[WaveSurfer.js](https://wavesurfer-js.org/)** - Audio waveform visualization

### Authentication & Services

- **[Auth0](https://auth0.com/)** - Authentication and user management
- **[Supabase](https://supabase.com/)** - Additional backend services

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/voicementor"
DIRECT_URL="postgresql://username:password@localhost:5432/voicementor"

# Auth0
AUTH0_SECRET="your-auth0-secret"
AUTH0_BASE_URL="http://localhost:3000"
AUTH0_ISSUER_BASE_URL="https://your-domain.auth0.com"
AUTH0_CLIENT_ID="your-auth0-client-id"
AUTH0_CLIENT_SECRET="your-auth0-client-secret"

# Azure OpenAI
AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
AZURE_OPENAI_API_KEY="your-azure-api-key"

# Additional services (optional)
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-key"
```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/voice-mentor.git
   cd voice-mentor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
voice-mentor/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/                        # Static assets
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (dashboard)/         # Dashboard pages
│   │   ├── api/                 # API routes
│   │   └── page.tsx             # Landing page
│   ├── components/              # React components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   │   ├── ai/                  # AI service integrations
│   │   ├── auth0.ts             # Auth0 configuration
│   │   ├── prisma.ts            # Prisma client
│   │   └── user.ts              # User utilities
│   └── types/                   # TypeScript type definitions
├── tailwind.config.js           # Tailwind CSS configuration
├── next.config.ts               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🔧 Configuration

### Azure OpenAI Setup

1. Create an Azure OpenAI resource in Azure Portal
2. Deploy a Whisper model
3. Get your endpoint and API key
4. Update the environment variables

### Auth0 Setup

1. Create an Auth0 application
2. Configure allowed callback URLs
3. Set up user roles and permissions
4. Update the environment variables

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your environment
3. Run Prisma migrations

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Use **TypeScript** for all new files
- Follow **ESLint** rules (run `npm run lint`)
- Use **Prettier** for code formatting
- Write **descriptive commit messages**
- Add **JSDoc comments** for functions

### Areas for Contribution

- 🌍 **Internationalization**: Add support for more languages
- 🎨 **UI/UX Improvements**: Enhance the user interface
- 🤖 **AI Features**: Improve speech analysis algorithms
- 📱 **Mobile Experience**: Optimize for mobile devices
- 🧪 **Testing**: Add unit and integration tests
- 📚 **Documentation**: Improve docs and tutorials

## 📖 API Documentation

### Recording Endpoints

- `POST /api/recordings` - Create a new recording
- `GET /api/recordings` - Get user's recordings
- `GET /api/recordings/[id]` - Get specific recording
- `DELETE /api/recordings/[id]` - Delete recording

### Analysis Endpoints

- `POST /api/recordings/[id]/analyze` - Analyze recording
- `GET /api/recordings/[id]/analysis` - Get analysis results

### User Endpoints

- `GET /api/user` - Get current user profile
- `PUT /api/user` - Update user profile

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build the Docker image
docker build -t voice-mentor .

# Run the container
docker run -p 3000:3000 voice-mentor
```
