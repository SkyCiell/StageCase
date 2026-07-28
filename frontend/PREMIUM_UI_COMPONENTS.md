# Premium UI Components - StageCase

## Overview
Premium ticket-inspired UI components with boarding pass aesthetic for StageCase concert booking platform.

## Artist Color Themes

### Crayon Case
- Accent: `#2D6F73` (Teal)
- Secondary: `#B89B5E` (Gold)
- Mood: Premium, elegant, cinematic

### Reality Club
- Accent: `#5B4A7A` (Purple)
- Secondary: `#D8CBB6` (Cream)
- Mood: Dreamy, nostalgic, late-night

### The Milo
- Accent: `#6F8A58` (Olive)
- Secondary: `#D7C2A4` (Sand)
- Mood: Warm, earthy, coffee shop

### Wave to Earth
- Accent: `#5B7E99` (Blue)
- Secondary: `#C7D6D5` (Mint)
- Mood: Rainy, ocean, minimal

---

## Component Structure

### `/components/ticket/`
Premium ticket-inspired components with boarding pass aesthetic.

- **TicketCard** - Main concert ticket display with left stub
- **TicketStub** - Decorative section divider with tear-line
- **EventBadge** - Status/category badges (VIP, Early Bird, etc)
- **SeatChip** - Seat information display (Section, Row, Number)
- **TicketTimeline** - Booking progress stepper
- **DigitalPass** - Apple Wallet-style ticket pass with QR

### `/components/ui/`
Loading states, errors, and transitions.

- **SkeletonLoader** - Ticket-shaped skeleton loaders
  - `TicketCardSkeleton`
  - `ConcertGridSkeleton`
  - `TicketDetailSkeleton`
  - `BookingHistorySkeleton`

- **ErrorState** - Premium error displays
  - `NetworkError`
  - `NotFoundError`

- **EmptyState** - Empty state screens
  - `NoConcertsFound`
  - `NoBookingsYet`
  - `NoFavoritesYet`

- **PageTransition** - Smooth page animations
  - `FadeIn`
  - `SlideUp`
  - `ScaleIn`

### `/components/home/`
Landing page sections.

- **HeroSection** - Premium hero with featured concert
- **FeaturedArtists** - Artist showcase grid with color themes

### `/components/booking/`
Booking flow components.

- **TicketCategoryCard** - Premium ticket selection with quantity
- **BookingSummary** - Receipt-style booking summary

### `/components/concerts/`
Concert display components.

- **ConcertCard** - Ticket-shaped concert card (already exists, update with premium design)

---

## Design System

### Tailwind Custom Classes
```css
/* Boarding pass card with perforated edges */
.boarding-pass-card

/* Perforated edges */
.ticket-perforation-top
.ticket-perforation-bottom

/* Decorative barcode accent */
.barcode-accent

/* Tear line divider */
.ticket-tear-line
```

### Color Palette
```js
// tailwind.config.js
colors: {
  graphite: '#1A1D23',
  amber: '#E7B567',
  bronze: '#B89B5E',
  jade: '#2D6F73',
  error: '#D65A5A',
  success: '#6F8A58',
  warning: '#E7B567',
}
```

---

## Usage Examples

### Hero Section
```jsx
import { HeroSection } from '@/components/home';

<HeroSection featuredConcert={concerts[0]} />
```

### Featured Artists
```jsx
import { FeaturedArtists } from '@/components/home';

<FeaturedArtists concerts={allConcerts} />
```

### Concert List with Skeleton
```jsx
import ConcertCard from '@/components/concerts/ConcertCard';
import { ConcertGridSkeleton } from '@/components/ui';

{isLoading ? (
  <ConcertGridSkeleton count={6} />
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {concerts.map(c => <ConcertCard key={c.id} concert={c} />)}
  </div>
)}
```

### Ticket Category Selection
```jsx
import { TicketCategoryCard } from '@/components/booking';

<TicketCategoryCard
  category={vipCategory}
  quantity={quantity}
  onChange={setQuantity}
  accentColor="#2D6F73"
/>
```

### Booking Summary
```jsx
import { BookingSummary } from '@/components/booking';

<BookingSummary
  concert={concert}
  items={bookingItems}
  total={totalAmount}
  accentColor={concert.accent_color}
/>
```

### Empty States
```jsx
import { NoConcertsFound, NoBookingsYet } from '@/components/ui';

{concerts.length === 0 && (
  <NoConcertsFound onReset={() => clearFilters()} />
)}

{bookings.length === 0 && <NoBookingsYet />}
```

### Page Transitions
```jsx
import { PageTransition, SlideUp } from '@/components/ui';

export default function Page() {
  return (
    <PageTransition>
      <SlideUp delay={0.1}>
        {/* Your content */}
      </SlideUp>
    </PageTransition>
  );
}
```

---

## Pages Updated

### ✅ Landing Page (`LandingSimple.jsx`)
- HeroSection with featured concert
- FeaturedArtists grid
- Upcoming concerts section
- Premium features showcase
- CTA section

### ✅ Concert List (`user/ConcertList.jsx`)
- Premium filter bar
- Skeleton loading
- Empty states
- Ticket-styled pagination

### ✅ My Tickets (`user/MyTickets.jsx`)
- TicketCard grid
- Status filter tabs
- Booking history skeletons
- Empty state

### 🔄 TODO: Concert Detail
- Update with TicketTimeline
- Premium booking CTA
- Artist color theming

### 🔄 TODO: Checkout
- TicketCategoryCard integration
- BookingSummary sticky sidebar
- TicketTimeline progress

### 🔄 TODO: Booking Success
- DigitalPass component
- Download ticket button
- Share functionality

### 🔄 TODO: Ticket Detail
- Full DigitalPass view
- QR code display
- Print/download options

---

## Backend Requirements (NO CHANGES)

All components consume existing APIs:
- `GET /api/concerts` - Concert list
- `GET /api/concerts/:slug` - Concert detail
- `GET /api/bookings/my` - User bookings
- `POST /api/bookings` - Create booking
- `POST /api/payments` - Process payment

Artist colors stored in database `concerts.accent_color` field (optional).

---

## Migration Notes

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install framer-motion @tanstack/react-query
   ```

2. **Tailwind Config**: Already updated with graphite, amber, bronze colors

3. **CSS Utilities**: Already added to `index.css`

4. **Component Imports**: Use barrel exports:
   ```js
   import { HeroSection, FeaturedArtists } from '@/components/home';
   import { ConcertGridSkeleton, PageTransition } from '@/components/ui';
   import { TicketCard, EventBadge } from '@/components/ticket';
   ```

5. **Database Seed**: Run `docs/seed_new_artists.sql` to add Reality Club, The Milo, Wave to Earth concerts

---

## Design Philosophy

**Ticket-First Approach**
- Every major component references real concert tickets
- Perforated borders, barcodes, serial numbers
- Apple Wallet / Ticketmaster aesthetic
- No paper textures or vintage effects
- Clean, modern, minimal

**Artist Color Theming**
- Each artist has unique accent colors
- Colors enhance interface without dominating
- Ticket elements remain core visual identity

**Premium Feel**
- Smooth animations via Framer Motion
- High-quality skeleton loading
- Thoughtful empty states
- Consistent spacing and typography
- Hover interactions and transitions

---

## Performance Tips

1. Use React Query for caching concerts data
2. Lazy load images with loading states
3. Memoize ConcertCard for large lists
4. Use CSS transitions over JS animations where possible
5. Optimize QR code generation (done - version 5)

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast WCAG AA compliant
- Screen reader friendly

---

*Last Updated: 2026-07-27*
