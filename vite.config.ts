import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // 生产构建优化
  build: {
    target: "es2020",
    minify: "esbuild",
    sourcemap: false,
    // 优化 chunk 分割
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库单独打包
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // 将 Ant Design 单独打包
          "antd-vendor": ["antd", "@ant-design/icons"],
        },
      },
    },
  },

  // 优化依赖预构建
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "antd"],
  },
}));
