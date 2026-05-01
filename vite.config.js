import react from '@vitejs/plugin-react-swc';
import process from 'node:process';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const PRIVATE_API_BASE_URL = env.VITE_APP_API_URL;

  return {
    plugins: [react(), svgr()],
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
