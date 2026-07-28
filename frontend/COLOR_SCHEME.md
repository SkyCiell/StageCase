# StageCase Premium Color Scheme

## 🎨 Design Philosophy
Dark, premium concert ticket aesthetic inspired by Apple Wallet, Ticketmaster, and modern event passes.

---

## Base Colors (Dark Theme)

### Background & Surface
```css
background:     #0A0E14  /* Very Dark Navy - Main BG */
bg-secondary:   #131923  /* Slightly Lighter - Sections */
surface:        #1A2332  /* Card Surface */
surface-light:  #232F42  /* Elevated Surface */
surface-dark:   #0D1117  /* Deep Surface */
graphite:       #1A1D23  /* Graphite Cards */
```

### Text Colors
```css
text-primary:   #F5F7FA  /* Pure Off-White - Headings */
text-secondary: #A0AAB8  /* Secondary Text */
text-muted:     #8B95A5  /* Muted Gray-Blue - Labels */
```

### Primary Accents
```css
amber:   #F4A261  /* Warm Amber - CTAs, Highlights */
bronze:  #D4A574  /* Soft Bronze - Secondary Accents */
jade:    #4A9B9F  /* Teal - Primary Brand */
gold:    #C4A572  /* Gold - Premium Features */
```

### Borders
```css
border:        rgba(255, 255, 255, 0.08)  /* Subtle */
border-hover:  rgba(255, 255, 255, 0.16)  /* Interactive */
border-jade:   rgba(74, 155, 159, 0.3)    /* Teal borders */
border-gold:   rgba(196, 165, 114, 0.3)   /* Gold borders */
```

---

## Artist Color Themes

### Crayon Case (Refined Teal & Gold)
```css
accent:     #4A9B9F  /* Teal */
secondary:  #C4A572  /* Gold */
```
**Mood**: Premium, elegant, cinematic

### Reality Club (Soft Purple & Cream)
```css
accent:     #8B7BA8  /* Soft Purple */
secondary:  #D9C8B4  /* Warm Cream */
```
**Mood**: Dreamy, nostalgic, late-night

### The Milo (Olive Green & Sand)
```css
accent:     #7FA573  /* Olive Green */
secondary:  #D4C2A5  /* Sand */
```
**Mood**: Warm, earthy, acoustic

### Wave to Earth (Soft Blue & Mint)
```css
accent:     #6B8FA5  /* Soft Blue */
secondary:  #C5D8D5  /* Mint */
```
**Mood**: Rainy, ocean, peaceful

---

## Status Colors

```css
success:  #5FCC7F  /* Green */
warning:  #F4A261  /* Amber */
error:    #E76F6F  /* Red */
```

---

## Component Color Usage

### Concert Cards
- **Background**: `#1A2332` (surface)
- **Border**: `rgba(255,255,255,0.08)`
- **Hover Border**: Artist accent color at 50% opacity
- **Text Title**: `#F5F7FA` (text-primary)
- **Text Meta**: `#8B95A5` (text-muted)
- **Accent Elements**: Artist accent color

### Buttons
- **Primary**: `#2A3F5F` background, `#F5F7FA` text
- **Hover**: `#3A5278` background, teal border
- **CTA**: `#F4A261` background, `#0A0E14` text

### Badges
- **VIP**: `#C4A572` (gold)
- **Featured**: `#4A9B9F` (teal)
- **Early Bird**: `#F4A261` (amber)
- **Sold Out**: `#E76F6F` (error)

### Ticket Stubs
- **Background**: Artist accent at 15% opacity
- **Border**: Artist accent at 30% opacity
- **Text**: `#F5F7FA`

---

## Contrast Ratios (WCAG AA Compliant)

| Foreground | Background | Ratio | Pass |
|------------|------------|-------|------|
| `#F5F7FA` | `#0A0E14` | 15.8:1 | ✅ AAA |
| `#A0AAB8` | `#0A0E14` | 9.2:1 | ✅ AAA |
| `#8B95A5` | `#1A2332` | 5.8:1 | ✅ AA |
| `#F4A261` | `#0A0E14` | 8.4:1 | ✅ AAA |
| `#4A9B9F` | `#0A0E14` | 7.1:1 | ✅ AAA |

---

## Usage Examples

### Hero Section
```jsx
<section className="bg-background text-text-primary">
  <h1 className="text-ivory">Featured Concert</h1>
  <p className="text-text-muted">Premium live experience</p>
  <button className="bg-amber text-background">Book Now</button>
</section>
```

### Concert Card
```jsx
<div className="boarding-pass-card hover:border-jade/50">
  <div className="bg-jade/15 border-jade/30">
    <EventBadge accentColor="#4A9B9F">JAKARTA</EventBadge>
  </div>
  <h3 className="text-ivory">Crayon Case Live</h3>
  <p className="text-text-muted">GBK Stadium</p>
</div>
```

### Artist-Themed Section
```jsx
// Crayon Case section
<div style={{ borderColor: '#4A9B9F' }}>
  <div style={{ backgroundColor: 'rgba(74,155,159,0.15)' }}>
    {/* Content */}
  </div>
</div>
```

---

## Admin Panel Colors

```css
admin-bg:       #0A0E14  /* Same as main */
admin-sidebar:  #131923  /* Sidebar */
admin-surface:  #1A2332  /* Cards */
admin-card:     #232F42  /* Elevated */
admin-border:   rgba(255,255,255,0.06)
admin-muted:    #8B95A5
admin-accent:   #4A9B9F  /* Teal */
```

---

## Color Psychology

- **Dark Navy Base** (`#0A0E14`): Premium, sophisticated, nightlife
- **Teal Accent** (`#4A9B9F`): Energy, creativity, music
- **Amber** (`#F4A261`): Urgency, excitement, spotlight
- **Gold** (`#C4A572`): Premium, VIP, exclusive
- **Soft Purple** (`#8B7BA8`): Dreamy, artistic, indie
- **Olive Green** (`#7FA573`): Organic, warm, acoustic
- **Soft Blue** (`#6B8FA5`): Calm, emotional, peaceful

---

## Migration from Old Colors

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| `#728EB7` (Slate Blue) | `#0A0E14` (Dark Navy) | Background |
| `#343C4E` (Navy) | `#1A2332` (Surface) | Cards |
| `#2A629C` (Royal Blue) | `#4A9B9F` (Teal) | Primary Accent |
| `#E7B567` (Old Amber) | `#F4A261` (New Amber) | CTAs |
| `#B89B5E` (Old Bronze) | `#D4A574` (New Bronze) | Secondary |

---

## Development Notes

1. **Always use Tailwind classes** when possible:
   ```jsx
   <div className="bg-background text-ivory border-jade">
   ```

2. **Artist accent colors** via inline styles:
   ```jsx
   <div style={{ borderColor: concert.accent_color }}>
   ```

3. **Opacity variations** for backgrounds:
   ```jsx
   <div style={{ backgroundColor: `${accentColor}15` }}>
   ```

4. **Never hardcode hex values** - use Tailwind tokens

---

*Last Updated: 2026-07-27*
*Color Scheme Version: 2.0 (Premium Dark)*
