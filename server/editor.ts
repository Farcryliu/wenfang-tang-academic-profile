import type { SiteContent } from "../src/data/siteContent.ts";
import type { Deployment, EditChanges, PublishResult, SiteVersion } from "../src/editor/types.ts";
import { EditorError, previewChanges } from "./changes.ts";

export type ContentStore = {
  load: () => Promise<SiteVersion>;
  publish: (current: SiteVersion, content: SiteContent) => Promise<PublishResult>;
  deployment: (revision: string) => Promise<Deployment>;
};

type Services = {
  store: ContentStore;
  secret: string;
  siteUrl: string;
  demo?: boolean;
  generate: (prompt: string, site: SiteContent) => Promise<EditChanges & { question: string | null }>;
};

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();
const maxBodySize = 50000;

export function base64(bytes: Uint8Array) {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 4096) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 4096));
  }
  return btoa(binary);
}

export function unbase64(value: string) {
  return Uint8Array.from(atob(value.replace(/-/g, "+").replace(/_/g, "/")), (char) => char.charCodeAt(0));
}

export function editorJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  } });
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new EditorError(400, "缺少修改请求。");
  let size = 0;
  let body = "";
  const parser = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodySize) {
      await reader.cancel();
      throw new EditorError(413, "提交内容过长，请分次修改。");
    }
    body += parser.decode(value, { stream: true });
  }
  try {
    const parsed: unknown = JSON.parse(body + parser.decode());
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
  } catch {
    // Invalid JSON is reported below.
  }
  throw new EditorError(400, "无法读取修改请求。");
}

type Ticket = { editor: string; revision: string; expires: number; changes: EditChanges };

async function ticketKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function seal(ticket: Ticket, secret: string) {
  const data = base64(encoder.encode(JSON.stringify(ticket)));
  const signature = await crypto.subtle.sign("HMAC", await ticketKey(secret), encoder.encode(data));
  return data + "." + base64(new Uint8Array(signature));
}

async function openTicket(value: string, editor: string, secret: string) {
  try {
    const [data, signature, extra] = value.split(".");
    if (data && signature && !extra && await crypto.subtle.verify("HMAC", await ticketKey(secret), unbase64(signature), encoder.encode(data))) {
      const ticket = JSON.parse(decoder.decode(unbase64(data))) as Ticket;
      if (ticket.editor === editor && ticket.expires > Date.now()) return ticket;
    }
  } catch {
    // Invalid signatures or payloads are reported below.
  }
  throw new EditorError(409, "草稿已失效，请重新生成预览。");
}

export async function editorApi(request: Request, editor: string, services: Services) {
  const url = new URL(request.url);
  try {
    if (request.method === "GET" && url.pathname === "/api/editor/site") {
      const site = await services.store.load();
      return editorJson({ ...site, editor, demo: Boolean(services.demo), siteUrl: services.siteUrl });
    }
    if (request.method === "GET" && url.pathname === "/api/editor/deployment") {
      const revision = url.searchParams.get("revision");
      if (!revision || !/^[a-f0-9]{40}$/.test(revision)) throw new EditorError(400, "无法查询该版本。");
      return editorJson(await services.store.deployment(revision));
    }
    if (request.method !== "POST" || !["/api/editor/draft", "/api/editor/publish"].includes(url.pathname)) {
      return editorJson({ error: "找不到这个操作。" }, 404);
    }
    if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") === "cross-site"
      || request.headers.get("Content-Type")?.split(";")[0] !== "application/json") {
      throw new EditorError(403, "请从编辑页面提交请求。");
    }

    const body = await readBody(request);
    if (url.pathname === "/api/editor/draft") {
      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      if (!prompt || prompt.length > 7000) throw new EditorError(400, "请输入 1 到 7000 字的修改说明。");
      const site = await services.store.load();
      if (body.revision !== site.revision) {
        throw new EditorError(409, "网站已有新版本，请刷新当前版本后再生成草稿。");
      }
      const { question, ...changes } = await services.generate(prompt, site.content);
      if (typeof question === "string" && question.trim()) return editorJson({ question: question.trim().slice(0, 3000) });
      const preview = previewChanges(site.content, changes);
      const ticket = await seal({ editor, revision: site.revision, changes, expires: Date.now() + 60 * 60 * 1000 }, services.secret);
      return editorJson({ ...preview, ticket });
    }

    if (typeof body.ticket !== "string") throw new EditorError(400, "请先生成预览，再发布。");
    const ticket = await openTicket(body.ticket, editor, services.secret);
    const site = await services.store.load();
    if (site.revision !== ticket.revision) {
      throw new EditorError(409, "网站已有新版本。请刷新后用原指令重新生成草稿。");
    }
    const { content } = previewChanges(site.content, ticket.changes);
    return editorJson(await services.store.publish(site, content));
  } catch (error) {
    if (error instanceof EditorError) return editorJson({ error: error.message }, error.status);
    return editorJson({ error: "编辑后台暂时无法处理这项操作，请稍后再试。" }, 500);
  }
}
