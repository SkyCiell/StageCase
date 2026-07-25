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
        // User Custom Palette
        background:     '#728EB7',        // Slate Blue
        'bg-secondary': '#5E7BA4',        // Deep Slate Blue
        surface:        '#8DA7CC',        // Soft Steel Blue Surface
        'surface-light':'#8DA7CC',        // Soft Steel Blue Light Surface
        'surface-dark': '#343C4E',        // Primary Dark Charcoal Navy
        primary:        '#343C4E',        // Deep Navy Slate
        secondary:      '#2A629C',        // Royal Steel Blue
        'text-primary': '#F5F3F5',        // Soft Off-White
        'text-muted':   '#D3CCD0',        // Silver Muted Gray
        'text-secondary':'#D3CCD0',

        // Legacy Aliases
        jade: {
          DEFAULT: '#2A629C',         // Mapped to Secondary Blue
          dark:    '#343C4E',         // Mapped to Primary Navy
          light:   '#8DA7CC',
          subtle:  'rgba(42, 98, 156, 0.15)',
        },

        gold: {
          DEFAULT: '#2A629C',
          dark:    '#343C4E',
          light:   '#8DA7CC',
          subtle:  'rgba(42, 98, 156, 0.15)',
        },

        rust: {
          DEFAULT: '#2A629C',
          dark:    '#343C4E',
          light:   '#8DA7CC',
        },

        'dark-matte': '#343C4E',
        ivory: {
          DEFAULT: '#F5F3F5',
          dark:    '#D3CCD0',
          light:   '#FFFFFF',
        },

        // Borders
        border:          'rgba(245, 243, 245, 0.15)',
        'border-hover':  'rgba(245, 243, 245, 0.3)',
        'border-hover':    'rgba(255, 255, 255, 0.16)',
        'border-jade':     'rgba(45, 111, 115, 0.4)',
        'border-gold':     'rgba(184, 155, 94, 0.4)',

        // Status
        success: '#4CAF7A',
        warning: '#E7B567',
        error:   '#D65A5A',
      },

      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },

      borderRadius: {
        'none':    '0',
        'sm':      '6px',
        'DEFAULT': '10px',
        'md':      '12px',
        'lg':      '16px',
        'xl':      '20px',
        '2xl':     '24px',
        '3xl':     '32px',
        'full':    '9999px',
      },

      boxShadow: {
        'card':       '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 20px rgba(45, 111, 115, 0.15)',
        'jade-glow':  '0 0 25px rgba(45, 111, 115, 0.25)',
        'gold-glow':  '0 0 25px rgba(184, 155, 94, 0.25)',
        'floating':   '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'dropdown':   '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },

      animation: {
        'fade-in':      'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.7' },
          '50%':      { opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
}
