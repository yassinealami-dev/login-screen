export function resolveImageUrl(imagePath) {
  if (!imagePath) {
    return `${import.meta.env.BASE_URL}img/placeholder.jpg`;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${import.meta.env.BASE_URL}${imagePath.replace(/^\/+/, "")}`;
}