import { useEffect } from "react";
import { ArrowUpRightIcon } from "./ArrowIcons";
import { Citation } from "./Citation";
import { getArchiveCategories, archiveHref, homeHref, type ArchiveCategory, type ArchiveEntry, type ArchiveLink, type BookEntry } from "../data/archive";
import { useSiteContent } from "../SiteContentContext";

function ResourceLinks({ links, belowBookNote = false }: { links: ArchiveLink[]; belowBookNote?: boolean }) {
  if (!links.length) return null;
  return <ul className={belowBookNote ? "archive-resource-links archive-book-note-links" : "archive-resource-links"}
    aria-label={belowBookNote ? "Book note links" : "Publication links"}>
    {links.map(({ label, href }) => <li key={href}>
      <a href={href} target="_blank" rel="noreferrer">{label}<ArrowUpRightIcon /></a>
    </li>)}
  </ul>;
}
function EntryNotes({ entry }: { entry: ArchiveEntry }) {
  if (!entry.notes?.length) return null;
  return <div className="archive-entry-notes">
    {entry.notes.map((note, index) => <div key={index}>
      <p>{note.text}</p><ResourceLinks links={note.links} />
    </div>)}
  </div>;
}
function BookList({ books }: { books: BookEntry[] }) {
  return <ol className="archive-book-list">
    {books.map((book) => <li key={book.id} id={book.id} className={`archive-book-entry${book.cover ? "" : " archive-book-entry-no-cover"}`}>
      {book.cover && <a className="archive-book-cover" href={book.amazonUrl || undefined} target="_blank" rel="noreferrer"
        aria-label={`${book.amazonSearch ? "Search Amazon for" : "View on Amazon:"} ${book.title}`}>
        <img src={`${import.meta.env.BASE_URL}${book.cover}`} alt={`Cover of ${book.title}`} loading="lazy" />
      </a>}
      <div className="archive-book-copy">
        <span className="archive-entry-year">{book.year}</span>
        <p className="archive-citation"><Citation segments={book.citation} /></p>
        {book.note ? <p className="archive-book-note">{book.note}</p> : null}
        {book.noteLinks && <ResourceLinks links={book.noteLinks} belowBookNote />}
        <ResourceLinks links={book.amazonUrl ? [{ label: book.amazonSearch ? "Search on Amazon" : "View on Amazon", href: book.amazonUrl }, ...book.links] : book.links} />
      </div>
    </li>)}
  </ol>;
}
function TextArchive({ entries }: { entries: readonly ArchiveEntry[] }) {
  const years = [...new Set(entries.map((entry) => entry.year))].sort((a, b) => (b ?? 0) - (a ?? 0));
  return <>
    <nav className="archive-year-index" aria-label="Browse by year">
      {years.map((year) => <a key={year ?? "undated"} href={`#year-${year ?? "undated"}`}>{year ?? "Undated"}</a>)}
    </nav>
    {years.map((year) => <section key={year ?? "undated"} id={`year-${year ?? "undated"}`} className="archive-year-group">
      <h2>{year ?? "Undated"}</h2>
      <ol className="archive-text-list">
        {entries.filter((entry) => entry.year === year).map((entry) => <li key={entry.id} id={entry.id}>
          <p className="archive-citation"><Citation segments={entry.citation} /></p>
          <ResourceLinks links={entry.links} />
          <EntryNotes entry={entry} />
        </li>)}
      </ol>
    </section>)}
  </>;
}
export function PublicationArchivePage({ category }: { category: ArchiveCategory }) {
  const { archive } = useSiteContent();
  const archiveCategories = getArchiveCategories(archive);
  const current = archiveCategories.find((item) => item.id === category)!;
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "instant" });
  }, [category]);

  return <main id="home" className="archive-page">
    <aside className="archive-sidebar">
      <a className="archive-back" href={homeHref("publications")}><span aria-hidden="true">←</span> Publication list</a>
      <p className="section-kicker">Publications</p>
      <nav aria-label="Publication categories">
        {archiveCategories.map((item) => <a key={item.id} href={archiveHref(item.id)}
          aria-current={item.id === category ? "page" : undefined}>
          <span>{item.label}</span><span>{String(item.entries.length).padStart(2, "0")}</span>
        </a>)}
      </nav>
    </aside>
    <div className="archive-content">
      <header className="archive-page-heading">
        <p className="section-kicker">Complete publication list</p>
        <h1>{current.label}</h1>
        {category !== "blogs" && <span className="archive-total">{current.entries.length} entries</span>}
      </header>
      {category === "books" ? <BookList books={archive.books} />
        : category === "edited-volumes" ? <BookList books={archive.editedVolumes} />
        : <TextArchive entries={current.entries} />}
      <a className="archive-back archive-return" href={homeHref("publications")}><span aria-hidden="true">←</span> Back to Publication list</a>
    </div>
  </main>;
}
