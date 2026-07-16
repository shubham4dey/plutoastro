// ... (upar ka sab same rahega)

const fetchAstrologers = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    // ✅ Sahi URL: /api/astrologers (na ki /api/admin/astrologers)
    const res = await fetch(
      `https://plutoastro-backend.onrender.com/api/astrologers?page=${page}&search=${search}`,
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

// ... (baaki functions same rahenge)

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

    // ✅ Sahi URL: /api/astrologers (na ki /api/admin/astrologer)
    const res = await fetch("https://plutoastro-backend.onrender.com/api/astrologers", {
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

    // ✅ Sahi URL: /api/astrologers/:id (na ki /api/admin/astrologer/:id)
    const res = await fetch(
      `https://plutoastro-backend.onrender.com/api/astrologers/${editingId}`,
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
    // ✅ Sahi URL: /api/astrologers/:id
    const res = await fetch(
      `https://plutoastro-backend.onrender.com/api/astrologers/${id}`,
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
    // ✅ Sahi URL: /api/astrologers/:id
    const res = await fetch(
      `https://plutoastro-backend.onrender.com/api/astrologers/${id}`,
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
  
  // ✅ Image URL check karo - agar pehle se http hai toh direct use karo
  setPreview(
    astro.image
      ? astro.image.startsWith("http")
        ? astro.image
        : `https://plutoastro-backend.onrender.com${astro.image}`
      : ""
  );
  
  setShowModal(true);
};

// ... (baaki code same rahega)