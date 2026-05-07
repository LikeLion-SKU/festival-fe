import react from '@vitejs/plugin-react-swc';
import process from 'node:process';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PRIVATE_API_BASE_URL = env.VITE_APP_API_URL;

  return {
    plugins: [
      react(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/*.png'],
        manifest: {
          name: '2026 대동제',
          short_name: '2026 대동제',
          description: '축제 정보를 확인하세요',
          theme_color: '#6366f1',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,woff2}'],
          globIgnores: ['**/notosans*/**', '**/NotoSans*/**'],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /\/fonts\//i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'local-fonts-cache',
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
            {
              urlPattern: /\/assets\/.*\.(png|svg|jpg|jpeg|webp)/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'assets-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
    server: {
      proxy: {
        '/api': {
          target: PRIVATE_API_BASE_URL,
          changeOrigin: true,
          //rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
  };
});
