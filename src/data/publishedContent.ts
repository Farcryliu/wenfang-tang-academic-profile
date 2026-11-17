import type { SiteContent } from "./siteContent";

export type PublishedContent = {
  biography?: string;
  archive?: Partial<SiteContent["archive"]>;
  experience?: Partial<SiteContent["experience"]>;
};

export function withPublishedContent(base: SiteContent, published: PublishedContent): SiteContent {
  return {
    ...base,
    biography: published.biography ?? base.biography,
    archive: published.archive ? { ...base.archive, ...published.archive } : base.archive,
    experience: published.experience ? { ...base.experience, ...published.experience } : base.experience,
  };
}
