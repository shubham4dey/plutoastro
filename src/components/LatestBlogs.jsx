import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=800&h=600&fit=crop";

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "";
  }
};

// =====================================================
// API BASE URL
// =====================================================
// LOCAL DEVELOPMENT
// http://localhost:5000
//
// PRODUCTION
// https://plutoastro-backend.onrender.com
//
// IMPORTANT:
// We intentionally do NOT use REACT_APP_API_URL here,
// because it may contain the production Render URL and
// override localhost during development.
// =====================================================

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://plutoastro-backend.onrender.com";

// =====================================================
// LATEST BLOGS
// =====================================================

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===================================================
  // FETCH BLOGS
  // ===================================================

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "📝 Fetching blogs from:",
        `${API_BASE}/api/blogs?limit=6`
      );

      const response = await fetch(
        `${API_BASE}/api/blogs?limit=6`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      console.log("✅ Blogs API response:", data);

      const blogsData = Array.isArray(data)
        ? data
        : data.blogs && Array.isArray(data.blogs)
        ? data.blogs
        : [];

      setBlogs(blogsData);
    } catch (err) {
      console.error("❌ Error fetching blogs:", err);

      setError(
        "Failed to load blogs. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // LOAD BLOGS ON COMPONENT MOUNT
  // ===================================================

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ===================================================
  // SKELETON CARD
  // ===================================================

  const SkeletonCard = () => (
    <div className="bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden animate-pulse">
      <div className="h-52 lg:h-60 bg-purple-900/40"></div>

      <div className="p-5 lg:p-6 space-y-3">
        <div className="h-4 bg-purple-800/40 rounded w-1/3"></div>

        <div className="h-6 bg-purple-800/50 rounded w-3/4"></div>

        <div className="h-4 bg-purple-800/30 rounded w-full"></div>

        <div className="h-4 bg-purple-800/30 rounded w-2/3"></div>

        <div className="h-10 bg-purple-700/50 rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );

  // ===================================================
  // ERROR STATE
  // ===================================================

  if (error) {
    return (
      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-8">

            <i className="ri-error-warning-line text-red-400 text-5xl mb-4"></i>

            <h3 className="text-2xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h3>

            <p className="text-purple-200/70 mb-6">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchBlogs}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all"
            >
              Try Again
            </button>

          </div>
        </div>
      </section>
    );
  }

  // ===================================================
  // MAIN SECTION
  // ===================================================

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* ===========================================
            SECTION HEADER
        ============================================ */}

        <div className="text-center mb-12 lg:mb-16">

          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Latest Blogs
          </h2>

          <p className="text-purple-200/80 text-base lg:text-lg max-w-2xl mx-auto">
            Cosmic insights, Vedic remedies and astrological
            guidance from PlutoAstro
          </p>

        </div>

        {/* ===========================================
            LOADING STATE
        ============================================ */}

        {loading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

        ) : blogs.length === 0 ? (

          /* =========================================
             EMPTY STATE
          ========================================== */

          <div className="text-center bg-purple-900/20 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-12 lg:p-16">

            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-900/40">

              <i className="ri-article-line text-4xl text-white"></i>

            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              No Blogs Published Yet
            </h3>

            <p className="text-purple-200/70 max-w-md mx-auto">
              Our astrologers are writing fresh content right now.
              Check back soon for cosmic insights and remedies.
            </p>

          </div>

        ) : (

          /* =========================================
             BLOG GRID
          ========================================== */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {blogs.map((blog) => (

              <div
                key={blog._id || blog.id}
                className="group bg-purple-900/20 backdrop-blur-sm rounded-2xl border border-purple-700/30 overflow-hidden hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-900/40 transition-all duration-500 hover:-translate-y-2 flex flex-col"
              >

                {/* =================================
                    IMAGE
                ================================== */}

                <div className="relative h-52 lg:h-60 overflow-hidden bg-gradient-to-br from-purple-900/40 to-black/60">

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

                {/* =================================
                    BLOG CONTENT
                ================================== */}

                <div className="p-5 lg:p-6 flex flex-col flex-1">

                  {/* TITLE */}

                  <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                    {blog.title || "Untitled Blog"}
                  </h3>

                  {/* EXCERPT */}

                  {blog.excerpt && (
                    <p className="text-purple-200/70 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* AUTHOR */}

                  {blog.author && (
                    <div className="flex items-center gap-2 text-purple-300/80 text-xs mb-4">

                      <i className="ri-user-star-line"></i>

                      <span>{blog.author}</span>

                    </div>
                  )}

                  {/* =================================
                      READ MORE
                  ================================== */}

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

export default LatestBlogs;