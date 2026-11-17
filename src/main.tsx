import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SiteContentContext } from "./SiteContentContext";
import { isEditorPreview } from "./data/archive";
import { defaultSiteContent, type SiteContent } from "./data/siteContent";
import { withPublishedContent, type PublishedContent } from "./data/publishedContent";
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
  function showSite(content: SiteContent) {
    root.render(<StrictMode><SiteContentContext.Provider value={content}><App /></SiteContentContext.Provider></StrictMode>);
  }

  showSite(defaultSiteContent);
  const publishedContentUrl = "https://wenfang-tang-editor-trial.harveyliu2333.chatgpt.site/content.json";
  void fetch(publishedContentUrl, {
    cache: "no-store",
    credentials: "omit",
    signal: AbortSignal.timeout(5000),
  }).then(async (response) => {
    if (!response.ok) return;
    const { published } = await response.json() as { published?: PublishedContent };
    if (published && Object.keys(published).length) showSite(withPublishedContent(defaultSiteContent, published));
  }).catch(() => {
    // The bundled content remains available while the editor service is unreachable.
  });
}
