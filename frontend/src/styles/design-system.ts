/**
 * Design System Configuration
 * Base unit: 8px (0.5rem in Tailwind)
 */

export const spacing = {
  // Vertical rhythm (8px base grid)
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
};

export const typography = {
  // Font sizes with consistent scale
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px - base body text
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px - section titles
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
  "6xl": "3.75rem", // 60px
  "7xl": "4.5rem", // 72px
};

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

export const colors = {
  // Neutral palette (off-white backgrounds, muted accents)
  background: {
    primary: "rgb(17, 24, 39)", // gray-900
    secondary: "rgb(31, 41, 55)", // gray-800
    tertiary: "rgb(55, 65, 81)", // gray-700
    elevated: "rgb(243, 244, 246)", // gray-100 (light mode)
  },
  text: {
    primary: "rgb(255, 255, 255)", // white
    secondary: "rgb(156, 163, 175)", // gray-400
    muted: "rgb(107, 114, 128)", // gray-500
    inverse: "rgb(17, 24, 39)", // gray-900
  },
  accent: {
    primary: "rgb(99, 102, 241)", // indigo-500
    secondary: "rgb(168, 85, 247)", // purple-500
    success: "rgb(34, 197, 94)", // emerald-500
    warning: "rgb(251, 146, 60)", // amber-400
    error: "rgb(239, 68, 68)", // rose-500
  },
  border: {
    default: "rgba(255, 255, 255, 0.1)",
    hover: "rgba(255, 255, 255, 0.2)",
    focus: "rgba(99, 102, 241, 0.5)",
  },
};

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  glow: "0 0 20px rgba(99, 102, 241, 0.25)",
  "glow-lg": "0 0 40px rgba(99, 102, 241, 0.3)",
};

export const borderRadius = {
  sm: "0.375rem", // 6px
  md: "0.5rem", // 8px
  lg: "0.75rem", // 12px
  xl: "1rem", // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",
};

// Responsive breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Common class combinations for consistency
export const classes = {
  card: "bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-200 hover:border-white/20",
  input:
    "w-full px-4 py-4 bg-transparent text-white placeholder-gray-500 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200",
  button: {
    primary:
      "inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40",
    secondary:
      "inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200",
  },
  section: "py-16 lg:py-24",
  container: "max-w-7xl mx-auto px-6 sm:px-8 lg:px-12",
};
