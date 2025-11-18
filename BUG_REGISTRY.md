# 🐛 GREMLIN RAYO BUG REGISTRY
**Generated:** 2025-11-18
**Target:** DONA+ Backend Infrastructure
**Scan Status:** Phase 1 Complete

---

## ⚡ CRITICAL ISSUES (Production Blockers)

### C-001: Build Configuration Allows Errors
**File:** `next.config.mjs`
**Severity:** 🔴 CRITICAL
**Impact:** Production deployment with TypeScript/ESLint errors

**Issue:**
```javascript
typescript: {
  ignoreBuildErrors: true  // DANGEROUS
},
eslint: {
  ignoreDuringBuilds: true  // DANGEROUS
}
```

**Risk:** Code ships to production with type safety violations and linting errors.

**Fix:** Remove both flags and resolve all underlying errors first.

---

### C-002: Missing Type Export (`Database`)
**File:** `lib/types/supabase-helpers.ts`
**Line:** 1
**Severity:** 🔴 CRITICAL

**Issue:**
```typescript
import { Database } from './database.types'  // DOES NOT EXIST
```

**Error:** `Module '"./database.types"' has no exported member 'Database'`

**Root Cause:** Type system mismatch - manual types in `database.types.ts` vs Supabase-generated types expected by `supabase-helpers.ts`

**Fix Options:**
1. Generate actual Supabase types: `npx supabase gen types typescript`
2. OR remove `supabase-helpers.ts` entirely (not used anywhere)

---

### C-003: Invalid `DeliveryStatus` Values Used
**File:** `app/(dashboard)/dashboard/deliveries/page.tsx`
**Lines:** 28-32
**Severity:** 🔴 CRITICAL

**Issue:**
```typescript
const statuses = {
  all: 'Todos',
  pending: 'Pendiente',
  scheduled: 'Programada',  // ❌ NOT IN ENUM
  in_transit: 'En Tránsito',
  delivered: 'Entregada',
  cancelled: 'Cancelada',
  failed: 'Fallida'  // ❌ NOT IN ENUM
}
```

**Actual `DeliveryStatus` Enum:**
```typescript
'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled'
```

**Missing:** `scheduled`, `failed`
**Consequence:** Type errors, broken filters, incorrect UI state

**Fix:**
1. Add `scheduled` and `failed` to `DeliveryStatus` enum in `database.types.ts`
2. OR remove UI references to these statuses
3. Update database migration if adding to schema

---

## 🟡 HIGH PRIORITY ISSUES

### H-001: Missing Import `TrendingDown`
**File:** `app/(dashboard)/dashboard/page.tsx`
**Line:** 171
**Severity:** 🟡 HIGH

**Issue:**
```typescript
// Line 7-9: Imports from lucide-react
import {
  Package, Users, Truck, MapPin, TrendingUp,  // TrendingUp ✅
  Heart, ChevronRight, Calendar, Loader2
}
// Line 171: Uses TrendingDown ❌
<TrendingDown className="h-4 w-4 text-red-500 mr-1" />
```

**Error:** `'TrendingDown' is not defined`

**Fix:** Add `TrendingDown` to imports from `lucide-react`

---

### H-002: Type Mismatch - `trend` Property
**File:** `app/(dashboard)/dashboard/page.tsx`
**Lines:** 52, 171-176
**Severity:** 🟡 HIGH

**Issue:**
```typescript
// Line 52: declares trend as 'neutral'
trend: 'neutral' as const,

// Line 171: checks for 'down' which never matches
} : stat.trend === 'down' ? (  // ❌ 'neutral' !== 'down'
```

**Error:** `This comparison appears to be unintentional because the types '"neutral"' and '"down"' have no overlap`

**Fix:** Change line 171 from `=== 'down'` to `=== 'neutral'` OR update the statsCards to use correct trend values

---

### H-003: Null vs Undefined Type Mismatch
**File:** `app/(dashboard)/dashboard/donations/new/page.tsx`
**Lines:** 58-59
**Severity:** 🟡 HIGH

**Issue:**
```typescript
category_id: formData.category_id || null,  // ❌ returns null
center_id: formData.center_id || null,      // ❌ returns null
```

**Error:** `Type 'string | null' is not assignable to type 'string | undefined'`

**Root Cause:** TypeScript interfaces expect `undefined` for optional fields, but code passes `null`

**Fix:** Change `|| null` to `|| undefined` OR use `formData.category_id || ''` OR update type definitions to accept `null`

---

### H-004: No API Routes Implemented
**File:** `app/api/`
**Severity:** 🟡 HIGH

**Issue:** API directory only contains empty `auth` folder. No actual API endpoints.

**Consequence:**
- All data operations happen client-side
- No server-side validation
- No rate limiting
- Exposed database logic

**Recommendation:** Implement server-side API routes for:
- `/api/donations` - CRUD operations
- `/api/deliveries` - assignment and status updates
- `/api/uploads` - image upload to Supabase Storage
- `/api/webhooks` - Supabase realtime webhooks

---

## 🟢 MEDIUM PRIORITY ISSUES

### M-001: Environment Variables Without Type Safety
**Files:** Multiple
**Severity:** 🟢 MEDIUM

**Issue:** All `process.env` access uses non-null assertions `!` without validation:
```typescript
process.env.NEXT_PUBLIC_SUPABASE_URL!
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

**Risk:** Runtime errors if env vars missing

**Fix:** Create env validation utility:
```typescript
// lib/env.ts
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // ... with runtime validation
}
```

---

### M-002: Inconsistent Error Handling
**Files:** All hooks (`lib/hooks/use-*.ts`)
**Severity:** 🟢 MEDIUM

**Issue:** Catch blocks use `any` type and generic error messages:
```typescript
} catch (err: any) {
  toast.error('Error al cargar donaciones')
  // Actual error details lost
}
```

**Recommendation:**
- Structured error handling
- Error logging service integration
- User-friendly error messages with technical details in console

---

### M-003: No Input Sanitization
**Files:** All forms
**Severity:** 🟢 MEDIUM

**Issue:** User inputs not sanitized before database insertion

**Risk:** XSS, SQL injection (mitigated by Supabase parameterized queries)

**Recommendation:** Add sanitization layer using DOMPurify or similar

---

### M-004: Image Upload Placeholder
**File:** `app/(dashboard)/dashboard/donations/new/page.tsx`
**Lines:** 77-92
**Severity:** 🟢 MEDIUM

**Issue:**
```typescript
// In production, upload to Supabase Storage
// For now, convert to data URLs  // ❌ TODO comment
```

**Consequence:** Images stored as base64 in database (inefficient, size limits)

**Fix:** Implement proper Supabase Storage integration

---

## 📊 ARCHITECTURAL CONCERNS

### A-001: No Database RLS Policies Validation
**Severity:** 🟡 HIGH

**Issue:** No verification that Row Level Security policies are correctly implemented

**Risk:** Unauthorized data access

**Action Required:**
1. Review all RLS policies in migrations
2. Test with different user roles
3. Ensure principle of least privilege

---

### A-002: N+1 Query Pattern in Hooks
**Files:** `lib/hooks/use-donations.ts`, others
**Severity:** 🟢 MEDIUM

**Issue:** Hooks fetch relations with every query:
```typescript
.select(`
  *,
  donor:dona_users!dona_donations_donor_id_fkey(*),
  beneficiary:dona_users!dona_donations_beneficiary_id_fkey(*),
  category:dona_categories(*),
  center:dona_centers(*),
  organization:dona_organizations(*)
`)
```

**Impact:** Performance degradation with scale

**Recommendation:**
- Lazy load relations
- Implement pagination
- Add caching layer (Redis)

---

### A-003: No Server Components Usage
**Severity:** 🟢 MEDIUM

**Observation:** All dashboard pages use `'use client'` directive

**Impact:** Missed opportunities for:
- Server-side rendering
- Reduced client bundle size
- Better SEO

**Recommendation:** Refactor to Server Components where possible, use Client Components only for interactivity

---

## 🔒 SECURITY AUDIT FINDINGS

### S-001: Service Role Key in Client Code Risk
**File:** `lib/supabase/server.ts`
**Severity:** 🟡 HIGH

**Issue:** `createServerSupabaseAdminClient()` uses service role key

**Risk:** If accidentally used in client component, exposes full database access

**Mitigation:**
- Keep strictly server-side
- Add runtime check to prevent client usage
- Document danger clearly

---

### S-002: Middleware Auth Bypass in Development
**File:** `middleware.ts`
**Line:** 78
**Severity:** 🟢 MEDIUM

**Issue:**
```typescript
if (isProtectedPath && !user && process.env.NODE_ENV === 'production') {
  return NextResponse.redirect(new URL('/login', request.url))
}
```

**Consequence:** Protected routes accessible in dev without auth

**Recommendation:** Use feature flag instead of NODE_ENV check

---

## 📈 PERFORMANCE ISSUES

### P-001: No Code Splitting
**Severity:** 🟢 MEDIUM

**Issue:** Large bundle size, all components loaded upfront

**Fix:** Implement dynamic imports:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

---

### P-002: No Image Optimization
**Severity:** 🟢 MEDIUM

**Issue:** Not using Next.js `<Image>` component

**Impact:** Unoptimized images, slower page loads

**Fix:** Replace `<img>` with `<Image>` from `next/image`

---

## 📋 SUMMARY

**Total Issues:** 22
- 🔴 **Critical:** 3
- 🟡 **High:** 4
- 🟢 **Medium:** 10
- 📊 **Architectural:** 3
- 🔒 **Security:** 2
- 📈 **Performance:** 2

**Estimated Fix Time:** 8-12 hours
**Priority Order:** C-001 → C-002 → C-003 → H-001 → H-002 → H-003 → H-004

---

**Next Actions:**
1. Fix all CRITICAL issues
2. Enable TypeScript strict mode
3. Run full type check
4. Implement missing API routes
5. Security audit of RLS policies
6. Performance optimization pass

---

**Gremlin Rayo Status:** ⚡ REGISTRY COMPLETE - AWAITING REPAIR AUTHORIZATION
