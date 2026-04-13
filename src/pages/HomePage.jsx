import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient.js";
import { resolveImageUrl } from "../lib/resolveImageUrl";
import PopularSlider from "../components/PopularSlider.jsx";
import RecipeCard from "../components/RecipeCard.jsx";

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export default function HomePage({ isAuthenticated }) {
  const [categories, setCategories] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const loadHomeData = async () => {
      if (!supabase) {
        setPageError(
          "Supabase is momenteel niet beschikbaar op deze live versie."
        );
        setLoadingPage(false);
        return;
      }

      try {
        setLoadingPage(true);
        setPageError("");

        const [
          { data: categoriesData, error: categoriesError },
          { data: recipesData, error: recipesError },
        ] = await Promise.all([
          supabase.from("categories").select("*").order("id", { ascending: true }),
          supabase.from("recipes").select("*").order("id", { ascending: true }),
        ]);

        if (categoriesError) throw categoriesError;
        if (recipesError) throw recipesError;

        setCategories(categoriesData || []);
        setRecipes(recipesData || []);
      } catch (error) {
        setPageError(
          error.message || "Er ging iets mis bij het laden van de homepage."
        );
      } finally {
        setLoadingPage(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredRecipes = useMemo(() => {
    const selected = recipes.filter((recipe) => recipe.is_featured);

    return (selected.length ? selected : recipes).slice(0, 4).map((recipe, index) => ({
      id: recipe.id,
      badge:
        index === 0
          ? "Vandaag populair"
          : index === 1
          ? "Chef selectie"
          : index === 2
          ? "Smaakmaker"
          : "Aanrader",
      title: recipe.title,
      description: recipe.description || "Vers recept uit jouw database.",
      image: recipe.image,
    }));
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    if (activeCategory === "all") {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const recipeSlug = normalizeSlug(recipe.category_slug || recipe.category);
      return recipeSlug === activeCategory;
    });
  }, [recipes, activeCategory]);

  const heroStats = useMemo(
    () => [
      {
        label: "Live recepten",
        value: recipes.length || 0,
      },
      {
        label: "Categorieën",
        value: categories.length || 0,
      },
    ],
    [recipes.length, categories.length]
  );

  return (
    <main className="page page--home">
      <section className="hero-home">
        <div className="hero-home__content">
          <span className="eyebrow">Premium receptenplatform</span>

          <h1>
            Warm design,
            <br />
            sterke sfeer
            <br />
            en live recepten.
          </h1>

          <p>
            Je homepage haalt nu echte categorieën en recepten op uit Supabase.
            Daarom bouwen we de uitstraling rond jouw echte content: premium,
            levendig, duidelijk en klaar om later door te groeien naar een
            serieus food concept.
          </p>

          <div className="hero-home__actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() => scrollToSection("recipes")}
            >
              Bekijk recepten
            </button>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => scrollToSection("categories")}
            >
              Ontdek categorieën
            </button>

            <Link
              to={isAuthenticated ? "/my-account" : "/create-account"}
              className="button button--soft"
            >
              {isAuthenticated ? "Naar mijn account" : "Account aanmaken"}
            </Link>
          </div>

          <div className="hero-home__stats">
            {heroStats.map((item) => (
              <div key={item.label} className="hero-stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-home__visual">
          {featuredRecipes.length > 0 ? (
            <PopularSlider slides={featuredRecipes} />
          ) : (
            <div className="empty-card">
              <h3>Nog geen uitgelichte recepten</h3>
              <p>
                Voeg recepten toe in Supabase en ze verschijnen hier automatisch.
              </p>
            </div>
          )}
        </div>
      </section>

      {pageError ? (
        <section className="section">
          <div className="callout callout--error">
            <div>
              <h3>Homepage kon niet geladen worden</h3>
              <p>{pageError}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" id="categories">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Structuur & overzicht</span>
          <h2>Huiselijke categorieën</h2>
          <p>Navigeer door de cards om direct te filteren.</p>
        </div>

        {loadingPage ? (
          <div className="callout">
            <div>
              <h3>Categorieën laden...</h3>
              <p>We halen de categorieën live op uit Supabase.</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="callout">
            <div>
              <h3>Nog geen categorieën gevonden</h3>
              <p>Voeg categorieën toe aan je database om ze hier te tonen.</p>
            </div>
          </div>
        ) : (
          <div className="category-grid">
            {categories.map((category) => {
              const categorySlug = normalizeSlug(category.slug || category.title);
              const recipeCount = recipes.filter(
                (recipe) =>
                  normalizeSlug(recipe.category_slug || recipe.category) === categorySlug
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  className={`category-card ${
                    activeCategory === categorySlug ? "is-active" : ""
                  }`}
                  onClick={() => {
                    setActiveCategory(categorySlug);
                    scrollToSection("recipes");
                  }}
                >
                  <div className="category-card__imageWrap">
                    <img
                      src={resolveImageUrl(category.image)}
                      alt={category.title}
                      className="category-card__image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = `${import.meta.env.BASE_URL}img/placeholder.jpg`;
                      }}
                    />
                  </div>

                  <div className="category-card__body">
                    <div className="category-card__top">
                      <h3>{category.title}</h3>
                      <span>{recipeCount} recepten</span>
                    </div>
                    <p>{category.description || "Beschrijving volgt later."}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="section" id="recipes">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Live content</span>
          <h2>Recepten die echt uit je database komen</h2>
          <p>
            De filters zijn logisch gehouden en de styling is rustiger, warmer en
            meer premium gemaakt.
          </p>
        </div>

        <div className="filter-bar">
          <button
            type="button"
            className={`filter-pill ${activeCategory === "all" ? "is-active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            Alles
          </button>

          {categories.map((category) => {
            const categorySlug = normalizeSlug(category.slug || category.title);

            return (
              <button
                key={category.id}
                type="button"
                className={`filter-pill ${
                  activeCategory === categorySlug ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory(categorySlug)}
              >
                {category.title}
              </button>
            );
          })}
        </div>

        {loadingPage ? (
          <div className="callout">
            <div>
              <h3>Recepten laden...</h3>
              <p>Even geduld, we halen je recepten live op.</p>
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="callout">
            <div>
              <h3>Geen recepten in deze categorie</h3>
              <p>Kies een andere filter of voeg extra recepten toe in Supabase.</p>
            </div>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="cta-banner">
          <div>
            <span className="cta-banner__eyebrow">Volgende logische stap</span>
            <h3>Bouw rustig verder op deze basis</h3>
            <p>
              Deze structuur is nu klaar voor recept-detailpagina’s, ebook-flow,
              favorieten, bestellingen en betaalmogelijkheden.
            </p>
          </div>

          <Link
            to={isAuthenticated ? "/my-account" : "/login"}
            className="button button--primary"
          >
            {isAuthenticated ? "Open mijn account" : "Login / account"}
          </Link>
        </div>
      </section>
    </main>
  );
}