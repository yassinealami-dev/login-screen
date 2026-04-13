import React, { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

export default function AppNavbar({ isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setMobileOpen(false);

  const goToSection = (sectionId) => {
    closeMenu();

    if (location.pathname !== "/") {
      navigate("/");

      window.setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);

      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand__mark">A</span>
          <span className="brand__text">
            <strong>Alami Recepten</strong>
            <small>Warm, modern en smaakvol</small>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Menu openen"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav ${mobileOpen ? "is-open" : ""}`}>
          <NavLink to="/" className="site-nav__link" onClick={closeMenu}>
            Home
          </NavLink>

          <button
            type="button"
            className="site-nav__link site-nav__button"
            onClick={() => goToSection("categories")}
          >
            Categorieën
          </button>

          <button
            type="button"
            className="site-nav__link site-nav__button"
            onClick={() => goToSection("recipes")}
          >
            Recepten
          </button>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-account"
                className="site-nav__link"
                onClick={closeMenu}
              >
                Mijn account
              </NavLink>

              <button
                type="button"
                className="button button--ghost button--sm"
                onClick={() => {
                  closeMenu();
                  onLogout();
                }}
              >
                Uitloggen
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="site-nav__link"
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/create-account"
                className="button button--primary button--sm"
                onClick={closeMenu}
              >
                Account maken
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}