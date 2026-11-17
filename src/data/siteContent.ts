import archive from "./archive.json" with { type: "json" };
import biography from "./biography.json" with { type: "json" };
import layout from "./layout.json" with { type: "json" };
import { defaultExperience, type ExperienceData } from "./experience.ts";
import type { ArchiveData } from "./archive.ts";

export const sectionIds = ["about", "publications", "experience"] as const;
export type SectionId = typeof sectionIds[number];

export type HomeLayout = {
  sectionOrder: SectionId[];
  titleScale: number;
  sectionScale: number;
  bodyScale: number;
};

export type SiteContent = {
  biography: string;
  archive: ArchiveData;
  experience: ExperienceData;
  layout: HomeLayout;
};

export const defaultSiteContent: SiteContent = {
  biography: biography.biography,
  archive,
  experience: defaultExperience,
  layout: { ...layout, sectionOrder: layout.sectionOrder as SectionId[] },
};

export function biographyParagraphs(biography: string) {
  return biography.split(/\r?\n(?:[ \t]*\r?\n)+/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
