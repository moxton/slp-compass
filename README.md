# SLP Compass

AI-powered therapy planning for pediatric speech-language pathologists. Generate individualized, evidence-based therapy plans and SMART objectives for pediatric patients with communication disorders.

## Features

- **Patient Assessment**: Input patient age, disorder areas, and descriptions
- **AI-Generated Plans**: Create evidence-based therapy plans using OpenAI GPT
- **Manual Goal Entry**: Option to enter custom goals and objectives
- **Treatment Protocols**: Generate comprehensive treatment protocols
- **Engagement Ideas**: Get creative therapy activity suggestions
- **Data Sheets**: Exportable progress tracking templates
- **Secure Storage**: Save and retrieve therapy plans with Supabase
- **Mobile-Friendly**: Responsive design for tablets and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: OpenAI GPT API (via Supabase Edge Functions)
- **Deployment**: Vercel
- **State Management**: React Query + React Hook Form
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd slp-compass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_URL=https://api.openai.com/v1
   VITE_APP_NAME=SLP Compass
   VITE_APP_VERSION=1.0.0
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see `supabase/` directory)
   - Set up authentication if needed
   - Create Edge Functions for AI integration

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) to view the app.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── pages/              # Page components
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Components

- **PatientInput**: Main form for patient data entry
- **TherapyPlan**: Display generated therapy plans
- **Navigation**: App navigation and history
- **ExamplePlans**: Sample therapy plans for reference

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push your code to GitHub
   - Import the repository in Vercel
   - Configure environment variables in Vercel dashboard

2. **Environment Variables**
   Set these in your Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENAI_API_URL`

3. **Deploy**
   - Vercel will automatically deploy on git push
   - Or trigger manual deployment from Vercel dashboard

### Supabase Edge Functions

For AI integration, create Supabase Edge Functions to handle OpenAI API calls securely:

```typescript
// supabase/functions/generate-therapy-plan/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Handle OpenAI API calls here
  // Return therapy plan data
})
```

## Security & Privacy

- **No PII Storage**: Patient data is anonymized (initials only)
- **Secure API Calls**: OpenAI calls handled server-side
- **Data Encryption**: All data encrypted in transit and at rest
- **HIPAA Compliance**: Designed with healthcare privacy in mind

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@slpcompass.com or create an issue in the repository.
