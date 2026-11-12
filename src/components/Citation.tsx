import type { CitationSegment } from "../data/archive";

export function Citation({ segments }: { segments: CitationSegment[] }) {
  return <>{segments.map((segment, index) => {
    const content = segment.italic ? <cite>{segment.text}</cite> : segment.text;
    return segment.href
      ? <a key={index} href={segment.href} target="_blank" rel="noreferrer">{content}</a>
      : <span key={index}>{content}</span>;
  })}</>;
}
