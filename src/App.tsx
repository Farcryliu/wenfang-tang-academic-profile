import { useEffect, useRef, useState } from "react";
import { ContactFooter } from "./components/ContactFooter";
import { Header } from "./components/Header";
import { PublicationPreviewCard } from "./components/PublicationPreviewCard";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { selectedPublications, type Publication } from "./data/publications";
import { AboutSection } from "./components/sections/AboutSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { PublicationsSection } from "./components/sections/PublicationsSection";

const sectionIds = ["about", "publications", "experience"] as const;

function App() {
  const [activeSection, setActiveSection] = useState<string>("about");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(() => new Set(["about"]));
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePublication, setActivePublication] = useState<Publication | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionId = entry.target.id;
          setActiveSection(sectionId);
          setVisibleSections((previous) => {
            if (previous.has(sectionId)) return previous;
            const next = new Set(previous);
            next.add(sectionId);
            return next;
          });
        });
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: 0.08 },
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeSection !== "publications") setActivePublication(null);
  }, [activeSection]);

  useEffect(() => {
    selectedPublications.forEach(({ preview }) => {
      if (!preview) return;
      const image = new Image();
      image.src = `${import.meta.env.BASE_URL}${preview.image}`;
    });

    const publicationsSection = document.getElementById("publications");
    if (!publicationsSection) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setActivePublication(null);
      },
      { threshold: 0.01 },
    );

    observer.observe(publicationsSection);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = available > 0 ? window.scrollY / available : 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <Header
        activeSection={activeSection}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onNavigate={() => setMenuOpen(false)}
      />

      <main id="home" className="page-shell">
        <div className="intro-layout">
          <ProfileSidebar />
          <AboutSection visible={isVisible("about")} />
        </div>
        <aside className="publication-preview-column" aria-label="Selected publication details">
          <div className="publication-preview-sticky">
            {activePublication ? (
              <PublicationPreviewCard key={activePublication.id} publication={activePublication} />
            ) : null}
          </div>
        </aside>
        <div className="story-column">
          <PublicationsSection
            visible={isVisible("publications")}
            activePublication={activePublication}
            onPreview={setActivePublication}
          />
          <ExperienceSection visible={isVisible("experience")} />
        </div>
      </main>

      <ContactFooter />
    </>
  );
}

export default App;
