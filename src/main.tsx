import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SiteContentContext } from "./SiteContentContext";
import { isEditorPreview } from "./data/archive";
import type { SiteContent } from "./data/siteContent";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);

if (isEditorPreview()) {
  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "site-preview") return;
    const content: SiteContent = event.data.content;
    root.render(<SiteContentContext.Provider value={content}><App /></SiteContentContext.Provider>);
  });
  window.parent.postMessage({
    type: "site-preview-ready",
    file: window.location.pathname.split("/").pop(),
  }, window.location.origin);
} else {
  root.render(<StrictMode><App /></StrictMode>);
}
