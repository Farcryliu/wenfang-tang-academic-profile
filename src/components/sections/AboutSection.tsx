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
        {profile.biography.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </SectionShell>
  );
}
