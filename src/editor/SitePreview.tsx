import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "../data/siteContent";
import type { PreviewTarget } from "./types";

const pages = {
  home: { label: "首页", file: "index.html" },
  books: { label: "专著", file: "books.html" },
  editedVolumes: { label: "编著", file: "edited-volumes.html" },
  articles: { label: "论文", file: "articles.html" },
  blogs: { label: "评论文章", file: "blogs.html" },
};

type View = keyof typeof pages;
export type PreviewDevice = "desktop" | "phone";
type Props = {
  content: SiteContent;
  currentContent: SiteContent;
  draft: boolean;
  target: PreviewTarget | null;
  revisionLabel: string;
  device: PreviewDevice;
  onDeviceChange: (device: PreviewDevice) => void;
};

export function SitePreview({ content, currentContent, draft, target, revisionLabel, device, onDeviceChange }: Props) {
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(target?.category ?? "home");
  const [navigation, setNavigation] = useState({ page: target?.category ?? "home" as View, sequence: 0 });
  const [compare, setCompare] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const width = device === "desktop" ? 1280 : 390;
  const scale = Math.min(size.width / width, 1) || 1;
  const showingDraft = draft && !compare;

  const sendPreview = useCallback(() => {
    frame.current?.contentWindow?.postMessage({
      type: "site-preview",
      content: showingDraft ? content : currentContent,
    }, window.location.origin);
  }, [showingDraft, content, currentContent]);

  useEffect(() => {
    function onReady(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow
        || event.data?.type !== "site-preview-ready") return;
      const page = (Object.keys(pages) as View[]).find((key) => pages[key].file === event.data.file);
      if (page) setView(page);
      sendPreview();
    }
    window.addEventListener("message", onReady);
    sendPreview();
    return () => window.removeEventListener("message", onReady);
  }, [sendPreview]);

  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    }));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function choosePage(page: View) {
    setView(page);
    setNavigation((previous) => ({ page, sequence: previous.sequence + 1 }));
  }

  const id = target?.category === navigation.page ? target.id : null;
  const source = "/" + pages[navigation.page].file + "?editor-preview=1" + (id ? "#" + id : "");

  return <section className="panel preview-panel" aria-labelledby="preview-heading">
    <div className="preview-heading">
      <div>
        <h2 id="preview-heading">网页预览</h2>
        <p>{showingDraft ? "查看草稿在网站上的效果" : revisionLabel}</p>
      </div>
      <div className="segmented" aria-label="预览设备">
        <button type="button" aria-pressed={device === "desktop"} onClick={() => onDeviceChange("desktop")}>电脑</button>
        <button type="button" aria-pressed={device === "phone"} onClick={() => onDeviceChange("phone")}>手机</button>
      </div>
    </div>
    <div className="preview-tools">
      <label className="page-control">
        <span>页面</span>
        <select value={view} onChange={(event) => choosePage(event.target.value as View)}>
          {Object.entries(pages).map(([key, page]) => <option key={key} value={key}>{page.label}</option>)}
        </select>
      </label>
      {draft && <div className="segmented" aria-label="对比版本">
        <button type="button" aria-pressed={compare} onClick={() => setCompare(true)}>当前版本</button>
        <button type="button" aria-pressed={!compare} onClick={() => setCompare(false)}>修改草稿</button>
      </div>}
    </div>
    <div className={`preview-background${device === "phone" ? " preview-background-phone" : ""}`}>
      <div className="preview-stage" ref={stage}>
        <iframe
          key={navigation.sequence}
          ref={frame}
          src={source}
          onLoad={sendPreview}
          title={pages[view].label + "网页预览"}
          style={{ width, height: Math.ceil(size.height / scale) || 500, transform: `scale(${scale})` }}
        />
      </div>
    </div>
  </section>;
}
