import { generateProposal } from "./ai.ts";
import { editorApi, editorJson, decoder, encoder, unbase64 } from "./editor.ts";
import { githubStore } from "./github.ts";

type Env = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUDIENCE?: string;
  EDITOR_EMAILS?: string;
  EDITOR_SIGNING_SECRET?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPOSITORY: string;
  GITHUB_BRANCH: string;
  PUBLIC_SITE_URL: string;
};

type AccessKey = JsonWebKey & { kid: string };
const keyCache = new Map<string, { until: number; keys: AccessKey[] }>();

async function verifyAccess(request: Request, env: Env) {
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 12000 || !env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUDIENCE || !env.EDITOR_EMAILS) return null;
  const domain = env.ACCESS_TEAM_DOMAIN.toLowerCase();
  if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(domain)) return null;
  const issuer = "https://" + domain;
  try {
    const [header, payload, signature, extra] = token.split(".");
    if (!header || !payload || !signature || extra) return null;
    const { alg, kid } = JSON.parse(decoder.decode(unbase64(header)));
    const claims = JSON.parse(decoder.decode(unbase64(payload)));
    const now = Math.floor(Date.now() / 1000);
    if (alg !== "RS256" || typeof kid !== "string" || claims.iss !== issuer || claims.type !== "app"
      || !Array.isArray(claims.aud) || !claims.aud.includes(env.ACCESS_AUDIENCE)
      || typeof claims.exp !== "number" || claims.exp <= now
      || typeof claims.nbf !== "number" || claims.nbf > now
      || typeof claims.email !== "string") return null;
    const email = claims.email.trim().toLowerCase();
    if (!env.EDITOR_EMAILS.split(",").map((item) => item.trim().toLowerCase()).includes(email)) return null;

    let cached = keyCache.get(issuer);
    if (!cached || cached.until < Date.now() || !cached.keys.some((key) => key.kid === kid)) {
      const result = await fetch(issuer + "/cdn-cgi/access/certs", { signal: AbortSignal.timeout(5000) });
      if (!result.ok) return null;
      const { keys } = await result.json() as { keys: AccessKey[] };
      cached = { until: Date.now() + 300000, keys };
      keyCache.set(issuer, cached);
    }
    const jwk = cached.keys.find((key) => key.kid === kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const verified = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, unbase64(signature), encoder.encode(header + "." + payload));
    return verified ? email : null;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const api = url.pathname.startsWith("/api/editor/");
    const editor = await verifyAccess(request, env);
    if (!editor) {
      if (api) return editorJson({ error: "请用获准的邮箱登录编辑后台。" }, 403);
      return new Response("请通过编辑后台的登录页面，用获准的邮箱登录。", { status: 403, headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      } });
    }
    if (url.pathname === "/") return Response.redirect(new URL("/editor.html", url), 302);
    if (url.pathname.startsWith("/uploads/")) {
      return Response.redirect(new URL(url.pathname + url.search, env.PUBLIC_SITE_URL), 302);
    }
    if (api) {
      const { EDITOR_SIGNING_SECRET, GITHUB_TOKEN, OPENAI_API_KEY } = env;
      if (!EDITOR_SIGNING_SECRET || EDITOR_SIGNING_SECRET.length < 32 || !GITHUB_TOKEN || !OPENAI_API_KEY) {
        return editorJson({ error: "编辑后台还在配置中，请联系管理员。" }, 503);
      }
      return editorApi(request, editor, {
        store: githubStore({ ...env, GITHUB_TOKEN }),
        secret: EDITOR_SIGNING_SECRET,
        siteUrl: env.PUBLIC_SITE_URL,
        generate: (prompt, site) => generateProposal(OPENAI_API_KEY, env.OPENAI_MODEL, prompt, site),
      });
    }

    const asset = await env.ASSETS.fetch(request);
    const headers = new Headers(asset.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Content-Security-Policy", "frame-ancestors 'self'");
    if (headers.get("Content-Type")?.includes("text/html")) headers.set("Cache-Control", "no-store");
    return new Response(asset.body, { status: asset.status, headers });
  },
};
