import React from "react";

export default function AuthShell({
  badge = "Alami Recepten",
  title,
  description,
  highlights = [],
  children,
}) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand">
          <span className="brand-badge">{badge}</span>

          <h1>{title}</h1>
          <p>{description}</p>

          {highlights.length > 0 ? (
            <div className="brand-card">
              <h3>Waarom dit handig is</h3>

              <div className="brand-list">
                {highlights.map((item) => (
                  <div key={item} className="brand-list__item">
                    <span className="brand-list__dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="auth-panel">{children}</section>
      </div>
    </div>
  );
}