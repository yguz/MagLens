export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Match all files in pages directory and subdirectories
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Match all files in components directory and subdirectories
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Match all files in the app directory and subdirectories
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
