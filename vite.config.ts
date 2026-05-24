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
const SRC_PATH = fileURLToPath(new URL('./src', import.meta.url))

const REACT_PACKAGES = new Set(['react', 'react-dom', 'react-router-dom', 'react-router'])
const ANTD_PACKAGE_PREFIXES = ['antd', '@ant-design/', 'rc-', '@rc-component/']

function getPackageName(id: string) {
  const normalizedId = id.replace(/\\/g, '/')
  const nodeModulesIndex = normalizedId.lastIndexOf('/node_modules/')

  if (nodeModulesIndex === -1) {
    return null
  }

  const packagePath = normalizedId.slice(nodeModulesIndex + '/node_modules/'.length)
  const [scopeOrName, name] = packagePath.split('/')

  return scopeOrName?.startsWith('@') ? `${scopeOrName}/${name}` : scopeOrName
}

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
      {
        find: '@',
        replacement: SRC_PATH,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const packageName = getPackageName(id)

          if (!packageName) {
            return undefined
          }

          if (REACT_PACKAGES.has(packageName)) {
            return 'react-vendor'
          }

          if (ANTD_PACKAGE_PREFIXES.some((packagePrefix) => packageName.startsWith(packagePrefix))) {
            return 'antd-vendor'
          }

          return 'vendor'
        },
      },
    },
  },
}))
