import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD

// https://vitejs.dev/config/
export default defineConfig({
=======
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
        },
      },
    },
  },
});
=======
}));
>>>>>>> 794405e8a914d62f126e1039bf32d31ac0ace405
