import React from "react";
import { resolveImageUrl } from "../lib/resolveImageUrl";

export default function RecipeCard({ recipe }) {
  const time = recipe.time || "Nog niet ingevuld";
  const difficulty = recipe.difficulty || "Nog niet ingevuld";
  const category = recipe.category_slug || recipe.category || "Recept";

  return (
    <article className="recipe-card">
      <div className="recipe-card__imageWrap">
        <img
          src={resolveImageUrl(recipe.image)}
          alt={recipe.title}
          className="recipe-card__image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = `${import.meta.env.BASE_URL}img/placeholder.jpg`;
          }}
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