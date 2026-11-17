import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SitePreview, type PreviewDevice } from "./SitePreview";
import { examples } from "./examples";
import type { Deployment, EditResult, EditorSession, PublishResult } from "./types";
import "./editor.css";

class RequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch("/api/editor/" + path, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "follow",
  });
  if (response.redirected || !response.headers.get("Content-Type")?.includes("application/json")) {
    throw new RequestError(403, "登录可能已过期，请重新打开编辑后台。");
  }
  const result = await response.json();
  if (!response.ok) throw new RequestError(response.status, result.error ?? "操作暂时无法完成。");
  return result;
}

type Draft = Extract<EditResult, { ticket: string }>;

const deploymentLabels = {
  waiting: "已提交，等待网站发布",
  running: "正在更新公开网站",
  live: "已发布到公开网站",
  failed: "网站发布失败，请联系管理员",
  cancelled: "这一版的发布已取消，请查看发布记录",
};

function Editor() {
  const [site, setSite] = useState<EditorSession | null>(null);
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [busy, setBusy] = useState<"load" | "draft" | "publish" | null>("load");
  const [publication, setPublication] = useState<{ revision: string; deployment: Deployment } | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const promptField = useRef<HTMLTextAreaElement>(null);

  function reportError(error: unknown) {
    setError(error instanceof RequestError ? error.message : "暂时无法连接编辑后台，请稍后再试。");
    setNeedsRefresh(error instanceof RequestError && error.status === 409);
  }

  async function load() {
    setBusy("load");
    setError("");
    try {
      setSite(await api<EditorSession>("site"));
      setNeedsRefresh(false);
      setDraft(null);
      setQuestion("");
      setPreviewVersion((version) => version + 1);
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    if (!publication || !["waiting", "running"].includes(publication.deployment.status)) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const deployment = await api<Deployment>("deployment?revision=" + publication.revision);
        if (!cancelled) setPublication({ revision: publication.revision, deployment });
      } catch {
        if (!cancelled) setPublication({ ...publication });
      }
    }, 6500);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [publication]);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !site || !prompt.trim()) return;
    setBusy("draft");
    setDraft(null);
    setQuestion("");
    setError("");
    try {
      const result = await api<EditResult>("draft", { prompt, revision: site.revision });
      if ("question" in result) {
        setQuestion(result.question);
        window.requestAnimationFrame(() => promptField.current?.focus());
      } else {
        setDraft(result);
        setPreviewVersion((version) => version + 1);
      }
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    if (!draft || !site || busy) return;
    setBusy("publish");
    setError("");
    try {
      const result = await api<PublishResult>("publish", { ticket: draft.ticket });
      setPublication({
        revision: result.revision,
        deployment: { status: site.demo ? "live" : "waiting", url: result.deploymentUrl },
      });
      setSite({ ...site, ...result });
      setDraft(null);
      setPrompt("");
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(null);
    }
  }

  function editPrompt() {
    setDraft(null);
    setQuestion("");
    if (!needsRefresh) setError("");
    window.requestAnimationFrame(() => promptField.current?.focus());
  }

  return <>
    <header className="editor-top">
      <a className="editor-brand" href={site?.siteUrl ?? "https://tangwenfang.org/"} target="_blank" rel="noreferrer">
        <span className="brand-mark" aria-hidden="true">唐</span>
        <span>唐文方<span className="brand-divider" /><span className="brand-caption">个人学术网站</span></span>
      </a>
      {site && <div className="account">
        <span>{site.demo ? "本地演示" : site.editor}</span>
        {!site.demo && <a href="/cdn-cgi/access/logout">退出</a>}
      </div>}
    </header>
    <main className="editor-main">
      <div className="editor-title">
        <div>
          <h1>编辑网站</h1>
          <p>用中文描述您想改的内容，预览确认后发布。</p>
        </div>
        <a className="text-link" href={site?.siteUrl ?? "https://tangwenfang.org/"} target="_blank" rel="noreferrer">打开公开网站 <span aria-hidden="true">↗</span></a>
      </div>
      {site?.demo && <p className="demo-note">这是本地演示。可试用下方四条示例，发布只更新本次演示。</p>}
      {!site ? <section className="panel loading-panel" aria-live="polite">
        <p>{error || "正在读取网站当前版本…"}</p>
        {error && <button type="button" className="secondary" onClick={() => void load()}>重试</button>}
      </section> : <div className="editor-grid">
        <div className="editor-column">
          <section className="panel compose" aria-labelledby="compose-heading">
            <h2 id="compose-heading">告诉 AI 怎么改</h2>
            <form onSubmit={generate}>
              <label htmlFor="modification">修改说明</label>
              <textarea id="modification" ref={promptField} value={prompt} maxLength={7000}
                disabled={Boolean(busy) || Boolean(draft)}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="例如，把首页英文简介精简成两段，保留现任职务和最新专著。" />
              <div className="examples" aria-label="可以试试">
                {[
                  ["精简简介", examples.biography],
                  ["新增论文", site.demo ? examples.demoPublication : examples.publication],
                  ["调整区块顺序", examples.order],
                  ["放大首页标题", examples.title],
                ].map(([label, text]) => <button type="button" key={label} disabled={Boolean(busy) || Boolean(draft)} onClick={() => {
                  setPrompt(text);
                  setQuestion("");
                  if (!needsRefresh) setError("");
                  promptField.current?.focus();
                }}>{label}</button>)}
              </div>
              {question && <p className="notice" role="status">{question}</p>}
              <button className="primary generate" type="submit" disabled={Boolean(busy) || !prompt.trim() || Boolean(draft) || needsRefresh}>
                {busy === "draft" ? "正在生成预览…" : "生成修改预览"}
              </button>
            </form>
          </section>
          {error && <div className="panel feedback error" role="alert">
            <p>{error}</p>
            {needsRefresh && <button className="secondary" type="button" onClick={() => void load()} disabled={Boolean(busy)}>刷新当前版本</button>}
          </div>}
          {draft && <section className="panel changes" aria-labelledby="changes-heading">
            <h2 id="changes-heading">待发布草稿</h2>
            <ul>{draft.summary.map((change) => <li key={change}>{change}</li>)}</ul>
            {draft.publication && <blockquote>{draft.publication.citation.map((part) => part.text).join("")}</blockquote>}
            <div className="change-actions">
              <button className="secondary" type="button" onClick={editPrompt} disabled={Boolean(busy)}>修改说明</button>
              <button className="primary" type="button" onClick={() => void publish()} disabled={Boolean(busy) || needsRefresh}>
                {busy === "publish" ? "正在提交…" : site.demo ? "模拟发布" : "确认发布"}
              </button>
            </div>
          </section>}
          {publication && <section className="panel feedback" aria-live="polite">
            <p>{site.demo ? "演示发布完成" : deploymentLabels[publication.deployment.status]}</p>
            {!site.demo && publication.deployment.url && <a className="text-link" href={publication.deployment.url} target="_blank" rel="noreferrer">查看发布记录 ↗</a>}
          </section>}
        </div>
        <SitePreview key={previewVersion} currentContent={site.content} content={draft?.content ?? site.content}
          draft={Boolean(draft)} target={draft?.target ?? null}
          device={previewDevice} onDeviceChange={setPreviewDevice}
          revisionLabel={publication?.deployment.status === "waiting" || publication?.deployment.status === "running"
            ? "已提交版本" : "查看当前版本"} />
      </div>}
    </main>
  </>;
}

createRoot(document.getElementById("editor-root")!).render(<Editor />);
