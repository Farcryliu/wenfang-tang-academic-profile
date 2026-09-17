import {
  academicProjects,
  academicRoles,
  editorialRoles,
  type LeadershipRole,
} from "../../data/experience";
import { SectionShell } from "../SectionShell";

function LeadershipList({ items }: { items: LeadershipRole[] }) {
  return (
    <ul className="leadership-list">
      {items.map((item) => (
        <li key={`${item.role}-${item.title}`}>
          <span className="leadership-role">{item.role}</span>
          <div>
            <h4>{item.title}</h4>
            {item.organization && <p>{item.organization}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ExperienceSection({ visible }: { visible: boolean }) {
  return (
    <SectionShell
      id="experience"
      index="03"
      kicker="Experience"
      title="Positions"
      visible={visible}
    >
      <div className="timeline">
        {academicRoles.map((role) => (
          <article key={`${role.period}-${role.title}`}>
            <time>{role.period}</time>
            <div>
              <h3>{role.title}</h3>
              <p>{role.organization}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="experience-subsection" aria-labelledby="academic-projects-heading">
        <h3 id="academic-projects-heading">Leading Academic Projects</h3>
        <LeadershipList items={academicProjects} />
      </section>

      <section className="experience-subsection" aria-labelledby="editorial-roles-heading">
        <h3 id="editorial-roles-heading">Editorial &amp; Professional Roles</h3>
        <LeadershipList items={editorialRoles} />
      </section>
    </SectionShell>
  );
}
