import type { Publication } from "../data/publications";
import { ArrowUpRightIcon } from "./ArrowIcons";

export function PublicationPreviewCard({ publication }: { publication: Publication }) {
  const preview = publication.preview;
  if (!preview) return null;

  return (
    <article className="publication-preview-card" aria-live="polite">
      <a
        className="publication-preview-card__title"
        href={preview.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${preview.title}`}
      >
        <span className="publication-preview-card__type">{preview.type}</span>
        <h3>{preview.title}</h3>
        <ArrowUpRightIcon />
      </a>

      <div className="publication-preview-card__body">
        <figure>
          <img src={`${import.meta.env.BASE_URL}${preview.image}`} alt={preview.imageAlt} />
        </figure>
        <div className="publication-preview-card__introduction">
          <p className="publication-preview-card__label">Introduction</p>
          <p>{preview.introduction}</p>
        </div>
      </div>
    </article>
  );
}
