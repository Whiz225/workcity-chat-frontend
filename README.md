# Workcity Chat Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14.x-blue)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

A real-time chat interface for eCommerce platforms, enabling communication between customers, support agents, designers, and merchants.

## Features

- **Real-time messaging** with Socket.IO integration
- **User authentication** (login/register)
- **Role-based access control** (admin, agent, customer, designer, merchant)
- **Conversation management**
- **Typing indicators** and online status
- **File attachments** in messages
- **Dark/Light mode** toggle
- **Responsive design** for all devices
- **Admin dashboard** with usage statistics

## Tech Stack

**Frontend:**

- Next.js (App Router)
- React.js
- TypeScript (optional)
- Tailwind CSS

**State Management:**

- React Context API
- Custom hooks

**Real-time Communication:**

- Socket.IO client

**UI Components:**

- Heroicons
- Headless UI

**Form Handling:**

- React Hook Form (implicit in components)
- Server Actions

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/workcity-chat-frontend.git
   cd workcity-chat-frontend
   ```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/workcity-chat-frontend.git
   cd workcity-chat-backend

   ```

2. ```bash
   npm Install

   ```

3. **Set up environment variables**

   ```.env
   -NEXT_PUBLIC_API_URL=http://localhost:9000
   -NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
   ```

4. **run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

   **Project Structure**
   -workcity-chat-frontend/
   -├── app/ # App router pages
   -│ ├── (auth)/ # Authentication routes
   -│ ├── admin/ # Admin routes
   -│ ├── chat/ # Chat routes
   -│ ├── profile/ # Profile page
   -│ └── ... # Other pages
   -├── components/ # Reusable components
   -│ ├── Auth/ # Auth components
   -│ ├── Chat/ # Chat components
   -│ ├── UI/ # UI components
   -│ └── ... # Other components
   -├── context/ # Context providers
   -├── lib/ # Utility functions
   -├── public/ # Static assets
   -└── styles/ # Global styles

## Challenges and Solutions

1. Real-time Communication
   -Challenge: Synchronizing messages across clients in real-time

   ## Solution:

   -Implemented Socket.IO client with custom hooks
   -Created chat context for state management
   -Used rooms for conversation-specific communication

2. Authentication Flow
   -Challenge: Secure JWT handling with server-side validation

   ## Solution:

   -Implemented Next.js middleware for route protection
   -Used HTTP-only cookies for token storage
   -Created server actions for auth operations

3. File Uploads
   -Challenge: Handling file attachments with size limits

   ## Solution:

   -Implemented FormData for file uploads
   -Added client-side validation for file types/sizes
   -Created preview system before upload

4. Theme Switching
   -Challenge: Persisting theme preference across pages

   ## Solution:

   -Created ThemeContext with localStorage persistence
   -Implemented CSS variables for theming
   -Added system preference detection

5. Responsive Design
   -Challenge: Adapting chat interface for mobile
   ## Solution:
   -Used Tailwind's responsive utilities
   -Created mobile-friendly chat layout
   -Implemented touch-friendly controls

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

## Deploy on Vercel

```

```
