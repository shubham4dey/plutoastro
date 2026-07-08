import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

function AstrologersAdmin() {
  const [astrologers, setAstrologers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    pricePerMinute: "",
    rating: "",
    status: "online",
    skills: [],
    languages: [],
  });

  // Available skills list
  const availableSkills = [
    "Vedic",
    "Numerology",
    "Tarot",
    "Face Reading",
    "Vastu",
    "Life Coach",
    "Psychologist",
    "Palmistry",
    "Astrology",
    "Horoscope",
    "Kundli",
    "Gemstone",
  ];

  // Available languages
  const availableLanguages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Tamil",
    "Telugu",
    "Bengali",
  ];

  useEffect(() => {
    fetchAstrologers();
  }, [page, search]);

  // ESC key se modal close karne ke liye
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        resetForm();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showModal]);

  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://plutoastro-api.onrender.com/api/admin/astrologers?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setAstrologers(data.astrologers || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const currentSkills = prev.skills || [];
      if (currentSkills.includes(skill)) {
        return {
          ...prev,
          skills: currentSkills.filter((s) => s !== skill),
        };
      } else {
        return {
          ...prev,
          skills: [...currentSkills, skill],
        };
      }
    });
  };

  const handleLanguageToggle = (language) => {
    setFormData((prev) => {
      const currentLanguages = prev.languages || [];
      if (currentLanguages.includes(language)) {
        return {
          ...prev,
          languages: currentLanguages.filter((l) => l !== language),
        };
      } else {
        return {
          ...prev,
          languages: [...currentLanguages, language],
        };
      }
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setPreview("");
    setFormData({
      name: "",
      experience: "",
      pricePerMinute: "",
      rating: "",
      status: "online",
      skills: [],
      languages: [],
    });
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  /* =========================
     Create Astrologer
  ========================= */
  const createAstrologer = async () => {
    if (!formData.name || !formData.experience || !formData.pricePerMinute) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("experience", formData.experience);
      form.append("pricePerMinute", formData.pricePerMinute);
      form.append("rating", formData.rating || "0");
      form.append("status", formData.status);
      form.append("skills", JSON.stringify(formData.skills || []));
      form.append("languages", JSON.stringify(formData.languages || []));

      if (image) {
        form.append("image", image);
      }

      const res = await fetch("https://plutoastro-api.onrender.com/api/admin/astrologer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();

      if (data.success) {
        closeModal();
        fetchAstrologers();
        window.dispatchEvent(new Event("dashboardUpdate"));
      } else {
        alert(data.message || "Failed to create astrologer");
      }
    } catch (error) {
      console.error("Create error:", error);
      alert("Error creating astrologer: " + error.message);
    }
  };

  /* =========================
     Update Astrologer
  ========================= */
  const updateAstrologer = async () => {
    if (!formData.name || !formData.experience || !formData.pricePerMinute) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("experience", formData.experience);
      form.append("pricePerMinute", formData.pricePerMinute);
      form.append("rating", formData.rating || "0");
      form.append("status", formData.status);
      form.append("skills", JSON.stringify(formData.skills || []));
      form.append("languages", JSON.stringify(formData.languages || []));

      if (image) {
        form.append("image", image);
      }

      const res = await fetch(
        `https://plutoastro-api.onrender.com/api/admin/astrologer/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await res.json();

      if (data.success) {
        closeModal();
        fetchAstrologers();
        window.dispatchEvent(new Event("dashboardUpdate"));
      } else {
        alert(data.message || "Failed to update astrologer");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating astrologer: " + error.message);
    }
  };

  /* =========================
     Delete Astrologer
  ========================= */
  const deleteAstrologer = async (id) => {
    const confirmDelete = window.confirm("Delete this astrologer?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://plutoastro-api.onrender.com/api/admin/astrologer/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchAstrologers();
        window.dispatchEvent(new Event("dashboardUpdate"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     Change Status
  ========================= */
  const changeStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `https://plutoastro-api.onrender.com/api/admin/astrologer/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        fetchAstrologers();
        window.dispatchEvent(new Event("dashboardUpdate"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     Edit Astrologer
  ========================= */
  const editAstrologer = (astro) => {
    setEditingId(astro._id);
    setFormData({
      name: astro.name,
      experience: astro.experience,
      pricePerMinute: astro.pricePerMinute,
      rating: astro.rating,
      status: astro.status,
      skills: astro.skills || [],
      languages: astro.languages || [],
    });
    setPreview(astro.image ? `https://plutoastro-api.onrender.com${astro.image}` : "");
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#10b981";
      case "busy":
        return "#f59e0b";
      case "offline":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f0c29,#302b63,#24243e)",
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
            Astrologers Management
          </h1>
          <p style={{ color: "#cfcfcf" }}>
            Manage all astrologers from one place.
          </p>
        </div>

        {/* Search + Add */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "25px",
            gap: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search astrologer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{
              flex: 1,
              maxWidth: "350px",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              background: "#fff",
              color: "#111827",
              fontSize: "16px",
            }}
          />

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            style={{
              background: "linear-gradient(135deg,#8B5CF6,#EC4899)",
              border: "none",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            + Add Astrologer
          </button>
        </div>

        {/* Table */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "20px",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(255,255,255,0.08)",
                }}
              >
                <th style={th}>Image</th>
                <th style={th}>Name</th>
                <th style={th}>Experience</th>
                <th style={th}>Price</th>
                <th style={th}>Rating</th>
                <th style={th}>Skills</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : astrologers.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    No Astrologers Found
                  </td>
                </tr>
              ) : (
                astrologers.map((astro) => (
                  <tr key={astro._id}>
                    <td style={td}>
                      <img
                        src={
                          astro.image
                            ? `https://plutoastro-api.onrender.com${astro.image}`
                            : "https://via.placeholder.com/50"
                        }
                        alt=""
                        style={{
                          width: "55px",
                          height: "55px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    <td style={td}>{astro.name}</td>

                    <td style={td}>{astro.experience} Years</td>

                    <td style={td}>₹{astro.pricePerMinute}/min</td>

                    <td style={td}>⭐ {astro.rating}</td>

                    <td style={td}>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {astro.skills && astro.skills.length > 0 ? (
                          <>
                            {astro.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                style={{
                                  background: "rgba(139, 92, 246, 0.3)",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  color: "#fff",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {astro.skills.length > 3 && (
                              <span style={{ fontSize: "12px", color: "#8B5CF6" }}>
                                +{astro.skills.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span style={{ color: "#999", fontSize: "12px" }}>
                            No skills
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={td}>
                      <select
                        value={astro.status}
                        onChange={(e) =>
                          changeStatus(astro._id, e.target.value)
                        }
                        style={{
                          padding: "8px 12px",
                          borderRadius: "8px",
                          border: "none",
                          background: getStatusColor(astro.status),
                          color: "#fff",
                          fontWeight: "600",
                          cursor: "pointer",
                          outline: "none",
                          minWidth: "100px",
                        }}
                      >
                        <option value="online">Online</option>
                        <option value="busy">Busy</option>
                        <option value="offline">Offline</option>
                      </select>
                    </td>

                    <td style={td}>
                      <button
                        onClick={() => editAstrologer(astro)}
                        style={{
                          background: "#3b82f6",
                          border: "none",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteAstrologer(astro._id)}
                        style={{
                          background: "#ef4444",
                          border: "none",
                          color: "#fff",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            color: "#fff",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.5 : 1,
              background: "#3b82f6",
              color: "#fff",
            }}
          >
            Prev
          </button>

          <span style={{ padding: "8px 16px" }}>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: page === totalPages ? "not-allowed" : "pointer",
              opacity: page === totalPages ? 0.5 : 1,
              background: "#3b82f6",
              color: "#fff",
            }}
          >
            Next
          </button>
        </div>

        {/* Modal with Close Button */}
        {showModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              backdropFilter: "blur(5px)",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "650px",
                maxWidth: "95%",
                background: "linear-gradient(135deg, #2d275e 0%, #1a1547 100%)",
                borderRadius: "24px",
                boxShadow: "0 25px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(139, 92, 246, 0.3)",
                maxHeight: "92vh",
                display: "flex",
                flexDirection: "column",
                animation: "modalSlideIn 0.3s ease-out",
              }}
            >
              {/* Modal Header with Close Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "25px 35px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  position: "sticky",
                  top: 0,
                  background: "linear-gradient(135deg, #2d275e 0%, #1a1547 100%)",
                  borderRadius: "24px 24px 0 0",
                  zIndex: 10,
                }}
              >
                <div>
                  <h2
                    style={{
                      color: "#fff",
                      fontSize: "26px",
                      fontWeight: "700",
                      margin: 0,
                    }}
                  >
                    {editingId ? "✏️ Edit Astrologer" : "✨ Add Astrologer"}
                  </h2>
                  <p style={{ color: "#a78bfa", fontSize: "14px", margin: "5px 0 0 0" }}>
                    {editingId ? "Update astrologer details" : "Fill in the details below"}
                  </p>
                </div>

                {/* CLOSE BUTTON (X) */}
                <button
                  onClick={closeModal}
                  title="Close (ESC)"
                  style={{
                    background: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#fff",
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    fontWeight: "bold",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#ef4444";
                    e.currentTarget.style.transform = "rotate(90deg) scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                    e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div
                style={{
                  padding: "30px 35px",
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {/* Image Preview */}
                {preview && (
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "4px solid #8B5CF6",
                        boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                      }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                  style={{
                    marginBottom: "15px",
                    color: "#fff",
                    width: "100%",
                    padding: "10px",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />

                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleChange}
                  style={input}
                  required
                />

                <input
                  type="number"
                  name="experience"
                  placeholder="Experience (Years) *"
                  value={formData.experience}
                  onChange={handleChange}
                  style={input}
                  min="0"
                  required
                />

                <input
                  type="number"
                  name="pricePerMinute"
                  placeholder="Price Per Minute (₹) *"
                  value={formData.pricePerMinute}
                  onChange={handleChange}
                  style={input}
                  min="0"
                  step="0.01"
                  required
                />

                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (0-5)"
                  value={formData.rating}
                  onChange={handleChange}
                  style={input}
                  min="0"
                  max="5"
                  step="0.1"
                />

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={input}
                >
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>

                {/* Skills Section */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      color: "#fff",
                      marginBottom: "12px",
                      display: "block",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    🎯 Skills / Filters
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      background: "rgba(255,255,255,0.03)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {availableSkills.map((skill) => (
                      <label
                        key={skill}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "#fff",
                          padding: "6px",
                          borderRadius: "6px",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(formData.skills || []).includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "#8B5CF6",
                          }}
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages Section */}
                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      color: "#fff",
                      marginBottom: "12px",
                      display: "block",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                  >
                    🌐 Languages
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "10px",
                      background: "rgba(255,255,255,0.03)",
                      padding: "15px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {availableLanguages.map((lang) => (
                      <label
                        key={lang}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          cursor: "pointer",
                          color: "#fff",
                          padding: "6px",
                          borderRadius: "6px",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(139, 92, 246, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={(formData.languages || []).includes(lang)}
                          onChange={() => handleLanguageToggle(lang)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "#8B5CF6",
                          }}
                        />
                        {lang}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "20px 35px",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: "0 0 24px 24px",
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    padding: "14px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "15px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={editingId ? updateAstrologer : createAstrologer}
                  style={{
                    flex: 2,
                    padding: "14px",
                    border: "none",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg,#8B5CF6,#EC4899)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(139, 92, 246, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(139, 92, 246, 0.4)";
                  }}
                >
                  {editingId ? "✓ Update Astrologer" : "✨ Save Astrologer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Animation Styles */}
        <style>
          {`
            @keyframes modalSlideIn {
              from {
                opacity: 0;
                transform: translateY(-30px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

const th = {
  padding: "16px",
  textAlign: "left",
  color: "#fff",
  borderBottom: "2px solid rgba(255,255,255,0.1)",
};

const td = {
  padding: "16px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  verticalAlign: "middle",
};

const input = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

export default AstrologersAdmin;