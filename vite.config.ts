import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

const ANTD_ICON_CONTEXT_PATH = fileURLToPath(
  new URL('./src/assets/icons/antd-icon-context.ts', import.meta.url),
)
const ANTD_ICON_STUB_PATH = fileURLToPath(
  new URL('./src/assets/icons/antd-icon-placeholder.tsx', import.meta.url),
)

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: [
      {
        find: '@ant-design/icons/es/components/Context',
        replacement: ANTD_ICON_CONTEXT_PATH,
      },
      {
        find: /^@ant-design\/icons\/es\/icons\/.+$/,
        replacement: ANTD_ICON_STUB_PATH,
      },
      {
        find: /^@ant-design\/icons\/.+$/,
        replacement: ANTD_ICON_STUB_PATH,
      },
    ],
  },
  plugins: [
    svgr(),
    react(),
    mode === 'analyze' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
      }),
  ],
}))
