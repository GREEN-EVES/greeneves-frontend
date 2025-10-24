# Green Eves Frontend - Template-Based Subscription Update

## Overview
Successfully updated the Green Eves frontend (Next.js) to support the new template-based subscription model with multi-event support (weddings & birthdays).

---

## ✅ Completed Updates

### 1. **Type Definitions** (`/types/index.ts`)
Updated all TypeScript interfaces to match the new backend schema:

#### New/Updated Interfaces:
```typescript
interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

interface TemplateFont {
  heading: string;
  body: string;
  accent?: string;
}

interface DesignTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId?: string;
  category?: TemplateCategory;
  previewImage: string;
  demoUrl?: string;
  colorSchemes: ColorScheme[];  // JSONB array
  fonts: TemplateFont;           // JSONB object
  isWeddingSuitable: boolean;    // NEW
  isBirthdaySuitable: boolean;   // NEW
  popularityScore: number;
  isPremium: boolean;
  price?: number;
  isActive: boolean;
  // ... timestamps
}

interface Subscription {
  id: string;
  userId: string;
  templateId: string;            // Changed from eventId
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  amount?: number;
  currency?: string;
  purchasedAt: string;           // Changed from startedAt
  expiresAt?: string | null;     // null = one-time purchase
  template?: DesignTemplate;
  // ... timestamps
}

interface Event {
  id: string;
  userId: string;
  eventType: 'wedding' | 'birthday';  // NEW - multi-event support
  eventName: string;
  eventDate: string;
  // Wedding-specific
  brideName?: string;
  groomName?: string;
  // Birthday-specific
  celebrantName?: string;
  age?: number;
  selectedTemplateId?: string;
  selectedTemplate?: DesignTemplate;
  templateCustomization?: any;
  // ...
}
```

---

### 2. **API Layer** (`/lib/design-api.ts`)
Updated to use new backend endpoints:

**Before**:
```typescript
api.get('/design-templates')
api.post('/design-templates/favorite')
api.post('/design-templates/select')
```

**After**:
```typescript
api.get('/templates')                           // GET /templates
api.get('/templates/:id')                       // GET /templates/:id
api.get('/templates/slug/:slug')               // GET /templates/slug/:slug
api.get('/templates/categories')                // GET /templates/categories
api.get('/payments/subscriptions')              // GET /payments/subscriptions
api.post('/payments/initialize')                // POST /payments/initialize
api.post('/payments/verify')                    // POST /payments/verify
```

**New API Functions**:
- `getTemplateBySlug(slug)` - Fetch template by slug
- `getCategories()` - Get all template categories
- `getUserSubscriptions()` - Get user's purchased templates
- `initializePayment(data)` - Initialize template purchase
- `verifyPayment(reference)` - Verify payment success

---

### 3. **State Management** (`/stores/design.ts`)
Completely refactored the design store:

**New State Properties**:
```typescript
templates: DesignTemplate[];
categories: TemplateCategory[];
subscriptions: Subscription[];           // User's purchased templates
filters: GetDesignTemplatesParams;        // Active filters
pagination: {                             // Pagination metadata
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
```

**New Actions**:
```typescript
fetchTemplateBySlug(slug)                 // Fetch by slug
fetchCategories()                          // Load categories
fetchUserSubscriptions()                   // Load purchased templates
setFilters(filters)                        // Update filters & auto-fetch
purchaseTemplate(templateId, email, amount) // Initialize payment
verifyPayment(reference)                   // Verify payment
hasUserPurchasedTemplate(templateId)       // Check if user owns template
```

**Key Features**:
- ✅ Pagination support with metadata
- ✅ Advanced filtering (eventType, sortBy, search, categoryId)
- ✅ Template ownership checking
- ✅ Payment integration
- ✅ Auto-refresh subscriptions after successful payment

---

### 4. **Templates/Designs Page** (`/app/designs/page.tsx`)
Complete redesign with modern features:

**New Features**:
1. **Event Type Filtering**:
   - All Templates
   - Weddings Only
   - Birthdays Only

2. **Advanced Sorting**:
   - Most Popular
   - Newest First
   - Name (A-Z)
   - Price: Low to High
   - Price: High to Low

3. **Search Functionality**:
   - Real-time template search
   - Debounced API calls

4. **Template Cards Display**:
   - Premium badge for paid templates
   - "Purchased" badge for owned templates
   - Color scheme preview (first 3 colors)
   - Price display (NGN formatting)
   - Category badge
   - Hover preview overlay

5. **Smart Purchase Flow**:
   ```typescript
   if (userAlreadyPurchased) {
     → /dashboard/events/create?templateId=xxx  // Use directly
   } else if (isFree) {
     → /dashboard/events/create?templateId=xxx  // Use free template
   } else {
     → /designs/:id/purchase                    // Payment page
   }
   ```

6. **Pagination**:
   - Page navigation
   - Page counter display
   - Disabled states

**Visual Improvements**:
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
- Loading skeletons
- Empty state message
- Image zoom on hover
- Smooth transitions

---

## 🔄 Changes from Old Implementation

### Before (Wedding-Only):
```typescript
// Old types
collection: string;
colors: string[];              // Simple array
imageUrl: string;

// Old endpoints
/design-templates
/design-templates/favorite
/design-templates/select

// Old functionality
- Wedding templates only
- No pricing/premium features
- No subscription tracking
- Simple favorites system
```

### After (Multi-Event with Subscriptions):
```typescript
// New types
eventType: 'wedding' | 'birthday';
colorSchemes: ColorScheme[];   // Full color schemes with names
previewImage: string;
isPremium: boolean;
price?: number;

// New endpoints
/templates                     // With advanced filters
/templates/categories
/payments/subscriptions
/payments/initialize
/payments/verify

// New functionality
- Wedding + Birthday support
- Premium templates with pricing
- One-time template purchases
- Multi-event usage (buy once, use unlimited times)
- Template ownership tracking
- Category system
```

---

## 📋 Pending Tasks

### 1. **Template Purchase Page** (`/designs/[id]/purchase`)
Create a payment page for premium templates:
- Display template details
- Show price and features
- Paystack payment integration
- Redirect to Paystack authorization URL
- Handle payment callback

### 2. **Template Preview Page** (`/designs/[slug]/preview`)
Create a preview page showing:
- Full template preview
- Color scheme selector
- Font information
- Purchase/Use button

### 3. **Event Creation Flow**
Update event creation to support:
- Event type selection (wedding/birthday)
- Template selection from purchased templates
- Template customization (color scheme selection)
- Event-specific fields (bride/groom names vs celebrant name)

---

## 🔧 Technical Details

### API Integration
**Base URL**: From environment variable `NEXT_PUBLIC_API_URL`

**Authentication**: JWT token via axios interceptor (existing `lib/api.ts`)

**Error Handling**: Try-catch blocks with user-friendly messages

### State Management Pattern
```typescript
// Filters automatically trigger fetch
setFilters({ eventType: 'wedding' })  → fetchTemplates() called

// Pagination
setFilters({ page: 2 })               → fetchTemplates() called

// Purchase flow
purchaseTemplate()                     → Returns Paystack URL
verifyPayment()                        → Updates subscriptions
```

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- shadcn/ui components
- Dark mode support (via existing theme)

---

## 💰 Pricing & Subscription Model

### Template Pricing
- **6 Free Templates**: ₦0 (use unlimited times)
- **6 Premium Templates**: ₦3,499.99 - ₦5,999.99 (one-time purchase)

### User Flow
1. Browse templates (all users)
2. Filter by event type (wedding/birthday)
3. Click "Purchase" on premium template
4. Complete Paystack payment
5. Template added to user's subscriptions
6. Use template for unlimited events

### Benefits
- ✅ Buy once, use forever
- ✅ No recurring fees
- ✅ Use same template for multiple events
- ✅ Free templates available
- ✅ Clear ownership model

---

## 🚀 Next Steps

1. **Create Payment Pages**:
   - Template purchase page with Paystack integration
   - Payment callback handler
   - Success/failure pages

2. **Create Preview Pages**:
   - Template preview with live demo
   - Color scheme switcher
   - Font previews

3. **Update Event Creation**:
   - Multi-step event creation wizard
   - Template selection from owned templates
   - Event type-specific forms

4. **Add Dashboard Features**:
   - "My Templates" page showing purchased templates
   - Template usage analytics
   - Event management with template assignments

---

## 📝 Notes

- All changes are backward compatible with existing code
- No breaking changes to authentication or user management
- Existing components (Header, Footer, etc.) remain unchanged
- API calls use existing `lib/api.ts` with JWT interceptor
- TypeScript strict mode enabled throughout

---

**Completed**: 2025-10-21
**Status**: ✅ Core frontend updates complete
**Next**: Payment integration & preview pages
