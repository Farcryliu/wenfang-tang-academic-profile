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
          <div className="footer-contact-methods">
            <section className="footer-contact-item" aria-labelledby="footer-phone-label">
              <p id="footer-phone-label">Phone</p>
              <a href={`tel:${profile.phone}`}>
                <span>{profile.phone}</span>
                <ArrowUpRightIcon />
              </a>
            </section>

            <section className="footer-contact-item" aria-labelledby="footer-email-label">
              <p id="footer-email-label">Email</p>
              <a href={`mailto:${profile.email}`}>
                <span>{profile.email}</span>
                <ArrowUpRightIcon />
              </a>
            </section>
          </div>

          <section className="footer-contact-item" aria-labelledby="footer-office-label">
            <p id="footer-office-label">Office address</p>
            <address className="office-address">
              <span>{profile.officeAddress.room}</span>
              <span>{profile.institution}</span>
              <span>{profile.officeAddress.street}</span>
            </address>
          </section>
        </div>
      </div>
    </footer>
  );
}
