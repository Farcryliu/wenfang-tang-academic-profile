import { useSiteContent } from "../../SiteContentContext";
import { biographyParagraphs } from "../../data/siteContent";
import { SectionShell } from "../SectionShell";

export function AboutSection({ index }: { index: string }) {
  const { biography } = useSiteContent();
  return (
    <SectionShell
      id="about"
      index={index}
      kicker="Welcome"
      title="Biography"
      className="biography-section"
    >
      <div className="biography-copy">
        {biographyParagraphs(biography).map((paragraph, position) => (
          <p key={position}>{paragraph}</p>
        ))}
      </div>
    </SectionShell>
  );
}
