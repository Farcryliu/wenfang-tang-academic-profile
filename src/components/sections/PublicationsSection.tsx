import {
  articlesAndChapters,
  booksAndEditedVolumes,
  featuredPublications,
  selectedPublications,
  type FeaturedPublication,
  type Publication,
} from "../../data/publications";
import { SectionShell } from "../SectionShell";

function FeaturedPublicationCard({ publication }: { publication: FeaturedPublication }) {
  return (
    <article className="featured-publication-card">
      <figure className="featured-publication-cover">
        <img src={publication.cover} alt={publication.coverAlt} loading="lazy" />
      </figure>

      <div className="featured-publication-copy">
        <div className="featured-publication-meta">
          <span>Book</span>
          <time dateTime={publication.year}>{publication.year}</time>
        </div>
        <h3>{publication.title}</h3>
        <p className="featured-publication-subtitle">{publication.subtitle}</p>
        <div className="featured-publication-details">
          <p>{publication.authors}</p>
          <p>{publication.publisher}</p>
        </div>
      </div>
    </article>
  );
}

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
      <div className="featured-publications" aria-label="Featured books">
        {featuredPublications.map((publication) => (
          <FeaturedPublicationCard key={publication.id} publication={publication} />
        ))}
      </div>

      <div className="selected-articles">
        <p className="archive-heading">Selected articles</p>
        <CitationList publications={selectedPublications} />
      </div>

      <div className="publication-archive">
        <p className="archive-heading">Complete publication list</p>
        <PublicationGroup title="Books and edited volumes" publications={booksAndEditedVolumes} />
        <PublicationGroup title="Articles and book chapters" publications={articlesAndChapters} />
      </div>
    </SectionShell>
  );
}
