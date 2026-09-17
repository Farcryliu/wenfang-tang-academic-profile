import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  visible: boolean;
  className?: string;
  children: ReactNode;
};

export function SectionShell({ id, index, kicker, title, visible, className = "", children }: SectionShellProps) {
  const classes = ["story-section", className, visible ? "is-visible" : ""].filter(Boolean).join(" ");

  return (
    <section id={id} className={classes} data-index={index}>
      <div className="section-number" aria-hidden="true">
        {index}
      </div>
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
