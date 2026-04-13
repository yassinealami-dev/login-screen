import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function AppNavbar({ isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => setMobileOpen(false);

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

          <a href="/#categories" className="site-nav__link" onClick={closeMenu}>
            Categorieën
          </a>

          <a href="/#recipes" className="site-nav__link" onClick={closeMenu}>
            Recepten
          </a>

          {isAuthenticated ? (
            <NavLink
              to="/my-account"
              className="site-nav__link"
              onClick={closeMenu}
            >
              Mijn account
            </NavLink>
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

          {isAuthenticated ? (
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
          ) : null}
        </nav>
      </div>
    </header>
  );
}