import type { ArchiveData, ArchiveEntry, BookEntry } from "../src/data/archive.ts";
import type { HomeLayout, SectionId, SiteContent } from "../src/data/siteContent.ts";
import type { ChangesPreview, EditChanges, PublicationCategory, PublicationChange } from "../src/editor/types.ts";

export class EditorError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const sections: Record<SectionId, string> = {
  about: "简介",
  publications: "出版物",
  experience: "学术经历",
};

const categories: Record<PublicationCategory, string> = {
  books: "专著",
  editedVolumes: "编著",
  articles: "论文",
  blogs: "评论文章",
};

const scales = {
  titleScale: "首页姓名标题",
  sectionScale: "区块标题",
  bodyScale: "简介正文",
} as const;

const checkText = (value: unknown, max: number) => typeof value === "string" && value.trim().length > 0 && value.length <= max;
const validScale = (value: unknown) => typeof value === "number" && Number.isInteger(value) && value >= 80 && value <= 150;

function validateLayout(layout: HomeLayout) {
  if (layout && Array.isArray(layout.sectionOrder) && layout.sectionOrder.length === 3
    && new Set(layout.sectionOrder).size === 3
    && layout.sectionOrder.every((section) => Object.hasOwn(sections, section))
    && Object.keys(scales).every((scale) => validScale(layout[scale as keyof typeof scales]))) {
    return {
      sectionOrder: layout.sectionOrder,
      titleScale: layout.titleScale,
      sectionScale: layout.sectionScale,
      bodyScale: layout.bodyScale,
    };
  }
  throw new EditorError(422, "版式设置无效。字号可以在原样式的 80% 至 150% 之间调整。");
}

function safeSource(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && !parsed.username && !parsed.password && url.length <= 2048) return parsed.href;
  } catch {
    // Invalid URLs are reported below.
  }
  throw new EditorError(422, "出版物链接需要是有效的 HTTPS 网址。");
}

function publicationId(title: string, entries: readonly ArchiveEntry[]) {
  const base = title.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72).replace(/-$/g, "") || "publication";
  let id = base;
  for (let suffix = 2; entries.some((entry) => entry.id === id); suffix += 1) id = base + "-" + suffix;
  return id;
}

function updatePublication(archive: ArchiveData, change: PublicationChange) {
  if (!change || !Object.hasOwn(categories, change.category) || !["add", "edit", "remove"].includes(change.action)) {
    throw new EditorError(422, "请说明要修改哪一类出版物。");
  }
  const entries = archive[change.category];
  const previous = entries.find((entry) => entry.id === change.id);
  if (change.action !== "add" && !previous) {
    throw new EditorError(422, "没有找到这条出版物，请提供完整标题。");
  }
  if (change.action === "remove") {
    return { entries: entries.filter((entry) => entry !== previous), publication: null, title: previous!.title };
  }

  if (change.title !== null && !checkText(change.title, 500)
    || change.citation !== null && !checkText(change.citation, 2500)
    || change.year !== null && (!Number.isInteger(change.year) || change.year < 1800 || change.year > 2100)
    || change.sourceUrl !== null && typeof change.sourceUrl !== "string") {
    throw new EditorError(422, "出版物信息有误，请补充标题、引文或出版年份。");
  }
  if (change.action === "add" && (!change.title || !change.citation)) {
    throw new EditorError(422, "新增出版物需要标题和完整引文。");
  }
  const title = change.title?.trim() ?? previous!.title;
  const year = change.year ?? previous?.year ?? null;
  if (entries.some((entry) => entry !== previous && entry.year === year
    && entry.title.normalize("NFKC").toLowerCase() === title.normalize("NFKC").toLowerCase())) {
    throw new EditorError(422, "这一分类已有相同标题和年份的出版物。");
  }

  const links = [...(previous?.links ?? [])];
  if (change.sourceUrl) {
    const href = safeSource(change.sourceUrl);
    if (!links.some((link) => link.href === href)) links.push({ label: "Publisher / DOI", href });
  }
  const publication: ArchiveEntry = {
    ...previous,
    id: previous?.id ?? publicationId(title, entries),
    year,
    title,
    citation: change.citation ? [{ text: change.citation.trim() }] : previous!.citation,
    links,
  };
  if (previous && JSON.stringify(previous) === JSON.stringify(publication)) {
    throw new EditorError(422, "这一条出版物与现有内容相同，请补充要修改的地方。");
  }

  const isBook = change.category === "books" || change.category === "editedVolumes";
  const entry = isBook && !previous
    ? { ...publication, cover: "", amazonUrl: "", amazonSearch: false } satisfies BookEntry
    : publication;
  return {
    entries: previous ? entries.map((item) => item === previous ? entry : item) : [entry, ...entries],
    publication: entry,
    title,
  };
}

export function previewChanges(current: SiteContent, changes: EditChanges): ChangesPreview {
  const content = { ...current };
  const summary: string[] = [];
  if (changes.biography !== null) {
    if (!checkText(changes.biography, 10000)) throw new EditorError(422, "请提供有效的简介正文。");
    const biography = changes.biography.replace(/\r\n/g, "\n").trim();
    if (biography !== current.biography) {
      content.biography = biography;
      summary.push("更新首页简介");
    }
  }

  if (changes.layout !== null) {
    const layout = validateLayout(changes.layout);
    const beforeLayout = summary.length;
    if (layout.sectionOrder.join(",") !== current.layout.sectionOrder.join(",")) {
      summary.push("首页顺序改为 " + layout.sectionOrder.map((id) => sections[id]).join(" → "));
    }
    for (const scale of Object.keys(scales) as (keyof typeof scales)[]) {
      if (layout[scale] !== current.layout[scale]) summary.push(scales[scale] + "调为原样式的 " + layout[scale] + "%");
    }
    if (summary.length > beforeLayout) content.layout = layout;
  }

  let target: ChangesPreview["target"] = null;
  let publication: ChangesPreview["publication"] = null;
  if (changes.publication !== null) {
    const change = changes.publication;
    const result = updatePublication(current.archive, change);
    content.archive = { ...current.archive, [change.category]: result.entries } as ArchiveData;
    publication = result.publication;
    target = { category: change.category, id: publication?.id ?? null };
    const action = { add: "新增", edit: "修改", remove: "移除" }[change.action];
    summary.push(action + categories[change.category] + "《" + result.title + "》");
  }

  if (!summary.length) throw new EditorError(422, "这次提议和现有内容相同，请具体说明您想改什么。");
  return { content, summary, target, publication };
}
