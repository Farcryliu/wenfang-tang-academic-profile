import data from "./archive.json";
import type { CitationSegment } from "./publications";

export type ArchiveCategory = "books" | "edited-volumes" | "articles" | "blogs";
export type ArchiveLink = { label: string; href: string };
export type ArchiveNote = { text: string; links: ArchiveLink[] };
export type ArchiveEntry = {
  id: string;
  year: number | null;
  citation: CitationSegment[];
  links: ArchiveLink[];
  notes?: ArchiveNote[];
};
export type BookEntry = ArchiveEntry & {
  title: string;
  cover: string;
  amazonUrl: string;
  amazonSearch: boolean;
  note?: string;
};
export const fullBooks: BookEntry[] = data.books;
export const fullEditedVolumes: BookEntry[] = data.editedVolumes;
export const fullArticles: ArchiveEntry[] = data.articles;
export const fullBlogs: ArchiveEntry[] = data.blogs;
export const archiveCategories = [
  { id: "books", label: "Books", entries: fullBooks, description: "Books and monographs, including Chinese and Russian editions." },
  { id: "edited-volumes", label: "Edited Volumes", entries: fullEditedVolumes, description: "Edited books, collected essays, and a journal issue." },
  { id: "articles", label: "Articles", entries: fullArticles, description: "Journal articles, book chapters, research reports, and working papers." },
  { id: "blogs", label: "Blogs", entries: fullBlogs, description: "Commentary, essays, book reviews, interviews, and video presentations." },
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
