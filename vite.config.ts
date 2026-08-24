import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const proxiedApiPaths = ['/auth', '/transfers', '/requests', '/hospitals', '/users', '/admin', '/api']

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      proxy: Object.fromEntries(
        proxiedApiPaths.map((path) => [
          path,
          {
            target: env.VITE_API_BASE_URL,
            changeOrigin: true,
          },
        ]),
      ),
    },
  }
})
