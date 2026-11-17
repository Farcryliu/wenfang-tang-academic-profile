import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ContactFooter } from "./components/ContactFooter";
import { Header } from "./components/Header";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { AboutSection } from "./components/sections/AboutSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { PublicationsSection } from "./components/sections/PublicationsSection";
import { PublicationArchivePage } from "./components/PublicationArchivePage";
import { archiveLabels, currentArchiveCategory } from "./data/archive";
import { useSiteContent } from "./SiteContentContext";

const homeSections = {
  about: AboutSection,
  publications: PublicationsSection,
  experience: ExperienceSection,
};

function App() {
  const category = currentArchiveCategory();
  const { layout } = useSiteContent();
  const [firstSection, ...otherSections] = layout.sectionOrder;
  const FirstSection = homeSections[firstSection];
  const [activeSection, setActiveSection] = useState<string>(firstSection);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    document.title = category
      ? `${archiveLabels.find((item) => item.id === category)?.label} · Wenfang Tang 唐文方`
      : "Wenfang Tang 唐文方 · Academic Profile";
  }, [category]);

  useEffect(() => {
    if (category) return undefined;
    const section = window.location.hash.slice(1);
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: "instant" });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: 0.08 },
    );

    layout.sectionOrder.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [category, layout.sectionOrder]);

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

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <Header
        activeSection={activeSection}
        category={category}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onNavigate={() => setMenuOpen(false)}
      />

      {category ? <PublicationArchivePage category={category} /> : <main id="home" className="page-shell" style={{
        "--home-title-scale": layout.titleScale / 100,
        "--home-section-scale": layout.sectionScale / 100,
        "--home-body-scale": layout.bodyScale / 100,
      } as CSSProperties}>
        <div className="intro-layout">
          <ProfileSidebar />
          <FirstSection index="01" />
        </div>
        <div className="story-column">
          {otherSections.map((id, index) => {
            const Section = homeSections[id];
            return <Section key={id} index={String(index + 2).padStart(2, "0")} />;
          })}
        </div>
      </main>}

      <ContactFooter />
    </>
  );
}

export default App;
