import {
  articlesAndChapters,
  booksAndEditedVolumes,
  selectedPublications,
  type Publication,
} from "../../data/publications";
import { SectionShell } from "../SectionShell";

function CitationEntry({ publication }: { publication: Publication }) {
  return (
    <li className="citation-entry">
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

function CitationList({ publications }: { publications: Publication[] }) {
  return (
    <ol className="citation-list">
      {publications.map((publication) => (
        <CitationEntry key={publication.id} publication={publication} />
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

export function PublicationsSection({ visible }: { visible: boolean }) {
  return (
    <SectionShell
      id="publications"
      index="02"
      kicker="Publications"
      title="Selected Publications"
      visible={visible}
    >
      <CitationList publications={selectedPublications} />

      <div className="publication-archive">
        <p className="archive-heading">Complete publication list</p>
        <PublicationGroup title="Books and edited volumes" publications={booksAndEditedVolumes} />
        <PublicationGroup title="Articles and book chapters" publications={articlesAndChapters} />
      </div>
    </SectionShell>
  );
}
