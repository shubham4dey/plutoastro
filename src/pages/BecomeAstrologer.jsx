import React, { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../image/bg1.jpg";

const BecomeAstrologer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    experience: "",
    languages: "",
    speciality: "",
    price: "",
    about: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) {
        data.append("image", image);
      }

      const response = await fetch(
        "https://plutoastro-backend.onrender.com/api/astrologer-applications/apply",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(
          "Application Submitted Successfully. Waiting For Admin Approval."
        );

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          experience: "",
          languages: "",
          speciality: "",
          price: "",
          about: "",
        });

        setImage(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="relative w-full">
  <img
    src={bg}
    alt="bg"
    className="h-screen w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
  />

  <div className="min-h-screen pt-40 pb-20 px-4 relative z-10">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            px-5
            py-3
            rounded-full
            bg-purple-900/40
            border
            border-purple-500/40
            text-purple-200
            hover:bg-purple-700/40
            transition
          "
        >
          ← Back To Home
        </Link>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div
          className="
            bg-gradient-to-br
            from-purple-950/60
            to-black/40
            backdrop-blur-xl
            border
            border-purple-500/30
            rounded-3xl
            p-8
            shadow-[0_0_50px_rgba(168,85,247,0.2)]
          "
        >
          <div className="mb-8">
            <span
              className="
                px-4
                py-2
                rounded-full
                bg-purple-500/20
                text-purple-300
                text-sm
              "
            >
              ✨ Join PlutoAstro
            </span>
          </div>

          <h1
            className="
              text-5xl
              font-bold
              text-white
              leading-tight
              mb-6
            "
          >
            Become A
            <span className="block text-purple-400">
              Professional Astrologer
            </span>
          </h1>

          <p className="text-purple-200 text-lg mb-8">
            Join India's fastest growing astrology platform
            and start consulting clients online.
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="text-green-400 text-2xl">
                ✓
              </div>
              <span className="text-white">
                Earn from Chat & Call Consultations
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-green-400 text-2xl">
                ✓
              </div>
              <span className="text-white">
                Build Your Professional Profile
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-green-400 text-2xl">
                ✓
              </div>
              <span className="text-white">
                Get Verified Astrologer Badge
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-green-400 text-2xl">
                ✓
              </div>
              <span className="text-white">
                Connect With Thousands Of Users
              </span>
            </div>
          </div>

          <div
            className="
              mt-10
              bg-purple-900/20
              border
              border-purple-500/20
              rounded-2xl
              p-6
            "
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              13,000+
            </h3>

            <p className="text-purple-300">
              Users Trust PlutoAstro Every Month
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div
          className="
            bg-[#120826]/90
            backdrop-blur-xl
            border
            border-purple-600/30
            rounded-3xl
            p-8
            shadow-[0_0_60px_rgba(168,85,247,0.25)]
          "
        >
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            Apply Now
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["password", "Password"],
              ["experience", "Experience (Years)"],
              ["languages", "Languages (Hindi, English)"],
              ["speciality", "Speciality"],
              ["price", "Price Per Minute"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                type={
                  name === "password"
                    ? "password"
                    : "text"
                }
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className="
                  w-full
                  p-4
                  rounded-xl
                  bg-black/40
                  border
                  border-purple-500/20
                  text-white
                  outline-none
                  focus:border-purple-400
                "
              />
            ))}

            <textarea
              rows="5"
              name="about"
              placeholder="Tell us about yourself..."
              value={formData.about}
              onChange={handleChange}
              className="
                w-full
                p-4
                rounded-xl
                bg-black/40
                border
                border-purple-500/20
                text-white
                outline-none
              "
            />

            {/* Upload */}
            <div
              className="
                border-2
                border-dashed
                border-purple-500/30
                rounded-xl
                p-6
                text-center
              "
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(
                    e.target.files[0]
                  )
                }
                className="text-white"
              />

              <p className="text-purple-300 mt-2 text-sm">
                Upload Profile Photo
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                text-white
                font-bold
                text-lg
                hover:scale-[1.02]
                transition-all
              "
            >
              {loading
                ? "Submitting..."
                : "Apply For Approval"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BecomeAstrologer;