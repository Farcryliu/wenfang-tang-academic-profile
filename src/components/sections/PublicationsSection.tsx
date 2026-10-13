import { useEffect } from "react";
import {
  selectedPublications,
  type Publication,
} from "../../data/publications";
import { PublicationPreviewCard } from "../PublicationPreviewCard";
import { SectionShell } from "../SectionShell";
import { Citation } from "../Citation";
import { ArrowUpRightIcon } from "../ArrowIcons";
import { archiveCategories, archiveHref } from "../../data/archive";

function CitationEntry({
  publication,
  active,
  onPreview,
}: {
  publication: Publication;
  active?: boolean;
  onPreview?: (publication: Publication) => void;
}) {
  const canPreview = Boolean(publication.preview && onPreview);

  return (
    <li
      className={`citation-entry${canPreview ? " has-preview" : ""}${active ? " is-active" : ""}`}
      tabIndex={canPreview ? 0 : undefined}
      onMouseEnter={canPreview ? () => onPreview?.(publication) : undefined}
      onFocus={canPreview ? () => onPreview?.(publication) : undefined}
      onClick={canPreview ? () => onPreview?.(publication) : undefined}
      onKeyDown={
        canPreview
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onPreview?.(publication);
              }
            }
          : undefined
      }
      aria-label={canPreview ? `Show details for ${publication.preview?.title}` : undefined}
    >
      <Citation segments={publication.citation} />

      {active && publication.preview ? (
        <div
          id={`publication-preview-${publication.id}`}
          className="publication-preview-mobile"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <PublicationPreviewCard key={publication.id} publication={publication} />
        </div>
      ) : null}
    </li>
  );
}

function CitationList({
  publications,
  activePublication,
  onPreview,
}: {
  publications: Publication[];
  activePublication?: Publication | null;
  onPreview?: (publication: Publication) => void;
}) {
  return (
    <ol className="citation-list">
      {publications.map((publication) => (
        <CitationEntry
          key={publication.id}
          publication={publication}
          active={publication.id === activePublication?.id}
          onPreview={onPreview}
        />
      ))}
    </ol>
  );
}

export function PublicationsSection({
  visible,
  activePublication,
  onPreview,
}: {
  visible: boolean;
  activePublication: Publication | null;
  onPreview: (publication: Publication) => void;
}) {
  useEffect(() => {
    if (!activePublication || !window.matchMedia("(max-width: 980px)").matches) return;

    const frame = window.requestAnimationFrame(() => {
      const preview = document.getElementById(`publication-preview-${activePublication.id}`);
      preview?.scrollIntoView({ behavior: "auto", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activePublication]);

  return (
    <SectionShell
      id="publications"
      index="02"
      kicker="Publications"
      title="Selected Publications"
      visible={visible}
    >
      <CitationList
        publications={selectedPublications}
        activePublication={activePublication}
        onPreview={onPreview}
      />

      <div className="publication-archive">
        <p className="archive-heading">Complete publication list</p>
        <nav className="archive-category-links" aria-label="Complete publication lists">
          {archiveCategories.map((category) => <a key={category.id} href={archiveHref(category.id)}>
            <span>Full {category.label}</span>
            <span className="archive-category-count">{category.entries.length} entries <ArrowUpRightIcon /></span>
          </a>)}
        </nav>
      </div>
    </SectionShell>
  );
}
