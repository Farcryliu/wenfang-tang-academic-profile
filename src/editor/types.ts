import type { ArchiveData, ArchiveEntry } from "../data/archive";
import type { HomeLayout, SiteContent } from "../data/siteContent";

export type PublicationCategory = keyof ArchiveData;

export type PublicationChange = {
  action: "add" | "edit" | "remove";
  category: PublicationCategory;
  id: string | null;
  title: string | null;
  year: number | null;
  citation: string | null;
  sourceUrl: string | null;
};

export type EditChanges = {
  biography: string | null;
  layout: HomeLayout | null;
  publication: PublicationChange | null;
};

export type SiteVersion = { revision: string; content: SiteContent };

export type EditorSession = SiteVersion & {
  editor: string;
  demo: boolean;
  siteUrl: string;
};

export type PreviewTarget = { category: PublicationCategory; id: string | null };

export type ChangesPreview = {
  content: SiteContent;
  summary: string[];
  target: PreviewTarget | null;
  publication: ArchiveEntry | null;
};

export type EditResult =
  | { question: string }
  | ({ ticket: string } & ChangesPreview);

export type PublishResult = SiteVersion & { deploymentUrl?: string };
export type Deployment = { status: "waiting" | "running" | "live" | "failed" | "cancelled"; url?: string };
