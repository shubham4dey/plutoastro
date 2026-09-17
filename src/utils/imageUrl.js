// =====================================================
// IMAGE URL RESOLVER
// =====================================================
//
// Uploaded images now live on Cloudinary, so MongoDB stores a full
// absolute URL (https://res.cloudinary.com/...) that must be rendered
// as-is — never prefixed with the backend URL.
//
// Legacy records may still store a relative local path
// ("/uploads/astrologer-123.png"); those keep working by prefixing the
// environment-aware API base.
//
//   resolveImageUrl("https://res.cloudinary.com/x/upload/v1/a.jpg")
//     -> "https://res.cloudinary.com/x/upload/v1/a.jpg"   (unchanged)
//   resolveImageUrl("/uploads/astrologer-1.png")
//     -> "https://plutoastro-backend.onrender.com/uploads/astrologer-1.png"
//   resolveImageUrl("")
//     -> ""

export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL ||
      "https://plutoastro-backend.onrender.com";

export const resolveImageUrl = (image, fallback = "") => {
  if (!image || typeof image !== "string") {
    return fallback;
  }

  const value = image.trim();

  if (!value) {
    return fallback;
  }

  // Already absolute (Cloudinary, other CDN, data/blob preview) —
  // return untouched so Cloudinary URLs are never double-prefixed.
  if (/^(https?:)?\/\//i.test(value) || /^(data|blob):/i.test(value)) {
    return value.startsWith("//") ? `https:${value}` : value;
  }

  // Relative legacy path (e.g. /uploads/...) — resolve against the API.
  return `${API_BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
};

export default resolveImageUrl;
