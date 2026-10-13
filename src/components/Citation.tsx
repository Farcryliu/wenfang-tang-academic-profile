import type { CitationSegment } from "../data/publications";

export function Citation({ segments }: { segments: CitationSegment[] }) {
  return <>{segments.map((segment, index) => {
    const content = segment.italic ? <em>{segment.text}</em> : segment.text;
    return segment.href
      ? <a key={index} href={segment.href} target="_blank" rel="noreferrer">{content}</a>
      : <span key={index}>{content}</span>;
  })}</>;
}
