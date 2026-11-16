import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Pages supplies its configured base path. Custom domains use `/`.
  base: process.env.BASE_PATH || "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        home: "index.html",
        books: "books.html",
        editedVolumes: "edited-volumes.html",
        articles: "articles.html",
        blogs: "blogs.html",
      },
    },
  },
});
