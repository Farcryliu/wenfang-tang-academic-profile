import { useEffect, useRef, useState } from "react";
import { getArchiveCategories, archiveHref, homeHref, type ArchiveCategory } from "../data/archive";
import { useSiteContent } from "../SiteContentContext";

type HeaderProps = {
  activeSection: string;
  category: ArchiveCategory | null;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: () => void;
};

export function Header({ activeSection, category, menuOpen, onToggleMenu, onNavigate }: HeaderProps) {
  const { archive, layout } = useSiteContent();
  const archiveCategories = getArchiveCategories(archive);
  const [publicationsOpen, setPublicationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navigate = () => { setPublicationsOpen(false); onNavigate(); };

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setPublicationsOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return <header className={category ? "site-header" : "site-header site-header-home"}>
    <a className="wordmark" href={category ? homeHref() : "#home"} aria-label="Wenfang Tang, home" onClick={navigate}>
      <span className="wordmark-en">Wenfang Tang</span><span className="wordmark-cn">唐文方</span>
    </a>
    <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-nav"
      onClick={() => { setPublicationsOpen(false); onToggleMenu(); }}>
      <span /><span /><span /><span className="sr-only">{menuOpen ? "Close navigation" : "Open navigation"}</span>
    </button>
    <nav id="site-nav" className={`site-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
      {layout.sectionOrder.map((id) => id !== "publications" ? (
        <a key={id} href={category ? homeHref(id) : `#${id}`} className={!category && activeSection === id ? "active" : undefined} onClick={navigate}>
          {id === "about" ? "About" : "Experience"}
        </a>
      ) : <div key={id} className="nav-publications" ref={dropdownRef} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPublicationsOpen(false);
      }} onKeyDown={(event) => {
        if (event.key === "Escape") { setPublicationsOpen(false); toggleRef.current?.focus(); }
      }}>
        <div className="nav-publications-label">
          <a href={category ? homeHref("publications") : "#publications"} className={category || activeSection === "publications" ? "active" : undefined} onClick={navigate}>Publications</a>
          <button ref={toggleRef} type="button" className="nav-publications-toggle" aria-expanded={publicationsOpen}
            aria-controls="publication-nav" aria-label="Browse full publication lists" onClick={() => setPublicationsOpen((open) => !open)}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </button>
        </div>
        <div id="publication-nav" className="nav-publications-menu" hidden={!publicationsOpen}>
          {archiveCategories.map((item) => <a key={item.id} href={archiveHref(item.id)} aria-current={category === item.id ? "page" : undefined} onClick={navigate}>
            <span>{item.label}</span><span>{item.entries.length}</span>
          </a>)}
        </div>
      </div>)}
    </nav>
  </header>;
}
