/**
 * Color palette for the Toolbox app
 * Based on the existing color scheme with organized variations
 */

export const colors = {
  // Primary colors
  primary: {
    50: "#e6f3f7",
    100: "#b3d9e5",
    200: "#80bfd3",
    300: "#4da5c1",
    400: "#2991b1",
    500: "#016992", // Main primary color
    600: "#015d82",
    700: "#015072",
    800: "#014462",
    900: "#013852",
  },

  // Secondary/Gray colors
  gray: {
    50: "#f7fafc",
    100: "#edf2f7",
    200: "#e2e8f0",
    300: "#cbd5e0",
    400: "#a0aec0",
    500: "#718096", // Main secondary color
    600: "#4a5568",
    700: "#2d3748", // Main text color
    800: "#1a202c",
    900: "#171923",
  },

  // Danger/Error colors
  danger: {
    50: "#fef5f5",
    100: "#fed7d7",
    200: "#feb2b2",
    300: "#fc8181",
    400: "#f56565",
    500: "#e53e3e",
    600: "#c53030",
    700: "#920601", // Main danger color (existing)
    800: "#822727",
    900: "#63171b",
  },

  // Success colors
  success: {
    50: "#f0fff4",
    100: "#c6f6d5",
    200: "#9ae6b4",
    300: "#68d391",
    400: "#48bb78",
    500: "#38a169",
    600: "#2f855a",
    700: "#276749",
    800: "#22543d",
    900: "#1c4532",
  },

  // Warning colors
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Semantic colors (easier to use)
  background: "#f5f5f5",
  surface: "#ffffff",
  text: {
    primary: "#2d3748",
    secondary: "#718096",
    disabled: "#a0aec0",
    inverse: "#ffffff",
  },
  border: {
    light: "#e2e8f0",
    default: "#cbd5e0",
    dark: "#a0aec0",
  },
  shadow: "rgba(0, 0, 0, 0.1)",
} as const;
