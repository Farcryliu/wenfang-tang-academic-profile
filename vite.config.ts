import { cpSync, mkdirSync } from "node:fs";
import { Readable } from "node:stream";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createDemoEditor } from "./server/demo.ts";

function demoApi(): Plugin {
  const handle = createDemoEditor();
  return {
    name: "site-editor-local-demo",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/editor/")) return next();
        try {
          const headers = new Headers();
          Object.entries(req.headers).forEach(([name, value]) => {
            if (value) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
          });
          const method = req.method ?? "GET";
          const request = new Request(new URL(req.url, "http://" + req.headers.host), {
            method,
            headers,
            body: method === "POST" ? Readable.toWeb(req) : undefined,
            duplex: "half",
          } as RequestInit);
          const response = await handle(request);
          res.writeHead(response.status, Object.fromEntries(response.headers));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "本地演示暂时无法处理请求。" }));
        }
      });
    },
  };
}

function editorAssets(): Plugin {
  return {
    name: "site-editor-preview-assets",
    closeBundle() {
      mkdirSync("dist-editor/assets", { recursive: true });
      cpSync("public/assets", "dist-editor/assets", { recursive: true });
      cpSync("public/favicon.png", "dist-editor/favicon.png");
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const editor = mode === "editor";
  return {
    plugins: [react(), editor && command === "build" && editorAssets(), mode === "editor-demo" && command === "serve" && demoApi()],
    // Pages supplies its configured base path. Custom domains and the editor use /.
    base: editor || mode === "editor-demo" ? "/" : process.env.BASE_PATH || "/",
    publicDir: editor ? false : "public",
    build: {
      outDir: editor ? "dist-editor" : "dist",
      emptyOutDir: true,
      rolldownOptions: {
        input: {
          home: "index.html",
          books: "books.html",
          editedVolumes: "edited-volumes.html",
          articles: "articles.html",
          blogs: "blogs.html",
          ...(editor ? { editor: "editor.html" } : {}),
        },
      },
    },
  };
});
