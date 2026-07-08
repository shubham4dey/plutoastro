import { useEffect, useState } from "react";

function AIAstrologersAdmin() {
  const [astrologers, setAstrologers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    speciality: "",
    description: "",
    prompt: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =========================
  // FETCH ALL
  // =========================
  const fetchAstrologers = async () => {
    try {
      const response = await fetch(
        "http://https://plutoastro-api.onrender.com/api/ai-astrologers/admin/all"
      );

      const data = await response.json();
      setAstrologers(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  // =========================
  // INPUT
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // IMAGE
  // =========================
  const handleImage = (e) => {
    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // =========================
  // EDIT
  // =========================
  const editAstrologer = (astro) => {
    setEditId(astro._id);

    setFormData({
      name: astro.name,
      price: astro.price,
      speciality: astro.speciality?.join(", ") || "",
      description: astro.description || "",
      prompt: astro.prompt || "",
      isActive: astro.isActive,
    });

    setPreview(
      astro.image
        ? `http://https://plutoastro-api.onrender.com${astro.image}`
        : ""
    );

    setImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // RESET
  // =========================
  const resetForm = () => {
    setEditId(null);

    setFormData({
      name: "",
      price: "",
      speciality: "",
      description: "",
      prompt: "",
      isActive: true,
    });

    setImage(null);
    setPreview("");
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("speciality", formData.speciality);
      data.append("description", formData.description);
      data.append("prompt", formData.prompt);
      data.append("isActive", formData.isActive);

      if (image) {
        data.append("image", image);
      }

      let url =
        "http://https://plutoastro-api.onrender.com/api/ai-astrologers";

      let method = "POST";

      if (editId) {
        url += `/${editId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          editId
            ? "AI Astrologer Updated Successfully"
            : "AI Astrologer Added Successfully"
        );

        resetForm();
        fetchAstrologers();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================
  const deleteAstrologer = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this AI Astrologer?"
      );

    if (!confirmDelete) return;

    try {
      await fetch(
        `http://https://plutoastro-api.onrender.com/api/ai-astrologers/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchAstrologers();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // STATUS
  // =========================
  const toggleStatus = async (id) => {
    try {
      await fetch(
        `http://https://plutoastro-api.onrender.com/api/ai-astrologers/${id}/status`,
        {
          method: "PATCH",
        }
      );

      fetchAstrologers();
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // SEARCH
  // =========================
  const filteredAstrologers =
    astrologers.filter((astro) =>
      astro.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="p-8 text-white min-h-screen bg-[#0b0717]">
      <h1 className="text-4xl font-bold mb-8">
        🤖 AI Astrologers Admin
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search AI Astrologer..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          md:w-[400px]
          p-4
          rounded-xl
          bg-[#23183d]
          outline-none
          mb-10
        "
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-[#161028]
          rounded-3xl
          p-8
          mb-12
          space-y-5
        "
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="
            w-full
            p-4
            rounded-xl
            bg-[#23183d]
            outline-none
          "
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="
            w-full
            p-4
            rounded-xl
            bg-[#23183d]
            outline-none
          "
        />

        <input
          type="text"
          name="speciality"
          placeholder="Career, Love, Finance"
          value={formData.speciality}
          onChange={handleChange}
          className="
            w-full
            p-4
            rounded-xl
            bg-[#23183d]
            outline-none
          "
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="
            w-full
            p-4
            rounded-xl
            bg-[#23183d]
            outline-none
          "
        />

        <textarea
          name="prompt"
          placeholder="AI Prompt"
          value={formData.prompt}
          onChange={handleChange}
          rows={5}
          className="
            w-full
            p-4
            rounded-xl
            bg-[#23183d]
            outline-none
          "
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {preview && (
          <img
            src={preview}
            alt=""
            className="
              w-28
              h-28
              rounded-full
              object-cover
              border-4
              border-purple-500
            "
          />
        )}

        <div className="flex gap-4">
          <button
            disabled={loading}
            className="
              bg-purple-600
              hover:bg-purple-500
              px-8
              py-3
              rounded-xl
            "
          >
            {loading
              ? "Please Wait..."
              : editId
              ? "Update AI Astrologer"
              : "Add AI Astrologer"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="
                bg-gray-600
                px-8
                py-3
                rounded-xl
              "
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      <div className="space-y-5">
        {filteredAstrologers.map((astro) => (
          <div
            key={astro._id}
            className="
              bg-[#161028]
              rounded-2xl
              p-5
              flex
              flex-col
              md:flex-row
              justify-between
              gap-5
            "
          >
            <div className="flex gap-5 items-center">
              <img
                src={
                  astro.image
                    ? `http://https://plutoastro-api.onrender.com${astro.image}`
                    : "/Logo.png"
                }
                alt=""
                className="
                  w-20
                  h-20
                  rounded-full
                  object-cover
                "
              />

              <div>
                <h2 className="font-bold text-xl">
                  {astro.name}
                </h2>

                <p>
                  ₹{astro.price}/min
                </p>

                <p className="text-gray-400 text-sm">
                  {astro.speciality?.join(
                    " • "
                  )}
                </p>

                <p
                  className={`mt-2 ${
                    astro.isActive
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {astro.isActive
                    ? "🟢 Active"
                    : "🔴 Disabled"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() =>
                  editAstrologer(astro)
                }
                className="
                  px-5
                  py-2
                  rounded-lg
                  bg-green-600
                "
              >
                Edit
              </button>

              <button
                onClick={() =>
                  toggleStatus(
                    astro._id
                  )
                }
                className="
                  px-5
                  py-2
                  rounded-lg
                  bg-blue-600
                "
              >
                {astro.isActive
                  ? "Disable"
                  : "Enable"}
              </button>

              <button
                onClick={() =>
                  deleteAstrologer(
                    astro._id
                  )
                }
                className="
                  px-5
                  py-2
                  rounded-lg
                  bg-red-600
                "
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredAstrologers.length === 0 && (
          <div className="text-center text-gray-400 py-20">
            No AI Astrologers Found
          </div>
        )}
      </div>
    </div>
  );
}

export default AIAstrologersAdmin;