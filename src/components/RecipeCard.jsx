import React from "react";

export default function RecipeCard({ recipe }) {
  const time = recipe.time || "Nog niet ingevuld";
  const difficulty = recipe.difficulty || "Nog niet ingevuld";
  const category = recipe.category_slug || recipe.category || "Recept";

  return (
    <article className="recipe-card">
      <div className="recipe-card__imageWrap">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card__image"
          loading="lazy"
        />
        <span className="recipe-card__badge">{category}</span>
      </div>

      <div className="recipe-card__body">
        <h3>{recipe.title}</h3>
        <p>{recipe.description || "Beschrijving volgt later."}</p>

        <div className="recipe-card__meta">
          <span>⏱ {time}</span>
          <span>🔥 {difficulty}</span>
        </div>
      </div>
    </article>
  );
}