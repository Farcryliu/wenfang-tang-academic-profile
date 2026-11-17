import type { SiteContent } from "../src/data/siteContent.ts";
import type { Deployment } from "../src/editor/types.ts";
import { EditorError } from "./changes.ts";
import { base64, decoder, encoder, unbase64, type ContentStore } from "./editor.ts";

type Settings = { GITHUB_REPOSITORY: string; GITHUB_BRANCH: string; GITHUB_TOKEN: string };

const biographyPath = "src/data/biography.json";
const archivePath = "src/data/archive.json";
const layoutPath = "src/data/layout.json";
const workflow = "deploy-pages.yml";

function jsonFile(path: string, value: unknown) {
  return { path, contents: base64(encoder.encode(JSON.stringify(value, null, 2) + "\n")) };
}

export function githubStore(settings: Settings): ContentStore {
  const repo = settings.GITHUB_REPOSITORY;
  const branch = settings.GITHUB_BRANCH;
  const repoApi = "https://api.github.com/repos/" + repo;
  const actionsUrl = "https://github.com/" + repo + "/actions/workflows/" + workflow;
  const headers = {
    Authorization: "Bearer " + settings.GITHUB_TOKEN,
    Accept: "application/vnd.github+json",
    "User-Agent": "wenfang-tang-site-editor",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  async function github<T>(url: string, body?: unknown) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: body ? "POST" : "GET",
        headers: body ? { ...headers, "Content-Type": "application/json" } : headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new EditorError(502, "无法连接网站发布服务，请稍后再试。");
    }
    if (!response.ok) throw new EditorError(502, "网站发布服务访问失败，请联系管理员检查配置。");
    return await response.json() as T;
  }

  async function file<T>(path: string, revision: string) {
    const entry = await github<{ content: string; encoding: string }>(repoApi + "/contents/" + path + "?ref=" + revision);
    if (entry.encoding !== "base64") throw new EditorError(502, "暂时无法读取网站数据。");
    return JSON.parse(decoder.decode(unbase64(entry.content))) as T;
  }

  return {
    async load() {
      const ref = await github<{ object: { sha: string } }>(repoApi + "/git/ref/heads/" + encodeURIComponent(branch));
      const revision = ref.object.sha;
      const [{ biography }, archive, layout] = await Promise.all([
        file<{ biography: string }>(biographyPath, revision),
        file<SiteContent["archive"]>(archivePath, revision),
        file<SiteContent["layout"]>(layoutPath, revision),
      ]);
      return { revision, content: { biography, archive, layout } };
    },
    async publish(current, content) {
      const additions = [];
      if (content.biography !== current.content.biography) additions.push(jsonFile(biographyPath, { biography: content.biography }));
      if (content.archive !== current.content.archive) additions.push(jsonFile(archivePath, content.archive));
      if (content.layout !== current.content.layout) additions.push(jsonFile(layoutPath, content.layout));
      const response = await github<{
        data?: { createCommitOnBranch?: { commit?: { oid: string } } };
        errors?: { type?: string; message?: string }[];
      }>("https://api.github.com/graphql", {
        query: "mutation Publish($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }",
        variables: {
          input: {
            branch: { repositoryNameWithOwner: repo, branchName: branch },
            expectedHeadOid: current.revision,
            fileChanges: { additions },
            message: { headline: "Publish updates from the site editor" },
          },
        },
      });
      const revision = response.data?.createCommitOnBranch?.commit?.oid;
      if (!revision) {
        if (response.errors?.some((error) => error.type === "STALE_DATA" || /expected|head.*(match|changed)/i.test(error.message ?? ""))) {
          throw new EditorError(409, "网站已有新版本。请刷新后用原指令重新生成草稿。");
        }
        throw new EditorError(502, "发布服务未能确认提交。请先刷新当前版本，再重试。");
      }
      return { content, revision, deploymentUrl: actionsUrl };
    },
    async deployment(revision): Promise<Deployment> {
      const result = await github<{ workflow_runs: { status: string; conclusion: string | null; html_url: string }[] }>(
        repoApi + "/actions/workflows/" + workflow + "/runs?event=push&per_page=1&head_sha=" + revision,
      );
      const run = result.workflow_runs[0];
      if (!run) return { status: "waiting", url: actionsUrl };
      const status = run.status !== "completed" ? "running"
        : run.conclusion === "success" ? "live"
        : run.conclusion === "cancelled" ? "cancelled" : "failed";
      return { status, url: run.html_url };
    },
  };
}
