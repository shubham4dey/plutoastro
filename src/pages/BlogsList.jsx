import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=800&h=600&fit=crop";

const formatDate = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "";
  }
};

// Environment-aware API base URL — same pattern as LatestBlogs.jsx
// Development: http://localhost:5000
// Production:  process.env.REACT_APP_API_URL (from .env.production) or Render
// NODE_ENV is checked FIRST so the root .env's REACT_APP_API_URL (Render)
// can never hijack local development requests.
const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL ||
      "https://plutoastro-backend.onrender.com";

const BlogsList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);

      const response = await fetch(
        `${API_BASE}/api/blogs?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const blogsData = Array.isArray(data)
        ? data
        : data.blogs && Array.isArray(data.blogs)
        ? data.blogs
        : [];

      setBlogs(blogsData);
    } catch (err) {
      console.error("❌ Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, category]);

  // =====================================================
  // DERIVED — unique categories for the filter chips
  // =====================================================

  const categories = [...new Set(blogs.map((b) => b.category).filter(Boolean))];

  // =====================================================
  // SKELETON CARD
  // =====================================================

  const SkeletonCard = () => (
    <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden animate-pulse">
      <div className="h-52 lg:h-60 bg-purple-900/40"></div>

      <div className="p-5 lg:p-6 space-y-3">
        <div className="h-4 bg-purple-800/40 rounded w-1/3"></div>

        <div className="h-6 bg-purple-800/50 rounded w-3/4"></div>

        <div className="h-4 bg-purple-800/30 rounded w-full"></div>

        <div className="h-4 bg-purple-800/30 rounded w-2/3"></div>
      </div>
    </div>
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0b0416] via-[#150829] to-[#0b0416] py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="text-center mb-10 lg:mb-14">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">
            Astrology{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
              Blogs
            </span>
          </h1>

          <p className="text-purple-200/60 max-w-2xl mx-auto">
            Insights, guidance and cosmic wisdom from the PlutoAstro team.
          </p>
        </div>

        {/* ================= SEARCH + CATEGORY ================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
          <div className="relative w-full lg:max-w-md">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-purple-300/60"></i>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-purple-900/20 border border-purple-700/40 text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  category === ""
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40"
                    : "bg-purple-900/30 text-purple-200/70 border border-purple-700/40 hover:border-purple-500/60"
                }`}
              >
                All
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    category === cat
                      ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/40"
                      : "bg-purple-900/30 text-purple-200/70 border border-purple-700/40 hover:border-purple-500/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="text-center py-20">
            <i className="ri-error-warning-line text-5xl text-red-400/70"></i>

            <p className="text-purple-200/60 mt-4">{error}</p>
          </div>
        )}

        {/* ================= LOADING ================= */}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20">
            <i className="ri-article-line text-6xl text-purple-500/40"></i>

            <h3 className="text-xl font-semibold text-white mt-4">
              No blogs found
            </h3>

            <p className="text-purple-200/50 mt-2">
              {search || category
                ? "Try a different search or category."
                : "Check back soon for new articles."}
            </p>
          </div>
        )}

        {/* ================= BLOG GRID ================= */}

        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="group bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-900/50 transition-all duration-300 flex flex-col"
              >
                {/* ================= IMAGE ================= */}

                <div className="relative h-52 lg:h-60 overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={blog.featuredImage}
                      alt={blog.title || "Blog"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700/50 to-fuchsia-700/40">
                      <i className="ri-article-line text-5xl text-purple-200/70"></i>
                    </div>
                  )}

                  {/* CATEGORY */}

                  {blog.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-purple-600/90 text-white shadow-lg shadow-purple-900/40">
                      {blog.category}
                    </span>
                  )}

                  {/* DATE */}

                  {formatDate(blog.publishDate) && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 text-purple-200 backdrop-blur-sm">
                      <i className="ri-calendar-line mr-1"></i>
                      {formatDate(blog.publishDate)}
                    </span>
                  )}
                </div>

                {/* ================= CONTENT ================= */}

                <div className="p-5 lg:p-6 flex flex-col flex-1">
                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {blog.title || "Untitled Blog"}
                  </h3>

                  {blog.excerpt && (
                    <p className="text-purple-200/70 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* TAGS */}

                  {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-xs bg-purple-800/40 text-purple-200/80 border border-purple-700/30"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {blog.author && (
                    <div className="flex items-center gap-2 text-purple-300/80 text-xs mb-4">
                      <i className="ri-user-star-line"></i>
                      <span>{blog.author}</span>
                    </div>
                  )}

                  {/* ================= READ MORE ================= */}

                  <div className="mt-auto">
                    <Link
                      to={`/blog/${blog.slug || blog._id}`}
                      className="block w-full py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-sm rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-900/30 text-center"
                    >
                      Read More
                      <i className="ri-arrow-right-line ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogsList;
