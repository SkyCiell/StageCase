/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── StageCase Design System Base Palette ──
        background:      '#0D1117',        // Background Primary
        'bg-primary':    '#0D1117',        // Background Primary
        'bg-secondary':  '#161B22',        // Background Secondary
        card:            '#1C2128',        // Card
        surface:         '#22272E',        // Surface
        primary:         '#2D6F73',        // Jade Primary
        accent:          '#B89B5E',        // Gold Accent
        'text-primary':  '#F3F4F6',        // Text Primary
        'text-secondary':'#B6BDC8',        // Text Secondary
        muted:           '#7D8590',        // Muted
        border:          '#30363D',        // Border
        
        // Status Colors
        success:         '#3FB950',
        warning:         '#D29922',
        danger:          '#F85149',
        error:           '#F85149',

        // Brand Aliases
        jade: {
          DEFAULT: '#2D6F73',
          hover:   '#357E82',
          subtle:  'rgba(45, 111, 115, 0.15)',
        },
        gold: {
          DEFAULT: '#B89B5E',
          hover:   '#C6A96C',
          subtle:  'rgba(184, 155, 94, 0.15)',
        },

        // ── Band Specific Colors (Banners, Badges, Tickets, Accent Cards) ──
        'crayon-case': {
          DEFAULT: '#2D6F73',
          accent:  '#D6B46B',
        },
        'reality-club': {
          DEFAULT: '#5D4E89',
          accent:  '#D8C5A2',
        },
        'the-milo': {
          DEFAULT: '#6E8B6B',
          accent:  '#C9A46A',
        },
        'wave-to-earth': {
          DEFAULT: '#4F6D8C',
          accent:  '#BFCFD7',
        },

        // Admin Panel Aliases
        'admin-bg':      '#0D1117',
        'admin-sidebar': '#161B22',
        'admin-surface': '#22272E',
        'admin-card':    '#1C2128',
        'admin-border':  '#30363D',
        'admin-muted':   '#7D8590',
        'admin-accent':  '#2D6F73',
      },

      fontFamily: {
        sans:    ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },

      borderRadius: {
        'none':    '0',
        'sm':      '6px',
        'DEFAULT': '10px',
        'md':      '12px',
        'card':    '18px',
        'modal':   '20px',
        'full':    '9999px',
      },

      boxShadow: {
        'card':       '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 0 1px #B89B5E',
        'modal':      '0 20px 50px rgba(0, 0, 0, 0.6)',
        'dropdown':   '0 12px 40px rgba(0, 0, 0, 0.5)',
      },

      transitionDuration: {
        '250': '250ms',
      },

      animation: {
        'fade-in':    'fadeIn 0.25s ease-out forwards',
        'slide-up':   'slideUp 0.25s ease-out forwards',
        'slide-down': 'slideDown 0.25s ease-out forwards',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
