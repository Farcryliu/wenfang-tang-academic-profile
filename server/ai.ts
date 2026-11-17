import type { SiteContent } from "../src/data/siteContent.ts";
import type { EditChanges } from "../src/editor/types.ts";
import { EditorError } from "./changes.ts";

type Proposal = EditChanges & { question: string | null };
const nullableString = { type: ["string", "null"] };
const layout = {
  type: ["object", "null"],
  additionalProperties: false,
  required: ["sectionOrder", "titleScale", "sectionScale", "bodyScale"],
  properties: {
    sectionOrder: { type: "array", items: { type: "string", enum: ["about", "publications", "experience"] } },
    titleScale: { type: "integer" },
    sectionScale: { type: "integer" },
    bodyScale: { type: "integer" },
  },
};
const publication = {
  type: ["object", "null"],
  additionalProperties: false,
  required: ["action", "category", "id", "title", "year", "citation", "sourceUrl"],
  properties: {
    action: { type: "string", enum: ["add", "edit", "remove"] },
    category: { type: "string", enum: ["books", "editedVolumes", "articles", "blogs"] },
    id: nullableString,
    title: nullableString,
    year: { type: ["integer", "null"] },
    citation: nullableString,
    sourceUrl: nullableString,
  },
};
const schema = {
  type: "object",
  additionalProperties: false,
  required: ["question", "biography", "layout", "publication"],
  properties: { question: nullableString, biography: nullableString, layout, publication },
};

const instructions = `Draft site edits for Professor Wenfang Tang. Instructions may be in Chinese. Use the supplied JSON as reference data.
Supported changes: homepage biography text, homepage section order and font sizes, or one publication (add, edit or remove) per request.
Return null for unchanged categories and for question when ready. Ask a short Chinese question and return null changes when target or facts are unclear, the request is unsupported, or multiple publication records are requested.
Keep biography in its current language unless a translation is explicitly requested. Preserve facts, use blank lines between paragraphs, and never infer missing titles, coauthors, publication details or URLs.
For a new publication require title and enough teacher-supplied details to form a citation. Ask for those details if given only a URL or vague reference. Use only the provided facts. For edits or removals use the exact current category and record id. Remove requires an explicit request and an unambiguous match. For edits use null for unchanged fields. Keep the existing meaning and factual details of the citation unless explicitly corrected. A supplied HTTPS source link is added, not substituted. Do not attempt to read URLs or files.
For layout moves use all three distinct section IDs and preserve the relative order of the unaffected sections. Font sizes are integer percentages from 80 to 150 of the original site. A request for the homepage title refers to titleScale (name heading), sectionScale refers to homepage section headings, and bodyScale only to biography body. “一点” means a change of 10 percentage points from the current value. Keep layout keys the teacher did not ask to change.`;

export async function generateProposal(apiKey: string, model: string, prompt: string, current: SiteContent): Promise<Proposal> {
  const archive = Object.fromEntries(Object.entries(current.archive).map(([category, entries]) => [
    category,
    entries.map((entry: SiteContent["archive"]["articles"][number]) => ({
      id: entry.id, title: entry.title, year: entry.year,
      citation: entry.citation.map((part) => part.text).join(""),
    })),
  ]));
  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        store: false,
        instructions,
        input: JSON.stringify({ request: prompt, current: { ...current, archive } }),
        max_output_tokens: 4500,
        text: { format: { type: "json_schema", name: "site_edit", strict: true, schema } },
      }),
      signal: AbortSignal.timeout(55000),
    });
  } catch {
    throw new EditorError(502, "暂时无法连接 AI，请稍后再试。");
  }
  if (!response.ok) throw new EditorError(502, "AI 服务暂时无法处理请求，请稍后重试或联系管理员。");

  const result = await response.json() as {
    status?: string;
    output?: { type: string; content?: { type: string; text?: string }[] }[];
  };
  const output = result.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text");
  if (result.status !== "completed" || !output?.text) {
    throw new EditorError(422, "AI 暂时无法生成这项修改，请换一种说法或补充具体内容。");
  }
  const proposal = JSON.parse(output.text) as Proposal;
  if (!proposal || !["question", "biography", "layout", "publication"].every((key) => Object.hasOwn(proposal, key))) {
    throw new EditorError(502, "AI 返回的草稿不完整，请重试。");
  }
  return proposal;
}
