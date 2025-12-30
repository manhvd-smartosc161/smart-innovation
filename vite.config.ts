import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      // Bundle analyzer - generates stats.html
      visualizer({
        filename: './dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/tokens.scss" as *; @use "@/styles/mixins.scss" as *;`,
        },
      },
    },
    server: {
      port: parseInt(env.VITE_PORT || '5174'),
      cors: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Ant Design chunk (~500KB)
            'antd-vendor': ['antd', '@ant-design/icons'],

            // React Query chunk
            'react-query-vendor': [
              '@tanstack/react-query',
              '@tanstack/react-query-devtools',
            ],

            // Tiptap Editor chunk
            'editor-vendor': [
              '@tiptap/react',
              '@tiptap/starter-kit',
              '@tiptap/extension-placeholder',
            ],

            // React core libraries
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],

            // State management
            'zustand-vendor': ['zustand'],
          },
        },
      },
      // Optimize minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },
      // Increase chunk size warning limit after chunking
      chunkSizeWarningLimit: 600,
      // Disable source maps in production
      sourcemap: mode !== 'production',
    },
  };
});
