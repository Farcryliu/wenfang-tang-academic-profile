import { profile } from "../data/profile";

export function ProfileSidebar() {
  return (
    <aside className="profile-column" aria-label="Profile summary">
      <div className="profile-sticky">
        <figure className="portrait-wrap">
          <img src={profile.portrait} alt={profile.portraitAlt} width="1066" height="1600" />
          <figcaption>{profile.discipline}</figcaption>
        </figure>

        <div className="profile-identity">
          <h1>
            {profile.name} <span>{profile.nameChinese}</span>
          </h1>
          <p className="role">
            {profile.roleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
          <p className="eyebrow">{profile.institution}</p>
        </div>

        <div className="profile-links">
          <a href={`mailto:${profile.email}`}>Email</a>
          <a href={profile.universityProfile} target="_blank" rel="noreferrer">
            University profile
          </a>
        </div>

      </div>
    </aside>
  );
}
