import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

// Relative base + HashRouter → GitHub Pages project sites work
// without a 404.html rewrite (URLs look like /ai-repo-finder/#/coding-tools).
export default defineConfig({
  base: '/ai-repo-finder/',
  plugins: [tailwindcss(), react(), babel({ presets: [reactCompilerPreset()] })],
});
