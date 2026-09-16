import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://plutoastro-backend.onrender.com";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=1200&h=800&fit=crop";

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

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/blogs/${encodeURIComponent(slug || "")}`);
      if (response.status === 404) {
        setError("Blog not found");
        setBlog(null);
        return;
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && data.blog) setBlog(data.blog);
      else { setError("Blog not found"); setBlog(null); }
    } catch (err) {
      console.error("❌ Error fetching blog:", err);
      setError("Failed to load this blog. Please try again later.");
      setBlog(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBlog(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-16 lg:py-24">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-4 bg-purple-800/40 rounded w-1/4 mb-6"></div>
        <div className="h-10 bg-purple-800/50 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-purple-800/30 rounded w-full mb-3"></div>
        <div className="h-4 bg-purple-800/30 rounded w-2/3 mb-3"></div>
        <div className="h-64 bg-purple-900/40 rounded-2xl mb-8"></div>
        <div className="space-y-3"><div className="h-4 bg-purple-800/30 rounded w-full"></div><div className="h-4 bg-purple-800/30 rounded w-full"></div><div className="h-4 bg-purple-800/30 rounded w-5/6"></div></div>
      </div>
    </div>
  );

  if (error && !blog) return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-16 lg:py-24 flex items-start justify-center">
      <div className="max-w-2xl mx-auto w-full text-center bg-purple-900/20 backdrop-blur-sm border border-purple-700/30 rounded-2xl p-12">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-6 shadow-lg"><i className="ri-error-warning-line text-4xl text-white"></i></div>
        <h1 className="text-3xl font-bold text-white mb-3">{error === "Blog not found" ? "Blog Not Found" : "Something Went Wrong"}</h1>
        <p className="text-purple-200/70 mb-8">{error === "Blog not found" ? "The blog you are looking for does not exist or has been unpublished." : error}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={fetchBlog} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all">Try Again</button>
          <Link to="/" className="px-6 py-3 bg-transparent border-2 border-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-all duration-300">Back to Home</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] px-4 py-12 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-8"><i className="ri-arrow-left-line"></i>Back to Home</Link>
        <article className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/30 rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/40">
          {blog.featuredImage && <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-purple-900/40 to-black/60">
            <img src={blog.featuredImage} alt={blog.title || "Blog"} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMAGE; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d2b]/90 via-transparent to-transparent"></div>
            {blog.category && <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-600/90 text-white shadow-lg shadow-purple-900/40">{blog.category}</span>}
          </div>}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-purple-300/80 text-sm mb-5">
              {blog.author && <span className="inline-flex items-center gap-2"><i className="ri-user-star-line"></i>{blog.author}</span>}
              {formatDate(blog.publishDate) && <span className="inline-flex items-center gap-2"><i className="ri-calendar-line"></i>{formatDate(blog.publishDate)}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">{blog.title}</h1>
            {blog.excerpt && <p className="text-purple-200/90 text-lg mb-8 border-l-4 border-purple-500 pl-4 italic">{blog.excerpt}</p>}
            {blog.content && <div className="blog-content text-purple-100/90 text-base lg:text-lg leading-relaxed space-y-4">{String(blog.content).split(/\n+/).filter((p) => p.trim().length > 0).map((paragraph, index) => <p key={index}>{paragraph.trim()}</p>)}</div>}
            {blog.tags && blog.tags.length > 0 && <div className="flex flex-wrap gap-3 mt-10 pt-6 border-t border-purple-700/30">{blog.tags.map((tag, index) => <span key={index} className="px-4 py-1.5 rounded-full text-sm bg-purple-800/50 text-purple-200 border border-purple-600/40">#{tag}</span>)}</div>}
          </div>
        </article>
        <div className="text-center mt-12"><p className="text-purple-200/80 mb-6">Want more cosmic guidance? Explore more articles from the PlutoAstro team.</p><Link to="/blogs" className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-purple-900/30">Explore Latest Blogs</Link></div>
      </div>
    </div>
  );
};

export default BlogDetail;
