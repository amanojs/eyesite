import { defineConfig, loadEnv } from 'vite';

const { resolve } = require('path');

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          profile: resolve(__dirname, 'profile.html')
        }
      }
    }
  });
};
