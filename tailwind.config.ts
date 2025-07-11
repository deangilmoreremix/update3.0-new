import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        '3xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff",
          100: "#dbeafe", 
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        glass: {
          50: "rgba(255, 255, 255, 0.02)",
          100: "rgba(255, 255, 255, 0.05)",
          200: "rgba(255, 255, 255, 0.10)",
          300: "rgba(255, 255, 255, 0.15)",
          400: "rgba(255, 255, 255, 0.20)",
          500: "rgba(255, 255, 255, 0.25)",
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
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(-10px) scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "bounce-gentle": {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)",
          },
          "40%": {
            transform: "translateY(-4px)",
          },
          "60%": {
            transform: "translateY(-2px)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            "box-shadow": "0 0 20px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            "box-shadow": "0 0 30px rgba(59, 130, 246, 0.5)",
          },
        },
        "badge-bounce": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.1)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
          },
        },
        "slide-in": {
          from: {
            opacity: "0",
            transform: "translateX(-10px)",
          },
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "shimmer": {
          "0%": {
            "background-position": "-200px 0",
          },
          "100%": {
            "background-position": "calc(200px + 100%) 0",
          },
        },
        "glow": {
          "0%, 100%": {
            "box-shadow": "0 0 20px rgba(59, 130, 246, 0.3)",
          },
          "50%": {
            "box-shadow": "0 0 40px rgba(59, 130, 246, 0.6)",
          },
        },
        "float-up": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(20px)",
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)",
          },
        },
        "scale-up": {
          "0%": {
            "opacity": "0",
            "transform": "scale(0.8)",
          },
          "100%": {
            "opacity": "1",
            "transform": "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "bounce-gentle": "bounce-gentle 2s infinite",
        "glow-pulse": "glow-pulse 2s infinite",
        "badge-bounce": "badge-bounce 0.5s ease-in-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
        "glow": "glow 2s infinite",
        "float-up": "float-up 0.6s ease-out",
        "scale-up": "scale-up 0.4s ease-out",
      },
      boxShadow: {
        "3xl": "0 35px 60px -12px rgba(0, 0, 0, 0.25)",
        "glow": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-purple": "0 0 20px rgba(147, 51, 234, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
