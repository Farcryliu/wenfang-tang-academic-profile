import { profile } from "../../data/profile";
import { SectionShell } from "../SectionShell";

export function AboutSection({ visible }: { visible: boolean }) {
  return (
    <SectionShell
      id="about"
      index="01"
      kicker="Welcome"
      title="Biography"
      visible={visible}
      className="biography-section"
    >
      <div className="biography-copy">
        {profile.biography.map((paragraph, paragraphIndex) => (
          <p key={paragraphIndex}>
            {paragraph.map((segment, segmentIndex) =>
              segment.emphasis ? (
                <em key={segmentIndex}>{segment.text}</em>
              ) : (
                <span key={segmentIndex}>{segment.text}</span>
              ),
            )}
          </p>
        ))}
      </div>
    </SectionShell>
  );
}
