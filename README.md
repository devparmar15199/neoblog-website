# NeoBlog Website

A modern, performant blogging platform built with **React**, **Vite**, and **TypeScript**. Features a mobile-first responsive design with **Tailwind CSS**, powerful state management via **Redux Toolkit**, and a robust backend powered by **Supabase**.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Environment Configuration](#environment-configuration)
7. [Development](#development)
8. [Scripts](#scripts)
9. [State Management](#state-management)
10. [Styling](#styling)
11. [Backend & Database](#backend--database)
12. [Building for Production](#building-for-production)
13. [Deployment](#deployment)
14. [Contributing](#contributing)
15. [Contact](#contact)

---

## Overview

NeoBlog Website is a modern blogging platform designed to be fast, scalable, and developer-friendly. It combines the power of **React** with **Vite's** lightning-fast build tooling, **Redux Toolkit** for predictable state management, and **Supabase** for a serverless backend. The mobile-first approach with **Tailwind CSS** ensures a responsive experience across all devices.

**Why NeoBlog?**
- ⚡ Blazing fast development and production builds with Vite
- 🎨 Mobile-first responsive design with Tailwind CSS
- 📦 Predictable state management with Redux Toolkit
- 🔐 Secure backend with Supabase authentication & database
- 📱 Responsive across all devices

---

## Features

| Category | Feature | Status |
|----------|---------|--------|
| **Authoring** | Create, edit, and publish blog posts | ✅ |
| **Authoring** | Draft & Published post states | ✅ |
| **Authoring** | Rich text editor support | ✅ |
| **Content** | Tags and categories | ✅ |
| **Content** | Search functionality | ✅ |
| **User Management** | User authentication (email/password) | ✅ |
| **User Management** | User profiles | ✅ |
| **Comments** | Reader comments system | ✅ |
| **UX** | Responsive mobile-first design | ✅ |
| **UX** | Dark/Light theme toggle | ✅ |
| **Performance** | Image optimization & lazy loading | TODO |
| **Admin** | Admin dashboard | ✅ |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18+ | UI library |
| **Build Tool** | Vite | Fast bundling & dev server |
| **Language** | TypeScript | Type safety |
| **State Management** | Redux Toolkit | Predictable state container |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Backend** | Supabase | PostgreSQL + Auth + Realtime |
| **Authentication** | Supabase Auth | User login & session management |
| **Database** | Supabase PostgreSQL | Data persistence |
| **Linting** | ESLint + Prettier | Code quality & formatting |
| **Deployment** | Vercel / Netlify | Hosting |

---

## Project Structure

```
blog-website/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── posts/
│   │   └── ...
│   ├── pages/               # Page-level components
│   ├── store/               # Redux store & slices
│   │   ├── slices/          # Redux Toolkit slices
│   │   └── index.ts
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API & Supabase services
│   │   ├── supabaseClient.ts
│   │   ├── authService.ts
│   │   ├── postService.ts
│   │   └── ...
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── .env.example             # Example environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 16.x
- **npm** >= 8.x or **pnpm** >= 7.x
- A **Supabase** account (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/devparmar15199/neoblog-website.git
   cd blog-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Configuration](#environment-configuration))

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Visit `http://localhost:5173` (Vite default port)

---

## Environment Configuration

Create a `.env.local` file in the root directory with your Supabase credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

```

> **Note:** Variables prefixed with `VITE_` are exposed to the client. Never commit `.env.local` to version control. Use `.env.example` for documentation.

Example `.env.example`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

```

---

## Development

### Start Dev Server

```bash
npm run dev
```

The development server runs with hot module replacement (HMR) enabled for instant updates.

### Code Quality

**Lint code:**
```bash
npm run lint
```

**Format code:**
```bash
npm run format
```

**Type check:**
```bash
npm run typecheck
```

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server |
| `build` | `vite build` | Create optimized production build |
| `preview` | `vite preview` | Preview production build locally |
| `lint` | `eslint src --ext ts,tsx` | Check code quality |
| `format` | `prettier --write src` | Format code |
| `typecheck` | `tsc --noEmit` | Type checking |

---

## State Management

**Redux Toolkit** manages global state for:
- User authentication state
- Blog posts list & detail
- UI state (modals, toasts, etc.)
- Filter & search state

Example slice structure:
```typescript
// src/store/slices/postsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: { items: [], loading: false, error: null },
  reducers: { /* ... */ },
  extraReducers: { /* ... */ }
});
```

Access state in components:
```typescript
import { useSelector, useDispatch } from 'react-redux';

const MyComponent = () => {
  const posts = useSelector(state => state.posts.items);
  const dispatch = useDispatch();
  
  return <div>{/* ... */}</div>;
};
```

---

## Styling

**Tailwind CSS** is configured for mobile-first responsive design:

```typescript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    },
  },
  plugins: [],
};
```

**Mobile-First Approach:**
```jsx
<div className="w-full md:w-1/2 lg:w-1/3 p-4 md:p-6">
  Responsive component
</div>
```

---

## Backend & Database

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Create tables for:
   - `profiles` - User information
   - `posts` - Blog posts
   - `comments` - Post comments (optional)
3. Configure Row Level Security (RLS) policies
4. Copy API URL and anon key to `.env.local`

### Example Service Layer

```typescript
// src/services/postService.ts
import { supabaseClient } from './supabaseClient';

export const postService = {
  async getPosts() {
    const { data, error } = await supabaseClient
      .from('posts')
      .select('*')
      .eq('published', true);
    
    if (error) throw error;
    return data;
  },

  async createPost(post: Post) {
    const { data, error } = await supabaseClient
      .from('posts')
      .insert([post])
      .select();
    
    if (error) throw error;
    return data;
  }
};
```

---

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Output is in the `dist/` directory, ready to deploy.

Preview the build locally:

```bash
npm run preview
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repo at [vercel.com](https://vercel.com)
3. Add environment variables in project settings
4. Deploy (auto-deploys on push to main)

---

## Performance Tips

- ✅ Vite provides optimized bundling out of the box
- ✅ Tailwind CSS is tree-shaken for minimal CSS output
- ✅ Use React.lazy() for code splitting
- ✅ Implement image lazy loading
- ✅ Monitor bundle size with `npm run build -- --analyze`

---

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feat/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. Push to branch:
   ```bash
   git push origin feat/amazing-feature
   ```
5. Open a Pull Request

### Code Guidelines
- Follow TypeScript strict mode
- Use ESLint & Prettier
- Write descriptive commit messages
- Add tests for new features

---

## Contact

- **Author:** [devparmar15199](https://github.com/devparmar15199)
- **GitHub:** [neoblog-website](https://github.com/devparmar15199/neoblog-website)
- **Issues:** [GitHub Issues](https://github.com/devparmar15199/neoblog-website/issues)

---

## Roadmap

- [ ] Rich text editor integration
- [ ] Search functionality
- [ ] Comment system with moderation
- [ ] Author profiles & bio pages
- [ ] Dark/Light theme toggle
- [ ] RSS feed generation
- [ ] Image optimization pipeline
- [ ] Analytics integration
- [ ] Multi-author support
- [ ] Email newsletter subscription
- [ ] Social media sharing buttons
- [ ] SEO optimization guide

---

## Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

---

Happy blogging with NeoBlog! 🚀
