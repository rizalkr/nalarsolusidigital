import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1E2B4B',
        'brand-accent': '#1AA99E',
        'brand-accent-strong': '#087F79',
        'accent-surface': '#E7F7F5',
        brand: {
          primary: '#1E2B4B',
          accent: '#1AA99E',
          'accent-strong': '#087F79',
          'accent-surface': '#E7F7F5',
        },
        background: '#FFFFFF',
        surface: {
          DEFAULT: '#F7F8FA',
          white: '#FFFFFF',
        },
        'text-primary': '#202938',
        'text-secondary': '#596575',
        border: '#DCE3EB',
        'border-subtle': '#DCE3EB',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
