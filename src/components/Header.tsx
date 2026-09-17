type HeaderProps = {
  activeSection: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: () => void;
};

const navigation = [
  ["about", "About"],
  ["publications", "Publications"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const;

export function Header({ activeSection, menuOpen, onToggleMenu, onNavigate }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="Wenfang Tang, home">
        <span className="wordmark-en">Wenfang Tang</span>
        <span className="wordmark-cn">唐文方</span>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="site-nav"
        onClick={onToggleMenu}
      >
        <span />
        <span />
        <span />
        <span className="sr-only">Open navigation</span>
      </button>

      <nav id="site-nav" className={`site-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
        {navigation.map(([section, label]) => (
          <a
            key={section}
            href={`#${section}`}
            data-section={section}
            className={activeSection === section ? "active" : undefined}
            aria-current={activeSection === section ? "page" : undefined}
            onClick={onNavigate}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
