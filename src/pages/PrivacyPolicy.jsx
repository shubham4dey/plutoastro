import React from "react";
import { useNavigate } from "react-router-dom";
import bg from "../image/bg1.jpg"; // ✅ Exact same background import

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full pb-20">
      {/* ✅ Background Image (Chat page jaisa exact) */}
      <img
        alt="bg"
        className="h-screen w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
        src={bg}
      />

      {/* ✅ Main Content (pt-40 lagaya hai taaki header se chipka na rahe) */}
      <div className="pt-40 px-4 lg:px-20 max-w-5xl mx-auto relative z-10">
        <div className="bg-purple-950/40 backdrop-blur-md border border-purple-800 rounded-2xl p-6 lg:p-10 shadow-2xl mb-10">
          
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-8 border-b border-purple-700 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-300">Privacy Policy</h1>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
            >
              ← Back to Home
            </button>
          </div>

          <p className="text-purple-400 mb-6">
            <strong>Effective Date:</strong> July 23, 2026
          </p>

          <p className="mb-6 leading-relaxed text-gray-200">
            PlutoAstro ("we", "our", or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our application and services.
          </p>

          <h2 className="text-xl font-semibold text-purple-200 mt-8 mb-3">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6 ml-4">
            <li>Name and Email Address</li>
            <li>Login Credentials (securely hashed)</li>
            <li>Birth Details entered for Kundli/Horoscope generation</li>
            <li>AI Chat Messages and interaction history</li>
            <li>Basic Device Information for app optimization</li>
          </ul>

          <h2 className="text-xl font-semibold text-purple-200 mt-8 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mb-6 ml-4">
            <li>To generate personalized Kundli and Horoscopes</li>
            <li>To provide AI Astrology Chat and consultation services</li>
            <li>To improve PlutoAstro's features and user experience</li>
            <li>To provide customer support</li>
          </ul>

          <h2 className="text-xl font-semibold text-purple-200 mt-8 mb-3">3. Payments & Security</h2>
          <p className="mb-4 leading-relaxed text-gray-200">
            Premium features may require payment. All payment processing is handled securely by authorized third-party providers. We do not store your credit card details. We use industry-standard security measures (like encryption) to protect your data.
          </p>

          <h2 className="text-xl font-semibold text-purple-200 mt-8 mb-3">4. Data Storage & Your Rights</h2>
          <p className="mb-4 leading-relaxed text-gray-200">
            User information is securely stored using MongoDB. You have the right to request correction or deletion of your account and associated data at any time by contacting us.
          </p>

          <h2 className="text-xl font-semibold text-purple-200 mt-8 mb-3">5. Contact Us</h2>
          <p className="leading-relaxed text-gray-200">
            If you have any questions about this Privacy Policy, please contact us at:<br />
            <span className="text-purple-400">Website: https://plutoastro.com</span><br />
            <span className="text-purple-400">Email: designerventure.vc@gmail.com</span>
          </p>
          
        </div>
      </div>
      {/* Footer parent layout (Body.jsx) se automatically niche aa jayega */}
    </div>
  );
}