import data from "./archive.json";

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
export const fullBooks: BookEntry[] = data.books;
export const fullEditedVolumes: BookEntry[] = data.editedVolumes;
export const fullArticles: ArchiveEntry[] = data.articles;
const opEds: ArchiveEntry[] = data.blogs;
export const archiveCategories = [
  { id: "books", label: "Books", entries: fullBooks },
  { id: "edited-volumes", label: "Edited Volumes", entries: fullEditedVolumes },
  { id: "articles", label: "Articles", entries: fullArticles },
  { id: "blogs", label: "Op-Eds", entries: opEds },
] as const;
export function archiveHref(category: ArchiveCategory) {
  return `${import.meta.env.BASE_URL}${category}.html`;
}
export function homeHref(section = "home") {
  return `${import.meta.env.BASE_URL}#${section}`;
}
export function currentArchiveCategory(): ArchiveCategory | null {
  const filename = window.location.pathname.split("/").pop();
  return archiveCategories.find((category) => `${category.id}.html` === filename)?.id ?? null;
}
