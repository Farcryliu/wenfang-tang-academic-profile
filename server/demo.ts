import { biographyParagraphs, defaultSiteContent } from "../src/data/siteContent.ts";
import { examples } from "../src/editor/examples.ts";
import type { EditChanges, SiteVersion } from "../src/editor/types.ts";
import { EditorError } from "./changes.ts";
import { editorApi, type ContentStore } from "./editor.ts";

const revision = () => Array.from(crypto.getRandomValues(new Uint8Array(20)), (byte) => byte.toString(16).padStart(2, "0")).join("");

export function createDemoEditor() {
  let site: SiteVersion = { revision: revision(), content: defaultSiteContent };
  const secret = revision() + revision();
  const store: ContentStore = {
    async load() { return site; },
    async publish(base, content) {
      if (base.revision !== site.revision) throw new EditorError(409, "已有新的测试版本，请刷新后重新预览。");
      site = { revision: revision(), content };
      return site;
    },
    async deployment() { return { status: "live" }; },
  };

  return (request: Request) => editorApi(request, "本地演示", {
    store,
    secret,
    siteUrl: "https://tangwenfang.org/",
    demo: true,
    async generate(prompt, content) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const result: EditChanges & { question: string | null } = { question: null, biography: null, layout: null, publication: null };
      const layout = content.layout;
      switch (prompt) {
        case examples.biography: {
          const [first, ...rest] = biographyParagraphs(content.biography);
          result.biography = [first, rest.join(" ")].join("\n\n");
          break;
        }
        case examples.order:
          result.layout = { ...layout, sectionOrder: ["about", "experience", "publications"] };
          break;
        case examples.title:
          result.layout = { ...layout, titleScale: Math.min(layout.titleScale + 10, 150) };
          break;
        case examples.demoPublication:
          result.publication = {
            action: "add", category: "articles", id: null,
            title: "Public Opinion and Civic Life",
            year: 2026, citation: "Tang, W. (2026). Public Opinion and Civic Life. Demo Journal.",
            sourceUrl: null,
          };
          break;
        default:
          result.question = "本地演示可以试用下方四条示例。正式后台接入 AI 后，可以用自己的话描述修改。";
      }
      return result;
    },
  });
}
