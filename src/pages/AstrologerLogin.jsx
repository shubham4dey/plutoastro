import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bg from "../image/bg1.jpg";

const AstrologerLogin = () => {
  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup State
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    experience: "",
    skills: "",
    price: "",
    about: ""
  });

  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://plutoastro-backend.onrender.com/api/astrologer-dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("astrologerToken", data.token);
        localStorage.setItem("astrologerData", JSON.stringify(data.astrologer));
        toast.success("Login Successful!");
        navigate("/astrologer-dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Network error. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup (Become Astrologer)
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", signupData.name);
      formData.append("email", signupData.email);
      formData.append("phone", signupData.phone);
      formData.append("password", signupData.password);
      formData.append("experience", signupData.experience);
      formData.append("languages", "English,Hindi"); // Default languages
      formData.append("speciality", signupData.skills);
      formData.append("price", signupData.price);
      formData.append("about", signupData.about);

      const response = await fetch("https://plutoastro-backend.onrender.com/api/astrologer-applications/apply", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Application submitted successfully! Please wait for admin approval.");
        setActiveTab("login"); // Login tab par wapas le jao
        setSignupData({
          name: "",
          email: "",
          phone: "",
          password: "",
          experience: "",
          skills: "",
          price: "",
          about: ""
        });
      } else {
        toast.error(data.message || "Application failed");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      <img alt="bg" className="absolute inset-0 w-full h-full object-cover brightness-50 -z-10" src={bg} />
      
      <div className="w-full max-w-md p-6 bg-purple-950/80 backdrop-blur-md rounded-2xl border border-purple-700 shadow-2xl">
        {/* Tabs */}
        <div className="flex mb-6 bg-purple-900/50 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition ${
              activeTab === "login"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-purple-300 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition ${
              activeTab === "signup"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-purple-300 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-purple-300 text-sm font-medium">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-purple-900/50 border border-purple-700 text-white placeholder-purple-500 focus:outline-none focus:border-purple-400"
                placeholder="astrologer@example.com"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 text-sm font-medium">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-purple-900/50 border border-purple-700 text-white placeholder-purple-500 focus:outline-none focus:border-purple-400"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-purple-400 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("signup")}
                className="text-purple-200 font-semibold hover:underline"
              >
                Apply Now
              </button>
            </p>
          </form>
        )}

        {/* SIGNUP FORM */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600">
            <div>
              <label className="text-purple-300 text-xs font-medium">Full Name *</label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 text-xs font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 text-xs font-medium">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="+91 9876543210"
                required
              />
            </div>

            <div>
              <label className="text-purple-300 text-xs font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="Create password"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-purple-300 text-xs font-medium">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={signupData.experience}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-purple-300 text-xs font-medium">Price per min (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={signupData.price}
                  onChange={handleInputChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="text-purple-300 text-xs font-medium">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={signupData.skills}
                onChange={handleInputChange}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="Vedic, Tarot, Numerology"
              />
            </div>

            <div>
              <label className="text-purple-300 text-xs font-medium">About You</label>
              <textarea
                name="about"
                value={signupData.about}
                onChange={handleInputChange}
                rows="2"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white text-sm focus:outline-none focus:border-purple-400"
                placeholder="Tell about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50 mt-2"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <p className="text-center text-purple-400 text-xs">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="text-purple-200 font-semibold hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}

        <div className="mt-4 text-center">
          <button onClick={() => navigate("/")} className="text-purple-400 hover:text-purple-300 text-xs">
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AstrologerLogin;