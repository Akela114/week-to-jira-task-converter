import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), nodePolyfills()],
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      proxy: {
        "/jira-api": {
          target: env.VITE_JIRA_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/jira-api/, ""),
        },
      },
    },
    preview: {
      proxy: {
        "/jira-api": {
          target: env.VITE_JIRA_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/jira-api/, ""),
        },
      },
    },
  }
})
