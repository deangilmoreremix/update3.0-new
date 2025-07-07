import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'modern-sm': '6px',
        'modern-md': '8px',
        'modern-lg': '12px',
        'modern-xl': '16px',
        'modern-2xl': '20px',
      },
      spacing: {
        'modern-xs': '0.25rem',
        'modern-sm': '0.5rem',
        'modern-md': '1rem',
        'modern-lg': '1.5rem',
        'modern-xl': '2rem',
        'modern-2xl': '3rem',
      },
      backdropBlur: {
        'modern': '16px',
        'heavy': '20px',
      },
      animation: {
        'pulse-modern': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideInUp 0.5s ease-out',
        'fade-scale': 'fadeInScale 0.3s ease-out',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Modern theme colors
        'dark-bg': 'var(--color-dark-bg)',
        'dark-surface': 'var(--color-dark-surface)',
        'dark-surface-elevated': 'var(--color-dark-surface-elevated)',
        'dark-border': 'var(--color-dark-border)',
        'dark-text-primary': 'var(--color-dark-text-primary)',
        'dark-text-secondary': 'var(--color-dark-text-secondary)',
        'dark-text-muted': 'var(--color-dark-text-muted)',
        'status-success': 'var(--status-success)',
        'status-warning': 'var(--status-warning)',
        'status-error': 'var(--status-error)',
        'status-info': 'var(--status-info)',
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;