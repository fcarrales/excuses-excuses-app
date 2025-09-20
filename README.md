# Excuses, Excuses! App

A fun React-based application for generating creative excuses for various situations. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚨 Important Setup Note

**Due to naming restrictions in Next.js/Webpack, this project cannot be built in a folder containing exclamation marks (!).** 

To run this project successfully:

1. **Rename the folder** to something like `excuse-generator` (without special characters)
2. **Or move the project** to a new folder with a valid name
3. **Then run the build command**

## Features

- 🎭 Multiple excuse categories (Work, School, Date)
- 😂 Different tones (Funny, Professional, Believable)
- ⭐ Save favorite excuses
- 🎯 Daily excuse widget
- 👑 Premium features mockup
- 📱 Share functionality
- 🎨 Beautiful UI with animations
- 📱 Fully responsive design

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   └── switch.tsx
│   └── ExcuseGeneratorApp.tsx  # Main app component
└── lib/
    └── utils.ts            # Utility functions
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Lucide React** - Icons
- **Radix UI** - Headless UI primitives

## Getting Started

1. **Rename this folder** to remove exclamation marks (e.g., `excuse-generator`)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Component Features

### Main Features
- **Onboarding Flow**: Choose your excuse style preference
- **Situation Selection**: Work, School, or Date scenarios
- **Tone Options**: Funny, Professional, or Believable
- **Instant Generation**: Click to generate contextual excuses
- **Favorites System**: Save your best excuses
- **Daily Widget**: Random excuse of the day

### UI/UX Features
- **Responsive Design**: Works on all screen sizes
- **Gradient Backgrounds**: Beautiful color schemes for each screen
- **Smooth Animations**: Hover effects and transitions
- **Accessible Components**: Built with Radix UI primitives
- **Type Safety**: Full TypeScript integration

## Excuse Categories

### Work Excuses
- **Funny**: "My WiFi got stage fright during the meeting."
- **Professional**: "I'm dealing with unexpected technical issues and will join shortly."
- **Believable**: "Traffic was heavier than expected, I'll be late."

### School Excuses
- **Funny**: "My dog ate my Zoom link."
- **Professional**: "I was feeling unwell and couldn't attend class."
- **Believable**: "The bus was delayed, I'll be there soon."

### Date Excuses
- **Funny**: "My horoscope said Mercury's in retrograde, bad night to meet."
- **Professional**: "An urgent work matter came up, I need to reschedule."
- **Believable**: "Family emergency, can we push dinner?"

## Development Guidelines

- Use functional components with React hooks
- Follow TypeScript best practices
- Implement responsive design with Tailwind CSS
- Use shadcn/ui components for consistent UI
- Maintain clean component structure

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is for educational and entertainment purposes.