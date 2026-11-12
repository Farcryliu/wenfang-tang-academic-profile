import { SectionShell } from "../SectionShell";
import { ArrowUpRightIcon } from "../ArrowIcons";
import { archiveCategories, archiveHref } from "../../data/archive";

export function PublicationsSection({ visible }: { visible: boolean }) {
  return (
    <SectionShell
      id="publications"
      index="02"
      kicker="Publications"
      title="Publication list"
      visible={visible}
    >
      <nav className="archive-category-links" aria-label="Publication categories">
        {archiveCategories.map((category) => (
          <a key={category.id} href={archiveHref(category.id)}>
            <span>{category.label}</span>
            <ArrowUpRightIcon />
          </a>
        ))}
      </nav>
    </SectionShell>
  );
}
