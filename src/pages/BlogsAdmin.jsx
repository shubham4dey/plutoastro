import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

// API base URL - environment aware
// Development: http://localhost:5000
// Production: https://plutoastro-backend.onrender.com
// NOTE: parentheses matter here — without them the "||" swallows the
// ternary condition and REACT_APP_API_URL would resolve to localhost.
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://plutoastro-backend.onrender.com";

const CATEGORIES = [
  "Astrology",
  "Astrology Basics",
  "Horoscope",
  "Transits",
  "Vedic Remedies",
  "Gemstones",
  "Numerology",
  "Tarot",
  "Kundli",
  "Festivals",
  "General",
];

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

// Table styles
const th = {
  padding: "16px",
  textAlign: "left",
  color: "#e9d5ff",
  fontSize: "13px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const td = {
  padding: "16px",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  color: "#d8d8e8",
  verticalAlign: "middle",
};

const labelStyle = {
  display: "block",
  color: "#e9d5ff",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "7px",
};

const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(139,92,246,0.3)",
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontSize: "14px",
};

function BlogsAdmin() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [error, setError] = useState("");

  const emptyForm = {
    title: "",
    excerpt: "",
    content: "",
    author: "",
    category: "Astrology",
    tags: "",
    publishDate: "",
    isPublished: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  // =========================
  // FETCH ALL BLOGS
  // =========================

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        console.warn("No admin token found. Please login.");
        setError("Please login to access the admin panel.");
        return;
      }

      const res = await fetch(
        `${BASE_URL}/api/blogs/admin/all?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          mode: "cors",
        }
      );

      console.log("Response status:", res.status);

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", jsonErr);
        console.error("Response text:", await res.text());
        setError("Invalid server response. Please try again.");
        return;
      }

      console.log("API Response:", data);

      if (data.success) {
        setBlogs(data.blogs || []);
      } else {
        // Show the actual backend error message
        setError(data.message || `Failed to load blogs (Status: ${res.status})`);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      // Provide more specific error messages
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to load blogs: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // =========================
  // ESC KEY - CLOSE MODAL
  // =========================

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showModal]);

  // =========================
  // FORM HANDLERS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setPreview("");
    setFormData({ ...emptyForm });
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (blog) => {
    setEditingId(blog._id);

    setFormData({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "",
      category: blog.category || "Astrology",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      publishDate: blog.publishDate
        ? new Date(blog.publishDate).toISOString().slice(0, 10)
        : "",
      isPublished: !!blog.isPublished,
    });

    setPreview(blog.featuredImage || "");
    setImage(null);
    setShowModal(true);
  };

  // =========================
  // CREATE BLOG
  // =========================

  const createBlog = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter blog content");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("adminToken");

      const form = new FormData();

      form.append("title", formData.title.trim());
      form.append("excerpt", formData.excerpt);
      form.append("content", formData.content);
      form.append("author", formData.author || "PlutoAstro");
      form.append("category", formData.category || "Astrology");
      form.append("tags", formData.tags);

      if (formData.publishDate) {
        form.append("publishDate", formData.publishDate);
      }

      form.append("isPublished", formData.isPublished);

      if (image) {
        form.append("featuredImage", image);
      }

      const res = await fetch(`${BASE_URL}/api/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        alert("Blog created successfully");
        closeModal();
        fetchBlogs();
      } else {
        alert(data.message || "Failed to create blog");
      }
    } catch (err) {
      console.error("Create error:", err);
      alert("Error creating blog: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // UPDATE BLOG
  // =========================

  const updateBlog = async () => {
    if (!formData.title.trim()) {
      alert("Please enter a blog title");
      return;
    }

    if (!formData.content.trim()) {
      alert("Please enter blog content");
      return;
    }

    if (!editingId) {
      alert("Invalid blog selected");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("adminToken");

      const form = new FormData();

      form.append("title", formData.title.trim());
      form.append("excerpt", formData.excerpt);
      form.append("content", formData.content);
      form.append("author", formData.author || "PlutoAstro");
      form.append("category", formData.category || "Astrology");
      form.append("tags", formData.tags);

      if (formData.publishDate) {
        form.append("publishDate", formData.publishDate);
      }

      form.append("isPublished", formData.isPublished);

      if (image) {
        form.append("featuredImage", image);
      }

      const res = await fetch(`${BASE_URL}/api/blogs/${editingId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        alert("Blog updated successfully");
        closeModal();
        fetchBlogs();
      } else {
        alert(data.message || "Failed to update blog");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating blog: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // PUBLISH / UNPUBLISH
  // =========================

  const togglePublish = async (blog) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `${BASE_URL}/api/blogs/${blog._id}/publish`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isPublished: !blog.isPublished,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(data.message || "Publish status updated");
        fetchBlogs();
      } else {
        alert(data.message || "Failed to update publish status");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Error updating publish status");
    }
  };

  // =========================
  // DELETE BLOG
  // =========================

  const deleteBlog = async (id) => {
    const confirmed = window.confirm(
      "Delete this blog permanently?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        alert("Blog deleted successfully");
        fetchBlogs();
      } else {
        alert(data.message || "Failed to delete blog");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting blog");
    }
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await updateBlog();
    } else {
      await createBlog();
    }
  };

  const publishedCount = blogs.filter(
    (blog) => blog.isPublished
  ).length;

  const draftCount = blogs.filter(
    (blog) => !blog.isPublished
  ).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
        display: "flex",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          marginLeft: "260px",
          padding: "30px",
          color: "#fff",
          minWidth: 0,
        }}
      >
        {/* Header */}

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "25px",
            borderRadius: "20px",
            marginBottom: "30px",
            backdropFilter: "blur(20px)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            ✨ Blogs Management
          </h1>

          <p style={{ color: "#cfcfcf" }}>
            Create, edit and publish astrological blogs right from
            here.
          </p>
        </div>

        {/* Stats */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(190px,1fr))",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          {[
            {
              label: "Total Blogs",
              value: blogs.length,
              color: "#a855f7",
              icon: "ri-article-line",
            },
            {
              label: "Published",
              value: publishedCount,
              color: "#22c55e",
              icon: "ri-check-double-line",
            },
            {
              label: "Drafts",
              value: draftCount,
              color: "#f59e0b",
              icon: "ri-draft-line",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "16px",
                padding: "20px",
                backdropFilter: "blur(20px)",
                border: `1px solid ${stat.color}33`,
              }}
            >
              <i
                className={stat.icon}
                style={{
                  fontSize: "28px",
                  color: stat.color,
                  marginBottom: "8px",
                  display: "block",
                }}
              />

              <h3
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                }}
              >
                {stat.value}
              </h3>

              <p
                style={{
                  color: "#a8a8c8",
                  fontSize: "14px",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Add */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search by title, author, category, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: "250px",
              maxWidth: "420px",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              background: "#fff",
              color: "#111827",
              fontSize: "15px",
            }}
          />

          <button
            type="button"
            onClick={openCreate}
            style={{
              background:
                "linear-gradient(135deg,#8B5CF6,#EC4899)",
              border: "none",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow:
                "0 4px 15px rgba(139, 92, 246, 0.4)",
            }}
          >
            + Add Blog
          </button>
        </div>

        {/* Error */}

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border:
                "1px solid rgba(239,68,68,0.4)",
              borderRadius: "14px",
              padding: "18px 22px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              color: "#fecaca",
            }}
          >
            <i
              className="ri-error-warning-line"
              style={{ fontSize: "24px" }}
            />

            <div style={{ flex: 1 }}>{error}</div>

            <button
              type="button"
              onClick={fetchBlogs}
              style={{
                background:
                  "rgba(239,68,68,0.3)",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Blogs Table */}

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "20px",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}
        >
          {loading ? (
            <div
              style={{
                padding: "60px",
                textAlign: "center",
              }}
            >
              <div
                className="loading-spinner"
                style={{
                  display: "inline-block",
                }}
              />

              <p
                style={{
                  color: "#d8b4fe",
                  marginTop: "16px",
                  fontSize: "15px",
                }}
              >
                Loading blogs...
              </p>
            </div>
          ) : blogs.length === 0 ? (
            <div
              style={{
                padding: "70px 40px",
                textAlign: "center",
              }}
            >
              <i
                className="ri-article-line"
                style={{
                  fontSize: "64px",
                  color: "#a855f7",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "18px",
                }}
              />

              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                No blogs found
              </h3>

              <p
                style={{
                  color: "#a8a8c8",
                  maxWidth: "420px",
                  margin: "0 auto 24px",
                }}
              >
                {search
                  ? "No blogs match your search. Try a different keyword."
                  : "You haven't created any blog posts yet. Click “+ Add Blog” to publish your first astrological article."}
              </p>

              {!search && (
                <button
                  type="button"
                  onClick={openCreate}
                  style={{
                    background:
                      "linear-gradient(135deg,#8B5CF6,#EC4899)",
                    border: "none",
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  + Create First Blog
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "900px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "rgba(255,255,255,0.08)",
                    }}
                  >
                    <th style={th}>Image</th>
                    <th style={th}>Title</th>
                    <th style={th}>Author</th>
                    <th style={th}>Category</th>
                    <th style={th}>Publish Date</th>
                    <th style={th}>Status</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      style={{
                        transition:
                          "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "transparent";
                      }}
                    >
                      {/* Image */}

                      <td style={td}>
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title || "Blog"}
                            style={{
                              width: "72px",
                              height: "48px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border:
                                "1px solid rgba(255,255,255,0.15)",
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "72px",
                              height: "48px",
                              borderRadius: "10px",
                              background:
                                "rgba(139,92,246,0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border:
                                "1px solid rgba(255,255,255,0.1)",
                            }}
                          >
                            <i
                              className="ri-image-line"
                              style={{
                                color: "#a855f7",
                              }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Title */}

                      <td style={td}>
                        <strong
                          style={{
                            color: "#fff",
                            fontSize: "15px",
                          }}
                        >
                          {blog.title || "Untitled"}
                        </strong>

                        {blog.tags &&
                          blog.tags.length > 0 && (
                            <div
                              style={{
                                marginTop: "6px",
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >
                              {blog.tags
                                .slice(0, 3)
                                .map((tag, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      fontSize: "11px",
                                      padding: "2px 8px",
                                      borderRadius: "20px",
                                      background:
                                        "rgba(139,92,246,0.2)",
                                      color:
                                        "#c4b5fd",
                                    }}
                                  >
                                    #{tag}
                                  </span>
                                ))}
                            </div>
                          )}
                      </td>

                      {/* Author */}

                      <td style={td}>
                        {blog.author || "—"}
                      </td>

                      {/* Category */}

                      <td style={td}>
                        <span
                          style={{
                            background:
                              "rgba(139,92,246,0.2)",
                            color: "#c4b5fd",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                          }}
                        >
                          {blog.category || "—"}
                        </span>
                      </td>

                      {/* Date */}

                      <td style={td}>
                        {formatDate(
                          blog.publishDate
                        ) || "—"}
                      </td>

                      {/* Status */}

                      <td style={td}>
                        <span
                          style={{
                            background:
                              blog.isPublished
                                ? "rgba(34,197,94,0.2)"
                                : "rgba(245,158,11,0.2)",
                            color:
                              blog.isPublished
                                ? "#4ade80"
                                : "#fbbf24",
                            padding:
                              "6px 12px",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {blog.isPublished
                            ? "Published"
                            : "Draft"}
                        </span>
                      </td>

                      {/* Actions */}

                      <td style={td}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              togglePublish(blog)
                            }
                            style={{
                              border: "none",
                              borderRadius: "8px",
                              padding:
                                "9px 12px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#fff",
                              background:
                                blog.isPublished
                                  ? "linear-gradient(135deg,#f59e0b,#d97706)"
                                  : "linear-gradient(135deg,#22c55e,#16a34a)",
                            }}
                          >
                            {blog.isPublished
                              ? "Unpublish"
                              : "Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(blog)
                            }
                            style={{
                              border: "none",
                              borderRadius: "8px",
                              padding:
                                "9px 12px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#fff",
                              background:
                                "linear-gradient(135deg,#3b82f6,#2563eb)",
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteBlog(blog._id)
                            }
                            style={{
                              border: "none",
                              borderRadius: "8px",
                              padding:
                                "9px 12px",
                              cursor: "pointer",
                              fontWeight: "600",
                              fontSize: "13px",
                              color: "#fff",
                              background:
                                "linear-gradient(135deg,#ef4444,#dc2626)",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =========================
            CREATE / EDIT MODAL
        ========================= */}

        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 1000,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              overflowY: "auto",
              padding: "30px 16px",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg,#1a1233,#241a45)",
                border:
                  "1px solid rgba(139,92,246,0.3)",
                borderRadius: "24px",
                width: "100%",
                maxWidth: "820px",
                padding: "30px",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.6)",
              }}
            >
              <form onSubmit={handleSubmit}>
                {/* Modal Header */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: "700",
                      color: "#fff",
                      margin: 0,
                    }}
                  >
                    {editingId
                      ? "✏️ Edit Blog"
                      : "✨ Create New Blog"}
                  </h2>

                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      background:
                        "rgba(255,255,255,0.08)",
                      border: "none",
                      color: "#fff",
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 1fr",
                    gap: "14px",
                  }}
                >
                  {/* Title */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <label style={labelStyle}>
                      Title *
                    </label>

                    <input
                      type="text"
                      name="title"
                      placeholder="Enter blog title"
                      value={formData.title}
                      onChange={handleChange}
                      style={input}
                      required
                    />
                  </div>

                  {/* Author */}

                  <div>
                    <label style={labelStyle}>
                      Author
                    </label>

                    <input
                      type="text"
                      name="author"
                      placeholder="Author name"
                      value={formData.author}
                      onChange={handleChange}
                      style={input}
                    />
                  </div>

                  {/* Category */}

                  <div>
                    <label style={labelStyle}>
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      style={{
                        ...input,
                        appearance: "auto",
                      }}
                    >
                      {CATEGORIES.map(
                        (cat) => (
                          <option
                            key={cat}
                            value={cat}
                            style={{
                              background:
                                "#1a1233",
                            }}
                          >
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Publish Date */}

                  <div>
                    <label style={labelStyle}>
                      Publish Date
                    </label>

                    <input
                      type="date"
                      name="publishDate"
                      value={
                        formData.publishDate
                      }
                      onChange={handleChange}
                      style={{
                        ...input,
                        colorScheme: "dark",
                      }}
                    />
                  </div>

                  {/* Tags */}

                  <div>
                    <label style={labelStyle}>
                      Tags (comma separated)
                    </label>

                    <input
                      type="text"
                      name="tags"
                      placeholder="e.g. Saturn, Transits, 2026"
                      value={formData.tags}
                      onChange={handleChange}
                      style={input}
                    />
                  </div>

                  {/* Excerpt */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <label style={labelStyle}>
                      Short Description /
                      Excerpt
                    </label>

                    <textarea
                      name="excerpt"
                      placeholder="Brief description of the blog"
                      value={
                        formData.excerpt
                      }
                      onChange={handleChange}
                      rows={3}
                      style={{
                        ...input,
                        resize: "vertical",
                        minHeight: "80px",
                      }}
                    />
                  </div>

                  {/* Content */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <label style={labelStyle}>
                      Full Content *
                    </label>

                    <textarea
                      name="content"
                      placeholder="Write the full blog content here..."
                      value={
                        formData.content
                      }
                      onChange={handleChange}
                      rows={8}
                      style={{
                        ...input,
                        resize: "vertical",
                        minHeight: "160px",
                      }}
                      required
                    />
                  </div>

                  {/* Featured Image */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                    }}
                  >
                    <label style={labelStyle}>
                      Featured Image
                    </label>

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <label
                        style={{
                          ...input,
                          cursor: "pointer",
                          display:
                            "inline-flex",
                          alignItems:
                            "center",
                          gap: "8px",
                          marginBottom: 0,
                          width: "auto",
                        }}
                      >
                        <i className="ri-image-add-line" />
                        Choose Image

                        <input
                          type="file"
                          accept="image/*"
                          onChange={
                            handleImage
                          }
                          style={{
                            display: "none",
                          }}
                        />
                      </label>

                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit:
                              "cover",
                            borderRadius:
                              "8px",
                            border:
                              "2px solid rgba(147,51,234,0.5)",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Publish Immediately */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={
                        formData.isPublished
                      }
                      onChange={(e) =>
                        setFormData(
                          (prev) => ({
                            ...prev,
                            isPublished:
                              e.target
                                .checked,
                          })
                        )
                      }
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor:
                          "#a855f7",
                      }}
                    />

                    <label
                      htmlFor="isPublished"
                      style={{
                        color:
                          "#e9d5ff",
                        cursor:
                          "pointer",
                      }}
                    >
                      Publish immediately
                    </label>
                  </div>

                  {/* Buttons */}

                  <div
                    style={{
                      gridColumn:
                        "1 / -1",
                      display: "flex",
                      gap: "12px",
                      marginTop: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeModal}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius:
                          "12px",
                        border:
                          "1px solid rgba(147,51,234,0.4)",
                        background:
                          "rgba(255,255,255,0.05)",
                        color:
                          "#e9d5ff",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        flex: 1,
                        padding: "12px",
                        borderRadius:
                          "12px",
                        border: "none",
                        background:
                          "linear-gradient(135deg,#9333ea,#c026d3)",
                        color: "#fff",
                        fontWeight:
                          700,
                        cursor:
                          submitting
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          submitting
                            ? 0.6
                            : 1,
                      }}
                    >
                      {submitting
                        ? "Saving..."
                        : editingId
                        ? "Update Blog"
                        : "Create Blog"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogsAdmin;