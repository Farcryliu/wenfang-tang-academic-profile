export type ArchiveCategory = "books" | "edited-volumes" | "articles" | "blogs";
export type CitationSegment = { text: string; italic?: boolean; href?: string };
export type ArchiveLink = { label: string; href: string };
export type ArchiveNote = { text: string; links: ArchiveLink[] };
export type ArchiveEntry = {
  id: string;
  title: string;
  year: number | null;
  citation: CitationSegment[];
  links: ArchiveLink[];
  notes?: ArchiveNote[];
};
export type BookEntry = ArchiveEntry & {
  cover: string;
  amazonUrl: string;
  amazonSearch: boolean;
  note?: string;
};
export type ArchiveData = {
  books: BookEntry[];
  editedVolumes: BookEntry[];
  articles: ArchiveEntry[];
  blogs: ArchiveEntry[];
};

export const archiveLabels = [
  { id: "books", label: "Books", key: "books" },
  { id: "edited-volumes", label: "Edited Volumes", key: "editedVolumes" },
  { id: "articles", label: "Articles", key: "articles" },
  { id: "blogs", label: "Op-Eds", key: "blogs" },
] as const;

export function getArchiveCategories(data: ArchiveData) {
  return archiveLabels.map((item) => ({ ...item, entries: data[item.key] }));
}

export function isEditorPreview() {
  return window.parent !== window && new URLSearchParams(window.location.search).has("editor-preview");
}

export function archiveHref(category: ArchiveCategory) {
  return `${import.meta.env.BASE_URL}${category}.html${isEditorPreview() ? "?editor-preview=1" : ""}`;
}
export function homeHref(section = "home") {
  return `${import.meta.env.BASE_URL}${isEditorPreview() ? "index.html?editor-preview=1" : ""}#${section}`;
}
export function currentArchiveCategory(): ArchiveCategory | null {
  const filename = window.location.pathname.split("/").pop();
  return archiveLabels.find((category) => `${category.id}.html` === filename)?.id ?? null;
}
