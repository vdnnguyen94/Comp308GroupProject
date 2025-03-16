import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'vitalSignApp',
      filename: 'remoteEntry.js',
      exposes: {
        './VitalSigns': './src/VitalSigns',
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});