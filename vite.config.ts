import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Local development stays at `/`. The Pages workflow supplies the
  // repository subpath so built assets also work on project pages.
  base: process.env.BASE_PATH || "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
