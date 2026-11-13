import { useEffect, useRef, useState } from "react";
import { ContactFooter } from "./components/ContactFooter";
import { Header } from "./components/Header";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { AboutSection } from "./components/sections/AboutSection";
import { ExperienceSection } from "./components/sections/ExperienceSection";
import { PublicationsSection } from "./components/sections/PublicationsSection";
import { PublicationArchivePage } from "./components/PublicationArchivePage";
import { archiveCategories, currentArchiveCategory } from "./data/archive";

const sectionIds = ["about", "publications", "experience"] as const;

function App() {
  const category = currentArchiveCategory();
  const [activeSection, setActiveSection] = useState<string>("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    document.title = category
      ? `${archiveCategories.find((item) => item.id === category)?.label} · Wenfang Tang 唐文方`
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

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [category]);

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

      {category ? <PublicationArchivePage category={category} /> : <main id="home" className="page-shell">
        <div className="intro-layout">
          <ProfileSidebar />
          <AboutSection />
        </div>
        <div className="story-column">
          <PublicationsSection />
          <ExperienceSection />
        </div>
      </main>}

      <ContactFooter />
    </>
  );
}

export default App;
