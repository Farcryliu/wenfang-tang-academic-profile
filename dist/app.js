const sections = [...document.querySelectorAll(".story-section")];
const navLinks = [...document.querySelectorAll(".site-nav a")];
const indexCurrent = document.querySelector(".index-current");
const progress = document.querySelector(".scroll-progress span");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      const sectionId = entry.target.id;
      const index = entry.target.dataset.index;

      if (indexCurrent) indexCurrent.textContent = index;
      navLinks.forEach((link) => {
        const active = link.dataset.section === sectionId;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-28% 0px -52% 0px", threshold: 0.08 }
);

sections.forEach((section) => sectionObserver.observe(section));

const updateProgress = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? window.scrollY / available : 0;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

menuToggle.addEventListener("click", () => {
  const open = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});
