import { profile } from "../../data/profile";
import { ArrowUpRightIcon } from "../ArrowIcons";
import { SectionShell } from "../SectionShell";

export function ContactSection({ visible }: { visible: boolean }) {
  return (
    <SectionShell
      id="contact"
      index="04"
      kicker="Get in touch"
      title="Contact"
      visible={visible}
      className="contact-section"
    >
      <p className="lead">
        School of Humanities and Social Science
        <br />
        {profile.institution}
      </p>
      <a className="email-link" href={`mailto:${profile.email}`}>
        {profile.email}
        <ArrowUpRightIcon />
      </a>
    </SectionShell>
  );
}
