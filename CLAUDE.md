# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DONA+ is a B2B2C SaaS platform for donation management connecting donors with beneficiaries through transport companies. Built with Next.js 14, TypeScript, Supabase, and deployed on Vercel at dona.sujeto10.com.

## Development Commands

### Local Development
```bash
npm run dev          # Start dev server on port 3003 (http://localhost:3003)
npm run build        # Production build (ignores ESLint/TypeScript errors - see note below)
npm run start        # Start production server on port 3003
npm run lint         # Run ESLint
```

### Database Operations
```bash
npx supabase db push              # Apply migrations to database
npx supabase db reset             # Reset database and reapply migrations
npx supabase migration new <name> # Create new migration file
```

### Deployment
```bash
vercel --prod        # Deploy to production (Vercel)
```

## Architecture

### Authentication & Authorization

**Dual Supabase Client Pattern:**
- `lib/supabase/client.ts`: Browser client for client components (`createClient()`)
- `lib/supabase/server.ts`: Server client for server components/API routes (`createServerSupabaseClient()`)
  - Also provides `createServerSupabaseAdminClient()` for admin operations using service role key

**Auth Flow:**
- Middleware (`middleware.ts`) handles session refresh and route protection
- Protected paths: `/dashboard`, `/admin`, `/profile`, `/donations/new`
- Auth redirects work in production only (disabled in dev for easier testing)
- Client-side auth state managed by `AuthProvider` context (`components/providers/auth-provider.tsx`)

**Important:** Always use appropriate client based on context:
- Client components → `createClient()`
- Server components/API → `createServerSupabaseClient()`
- Admin operations → `createServerSupabaseAdminClient()`

### Data Layer

**Database Schema (Supabase PostgreSQL):**
- `dona_organizations`: Transport companies (B2B customers)
- `dona_users`: All user types (super_admin, org_admin, org_member, driver, beneficiary, donor)
- `dona_donations`: Donation items with statuses (pending, published, claimed, in_transit, delivered, cancelled)
- `dona_centers`: Collection centers with capacity tracking
- `dona_deliveries`: Delivery assignments and tracking
- `dona_categories`: Donation categories
- Other supporting tables for messages, ratings, etc.

**Data Access Pattern:**
- Custom React hooks in `lib/hooks/` for all data operations (donations, centers, beneficiaries, deliveries, stats)
- Hooks handle loading states, errors, CRUD operations, and automatic re-fetching
- All hooks use the client-side Supabase client
- Example: `useDonations({ status, categoryId, search, limit, offset })`

### Route Structure

**App Router (Next.js 14):**
```
app/
├── (auth)/              # Auth routes (login, signup, forgot-password, reset-password)
├── (dashboard)/         # Protected dashboard routes
│   └── dashboard/       # Main dashboard pages
│       ├── beneficiaries/
│       ├── centers/
│       ├── deliveries/
│       ├── donations/
│       │   └── new/    # Create donation form
│       ├── messages/
│       ├── reports/
│       └── settings/
├── api/                 # API routes
│   └── auth/           # Auth callbacks
├── privacy/            # Static privacy page
├── terms/              # Static terms page
└── page.tsx            # Landing page
```

**Route Groups:**
- `(auth)`: Public auth pages
- `(dashboard)`: Protected dashboard pages requiring authentication

### Component Organization

**Providers:**
- `AuthProvider`: Global auth state, user profile, sign in/out/up methods
- Wrapped in root layout, provides `useAuth()` hook

**Reusable Components:**
- `components/auth/`: Auth-related UI components
- `components/providers/`: React context providers
- `components/error-boundary.tsx`: Error handling boundary

**UI Components:**
- Using Radix UI primitives (@radix-ui/*)
- Tailwind CSS for styling with `class-variance-authority` for variants
- `lib/utils.ts` contains `cn()` utility for conditional classnames

### Type System

**Database Types:**
- `lib/types/database.types.ts`: Complete TypeScript types generated from Supabase schema
- Includes enums for roles, statuses, and all table types
- Always import types from this file for type safety

**Path Aliases:**
- `@/*` maps to project root (configured in tsconfig.json)
- Example: `import { createClient } from '@/lib/supabase/client'`

### Form Handling

**Stack:**
- `react-hook-form` for form state management
- `@hookform/resolvers` + `zod` for validation
- Validation schemas in `lib/validations/`

**Pattern:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from '@/lib/validations/...'

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})
```

### State Management

- React Query (`@tanstack/react-query`) for server state (not heavily used currently)
- React Context for global state (Auth)
- Local state with hooks for component state
- Custom hooks abstract data fetching and mutations

### Notifications

- `react-hot-toast` for toast notifications
- Import: `import toast from 'react-hot-toast'`
- Usage: `toast.success()`, `toast.error()`, `toast.loading()`

## Important Notes

### Build Configuration Warning

**CRITICAL:** The project has `ignoreBuildErrors: true` for TypeScript and `ignoreDuringBuilds: true` for ESLint in `next.config.mjs`. This allows production builds to succeed despite errors.

**Implications:**
- Production builds will succeed even with type errors or linting issues
- Always run `npm run lint` and check TypeScript manually before deploying
- Consider running `npx tsc --noEmit` to check types without building
- This was added for quick deployment but should be fixed for production quality

### Environment Variables

**Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://nqzhxukuvmdlpewqytpv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # For admin operations
NEXT_PUBLIC_APP_URL=https://dona.sujeto10.com # Or localhost in dev
```

**File Management:**
- `.env.local`: Local development (gitignored)
- `.env.production`: Production values (gitignored)
- Never commit actual keys to git

### Database Migrations

**Location:** `supabase/migrations/`

**Current Migrations:**
1. `20250118000000_dona_initial_schema.sql`: Complete initial schema
2. `20250119000000_fix_user_insert_policy.sql`: User insert policy fix

**Process:**
1. Create migration: `npx supabase migration new <descriptive_name>`
2. Edit SQL file in `supabase/migrations/`
3. Apply locally: `npx supabase db push`
4. Commit migration file to git
5. Migrations auto-apply on Vercel deployment

### Authentication Middleware

**Behavior:**
- Session refresh happens on every request via middleware
- Protected routes redirect to `/login` in production only
- Auth pages redirect to `/dashboard` if already logged in
- Development mode skips auth redirects for easier testing

**Protected Routes:**
- `/dashboard/*`
- `/admin/*`
- `/profile/*`
- `/donations/new`

### Port Configuration

Default development port is **3003** (not standard 3000):
- `npm run dev`: http://localhost:3003
- `npm run start`: http://localhost:3003

### Styling Approach

- Tailwind CSS utility-first approach
- Custom utilities in `lib/utils.ts` (`cn()` for class merging)
- Component variants via `class-variance-authority`
- No CSS modules or styled-components

### Icon System

Using `lucide-react` for all icons:
```typescript
import { IconName } from 'lucide-react'
```

### Date Formatting

Using `date-fns` (v4.1.0) for date operations:
```typescript
import { format, formatDistance } from 'date-fns'
```
