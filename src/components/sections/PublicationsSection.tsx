import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionShell } from "../SectionShell";
import { ArrowUpRightIcon } from "../ArrowIcons";
import { archiveCategories, archiveHref, type ArchiveCategory } from "../../data/archive";

const desktopPreview = "(min-width: 981px)";

export function PublicationsSection({ visible }: { visible: boolean }) {
  const [openCategory, setOpenCategory] = useState<ArchiveCategory | null>(null);
  const openPanel = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = openPanel.current;
    const row = panel?.parentElement;
    if (!panel || !row) return;
    const desktop = window.matchMedia(desktopPreview);

    const positionPanel = () => {
      if (!desktop.matches) {
        panel.style.removeProperty("top");
        return;
      }
      const { top, height } = row.getBoundingClientRect();
      const header = document.querySelector(".site-header");
      const minTop = (header?.getBoundingClientRect().bottom ?? 0) + 12;
      const maxTop = window.innerHeight - panel.offsetHeight - 12;
      const centered = top + (height - panel.offsetHeight) / 2;
      const viewportTop = Math.max(minTop, Math.min(centered, maxTop));
      panel.style.top = `${viewportTop - top}px`;
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, { passive: true });
    return () => {
      panel.style.removeProperty("top");
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel);
    };
  }, [openCategory]);

  useEffect(() => {
    if (!openCategory) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const panel = openPanel.current;
      if (panel?.contains(document.activeElement)) {
        panel.parentElement?.querySelector("button")?.focus();
      }
      setOpenCategory(null);
    }

    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !openPanel.current?.parentElement?.contains(event.target)) {
        setOpenCategory(null);
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [openCategory]);

  return (
    <SectionShell
      id="publications"
      index="02"
      kicker="Publications"
      title="Publication list"
      visible={visible}
    >
      <nav className="archive-category-links" aria-label="Publication categories">
        {archiveCategories.map(({ id, label, entries }) => {
          const archive = archiveHref(id);
          const open = openCategory === id;
          const panelId = `publication-list-${id}`;
          return (
            <div
              className="publication-category"
              key={id}
              onPointerLeave={(event) => {
                if (open && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
                  setOpenCategory(null);
                }
              }}
              onBlur={(event) => {
                if (open && !event.currentTarget.contains(event.relatedTarget)) setOpenCategory(null);
              }}
            >
              <div className="publication-category-row">
                <a
                  href={archive}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse" && window.matchMedia(desktopPreview).matches) {
                      setOpenCategory(id);
                    }
                  }}
                >
                  {label}
                  <ArrowUpRightIcon />
                </a>
                <button
                  className="publication-preview-toggle"
                  type="button"
                  aria-label={`Browse ${label} titles`}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => setOpenCategory(open ? null : id)}
                >
                  Browse
                </button>
              </div>
              <div
                className="publication-preview"
                id={panelId}
                ref={open ? openPanel : undefined}
                hidden={!open}
              >
                {open && (
                  <div className="publication-preview-card">
                    <p className="publication-preview-heading">
                      {label} <span>{entries.length}</span>
                    </p>
                    <ul className="publication-preview-list" aria-label={`${label} titles`}>
                      {entries.map(({ id: entryId, title, year }) => (
                        <li key={entryId}>
                          <a href={`${archive}#${entryId}`}>
                            <span>{title}</span>
                            {year && <span className="publication-preview-year">{year}</span>}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </nav>
    </SectionShell>
  );
}
