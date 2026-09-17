import { profile } from "../data/profile";
import { ArrowUpRightIcon } from "./ArrowIcons";

export function ContactFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="footer-inner">
        <div className="footer-intro">
          <h2>Contact</h2>
        </div>

        <div className="footer-contact-grid">
          <section className="footer-contact-item" aria-labelledby="footer-email-label">
            <p id="footer-email-label">Email</p>
            <a href={`mailto:${profile.email}`}>
              <span>{profile.email}</span>
              <ArrowUpRightIcon />
            </a>
          </section>

          <section className="footer-contact-item" aria-labelledby="footer-office-label">
            <p id="footer-office-label">
              Office address <span>Optional</span>
            </p>
            <address className="office-placeholder">
              {profile.officeAddress.length > 0
                ? profile.officeAddress.map((line) => <span key={line}>{line}</span>)
                : "To be added"}
            </address>
          </section>
        </div>

        <div className="footer-meta">
          <span>{profile.institution}</span>
          <span>Academic profile · 2026</span>
        </div>
      </div>
    </footer>
  );
}
