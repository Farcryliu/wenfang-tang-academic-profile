import {
  articlesAndChapters,
  booksAndEditedVolumes,
  selectedPublications,
  type Publication,
} from "../../data/publications";
import { PublicationPreviewCard } from "../PublicationPreviewCard";
import { SectionShell } from "../SectionShell";

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
      {publication.citation.map((segment, index) => {
        const content = segment.italic ? <em>{segment.text}</em> : segment.text;

        if (segment.href) {
          return (
            <a key={index} href={segment.href} target="_blank" rel="noreferrer">
              {content}
            </a>
          );
        }

        return <span key={index}>{content}</span>;
      })}
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

function PublicationGroup({
  title,
  publications,
}: {
  title: string;
  publications: Publication[];
}) {
  return (
    <details className="publication-group">
      <summary>
        <span>{title}</span>
        <span className="publication-count">
          {publications.length} entries <b aria-hidden="true">+</b>
        </span>
      </summary>
      <CitationList publications={publications} />
    </details>
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

      {activePublication ? (
        <div className="publication-preview-mobile">
          <PublicationPreviewCard key={activePublication.id} publication={activePublication} />
        </div>
      ) : null}

      <div className="publication-archive">
        <p className="archive-heading">Complete publication list</p>
        <PublicationGroup title="Books and edited volumes" publications={booksAndEditedVolumes} />
        <PublicationGroup title="Articles and book chapters" publications={articlesAndChapters} />
      </div>
    </SectionShell>
  );
}
