import React, { useEffect, useState } from "react";

export default function PopularSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides?.length) return undefined;

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [slides]);

  if (!slides?.length) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="popular-slider">
      <div className="popular-slider__viewport">
        <div
          className="popular-slider__track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div className="popular-slide" key={slide.id}>
              <img
                src={slide.image}
                alt={slide.title}
                className="popular-slide__image"
              />

              <div className="popular-slide__overlay">
                <span className="popular-slide__badge">{slide.badge}</span>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              className="popular-slider__arrow popular-slider__arrow--left"
              onClick={goToPrevious}
              aria-label="Vorige slide"
            >
              ‹
            </button>

            <button
              type="button"
              className="popular-slider__arrow popular-slider__arrow--right"
              onClick={goToNext}
              aria-label="Volgende slide"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="popular-slider__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`popular-slider__dot ${
                currentIndex === index ? "is-active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Ga naar slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}