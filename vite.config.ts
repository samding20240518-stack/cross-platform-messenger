import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages 部署配置
  // 如果使用自定义域名，请注释掉下面这行
  base: '/cross-platform-messenger/',
  
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
