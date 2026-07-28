# Quiet Luxury UI Design System

> **"Underrated but incredibly good"** - Subtle, sophisticated, premium.

## 🎯 Design Philosophy

Inspired by: **Linear, Vercel, Arc Browser, Notion, Stripe**

### Principles:
1. **Minimal Ornaments, Maximum Impact**
   - No unnecessary decorations
   - Every element serves a purpose
   - Clean, breathing layouts

2. **Micro-interactions Matter**
   - Subtle hover states
   - Smooth transitions (cubic-bezier)
   - Spring physics animations

3. **Typography Hierarchy is King**
   - Clear visual hierarchy
   - Proper font weights
   - Generous line-height

4. **Spacing Precision**
   - Consistent padding/margins
   - Optical alignment
   - Proper white space

5. **Glassmorphism & Blur Effects**
   - Subtle transparency
   - Backdrop blur
   - Layered depth

---

## 🎨 Visual Language

### Background Layers
```
Layer 1: #0A0E14 (Base - Darkest)
Layer 2: #131923 (Sections)
Layer 3: #1A2332 (Cards - with blur)
Layer 4: #232F42 (Elevated cards)
```

### Borders - Almost Invisible
```
Default:  rgba(255, 255, 255, 0.05)  /* Barely there */
Hover:    rgba(255, 255, 255, 0.10)  /* Subtle reveal */
Focus:    rgba(74, 155, 159, 0.30)   /* Accent shows */
```

### Shadows - Soft & Layered
```css
/* Card shadow - subtle depth */
box-shadow: 
  0 2px 8px rgba(0, 0, 0, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.02);

/* Hover shadow - lift effect */
box-shadow:
  0 8px 24px rgba(0, 0, 0, 0.2),
  0 0 0 1px rgba(74, 155, 159, 0.1),
  inset 0 1px 0 rgba(255, 255, 255, 0.03);
```

---

## 🎭 Glassmorphism Effects

### Light Glass
```css
.glass {
  background: rgba(26, 35, 50, 0.6);
  backdrop-filter: blur(16px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### Strong Glass
```css
.glass-strong {
  background: rgba(26, 35, 50, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

**Usage:**
```jsx
<div className="glass p-6">
  {/* Navigation bar */}
</div>

<div className="glass-strong p-8">
  {/* Modal content */}
</div>
```

---

## 🎬 Animations - Spring Physics

### Cubic Bezier Easing
```css
/* Smooth & natural */
cubic-bezier(0.16, 1, 0.3, 1)  /* Enter animations */
cubic-bezier(0.4, 0, 0.2, 1)   /* Exit animations */
cubic-bezier(0.34, 1.56, 0.64, 1)  /* Bouncy hover */
```

### Keyframe Animations
```css
/* Fade in */
@keyframes fadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

/* Slide up with momentum */
@keyframes slideUp {
  0%   { opacity: 0; transform: translateY(24px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Scale with blur */
@keyframes scaleIn {
  0%   { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

/* Gentle float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}
```

**Usage:**
```jsx
<div className="animate-fade-in">Content</div>
<div className="animate-slide-up delay-100">Content</div>
<div className="animate-float">Floating icon</div>
```

---

## 🔘 Button Micro-interactions

### Primary Button
```jsx
<button className="btn-primary">
  Book Tickets
</button>
```

**Features:**
- Gradient background
- Hover lift effect
- Accent border glow
- Active press feedback
- Smooth transitions (300ms)

### Ghost Button
```jsx
<button className="btn-ghost">
  Learn More
</button>
```

**Features:**
- Transparent by default
- Subtle background on hover
- Text color shift
- No borders

---

## 📝 Form Inputs - Clean & Focused

```jsx
<input 
  type="text"
  className="input-field"
  placeholder="Search concerts..."
/>
```

**States:**
- **Default**: Barely visible border, subtle bg
- **Hover**: Border opacity increases
- **Focus**: Accent border + shadow glow
- **Error**: Red accent with validation message

**Focus Shadow:**
```css
box-shadow: 
  0 0 0 3px rgba(74, 155, 159, 0.08),
  inset 0 1px 2px rgba(0, 0, 0, 0.1);
```

---

## 🎫 Ticket Cards - Refined

### Boarding Pass Card
```jsx
<div className="boarding-pass-card p-6">
  {/* Concert info */}
</div>
```

**Features:**
- Ultra-subtle perforated edges
- Gradient background (135deg)
- Hover: Lift + accent border glow
- Inset highlight on top edge
- Smooth 500ms transition

### Magnetic Hover Effect
```jsx
<div className="boarding-pass-card magnetic-hover">
  {/* Card with spring animation on hover */}
</div>
```

**Hover behavior:**
```css
transform: translateY(-4px) scale(1.01);
transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## 🏷️ Badges - Minimal Labels

### Accent Badge
```jsx
<span className="badge-jade">FEATURED</span>
<span className="badge-gold">VIP</span>
```

**Design:**
- Transparent bg with accent tint
- Matching border
- Small font size (0.75rem)
- Uppercase tracking

---

## 📐 Typography Scale

### Page Title
```jsx
<h1 className="page-title">
  Premium Concerts
</h1>
```
- Font: DM Sans Bold
- Size: `clamp(2rem, 5vw, 3.5rem)`
- Tracking: -0.02em (tight)
- Line-height: 1.1

### Section Heading
```jsx
<h2 className="section-heading">
  Upcoming Events
</h2>
```
- Font: DM Sans Bold
- Size: `clamp(1.5rem, 3vw, 2.25rem)`
- Tracking: -0.01em

### Subheading
```jsx
<p className="section-subheading">
  Browse all live performances
</p>
```
- Font: Inter Regular
- Size: `clamp(0.875rem, 1.5vw, 1rem)`
- Color: text-muted
- Line-height: 1.6

---

## 🎨 Gradient Text (Optional)

```jsx
<h1 className="text-gradient-primary">
  Premium Experience
</h1>

<span className="text-gradient-accent">
  Book Now
</span>
```

---

## 🧩 Component Composition Examples

### Concert Card
```jsx
<div className="boarding-pass-card magnetic-hover p-6 animate-slide-up">
  <div className="flex items-center justify-between mb-4">
    <span className="badge-jade">JAKARTA</span>
    <div className="barcode-accent">
      <span style={{ height: 8 }}></span>
      <span style={{ height: 12 }}></span>
      <span style={{ height: 10 }}></span>
    </div>
  </div>
  
  <h3 className="font-display font-bold text-xl mb-2">
    Crayon Case Live
  </h3>
  
  <p className="text-text-muted text-sm">
    GBK Stadium • Dec 5, 2026
  </p>
</div>
```

### Hero Section
```jsx
<section className="relative py-32">
  {/* Gradient overlay */}
  <div className="gradient-overlay-subtle" />
  
  {/* Content */}
  <div className="container-premium relative z-10">
    <h1 className="page-title animate-fade-in">
      Premium Concert Tickets
    </h1>
    
    <p className="section-subheading animate-slide-up delay-100">
      Experience live music like never before
    </p>
    
    <button className="btn-primary mt-8 animate-scale-in delay-200">
      Browse Concerts
    </button>
  </div>
</section>
```

### Navigation Bar
```jsx
<nav className="navbar-floating">
  <div className="container-premium py-4">
    <div className="flex items-center justify-between">
      <h1 className="font-display font-bold text-xl">StageCase</h1>
      
      <div className="flex gap-6">
        <a href="#" className="btn-ghost">Concerts</a>
        <a href="#" className="btn-ghost">My Tickets</a>
        <button className="btn-primary">Sign In</button>
      </div>
    </div>
  </div>
</nav>
```

---

## ⚡ Performance Tips

1. **Use `will-change` sparingly**
   ```css
   .boarding-pass-card:hover {
     will-change: transform;
   }
   ```

2. **Prefer `transform` over `top/left`**
   ```css
   /* ✅ Good */
   transform: translateY(-2px);
   
   /* ❌ Avoid */
   top: -2px;
   ```

3. **Use `backdrop-filter` conditionally**
   - Only on glassmorphism elements
   - Not supported in Firefox (graceful degradation)

4. **Optimize animations**
   - Use `prefers-reduced-motion` media query
   - Shorter durations on mobile

---

## 🎯 Key Differences from Previous Design

| Aspect | Before | After (Quiet Luxury) |
|--------|--------|---------------------|
| **Borders** | `rgba(255,255,255,0.15)` | `rgba(255,255,255,0.05)` |
| **Shadows** | Heavy, strong | Soft, layered |
| **Hover** | Simple color change | Lift + glow + scale |
| **Animations** | Basic ease | Spring physics (cubic-bezier) |
| **Glass Effect** | None | Blur + transparency |
| **Typography** | Standard | Fluid clamp() sizing |
| **Accent Usage** | Prominent | Subtle, revealed on interaction |

---

## 🚀 Implementation Checklist

- [x] Updated `index.css` with refined utilities
- [x] Added glassmorphism classes
- [x] Implemented spring physics animations
- [x] Updated button micro-interactions
- [x] Refined form inputs
- [x] Added magnetic hover effects
- [x] Updated shadow system
- [x] Implemented gradient overlays
- [x] Updated typography scale
- [x] Added text gradient utilities

---

## 📱 Responsive Behavior

All components use `clamp()` for fluid typography and spacing:

```css
/* Automatically scales between mobile and desktop */
font-size: clamp(1rem, 2.5vw, 1.5rem);
padding: clamp(1rem, 3vw, 2rem);
gap: clamp(0.5rem, 2vw, 1.5rem);
```

---

## 🎨 Dark Mode Only

This design system is **dark mode only** - optimized for low-light viewing and premium feel. No light mode variant needed.

---

*Last Updated: 2026-07-27*
*Design System: Quiet Luxury v1.0*
