import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import lang from '../utils/langConstants';

const SignSearch = () => {
  const LangKey = useSelector(store => store.configApp.lang);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFind = (e) => {
    e.preventDefault();

    if (!formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      setError('Please fill all fields');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate('/kundligpt', { state: { preFillData: formData } });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="relative w-full py-16 lg:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Bigger & Bolder */}
        <div className="text-center mb-12 lg:mb-16">
          {/* <span className="inline-block px-6 py-2 rounded-full bg-purple-600 bg-opacity-20 border border-purple-500 text-purple-300 text-sm font-medium mb-4">
            ✨ Discover Your Zodiac
          </span> */}
          <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 mb-4">
            {lang[LangKey].zodiacTitle}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-purple-200 opacity-90 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            {lang[LangKey].zodiacDesc}
          </p>
        </div>

        {/* Form Card - Larger & More Prominent */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-40"></div>
          
          <div className="relative bg-purple-950 bg-opacity-90 backdrop-blur-xl border-2 border-purple-500 border-opacity-50 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-purple-500/30">
            <form onSubmit={handleFind}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
                
                {/* Date - Larger */}
                <div className="group">
                  <label className="block text-purple-200 text-base font-semibold mb-3 group-hover:text-purple-100 transition-colors">
                    <i className="ri-calendar-event-line mr-2 text-purple-400"></i>
                    {lang[LangKey].zodiacBirth}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-purple-900 bg-opacity-60 border-2 border-purple-500 border-opacity-40 rounded-xl text-purple-100 text-base outline-none focus:border-purple-400 focus:bg-opacity-80 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Time - Larger */}
                <div className="group">
                  <label className="block text-purple-200 text-base font-semibold mb-3 group-hover:text-purple-100 transition-colors">
                    <i className="ri-time-line mr-2 text-purple-400"></i>
                    {lang[LangKey].zodiacTime}
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      name="birthTime"
                      value={formData.birthTime}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-purple-900 bg-opacity-60 border-2 border-purple-500 border-opacity-40 rounded-xl text-purple-100 text-base outline-none focus:border-purple-400 focus:bg-opacity-80 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Place - Larger */}
                <div className="group">
                  <label className="block text-purple-200 text-base font-semibold mb-3 group-hover:text-purple-100 transition-colors">
                    <i className="ri-map-pin-line mr-2 text-purple-400"></i>
                    {lang[LangKey].zodiacPlace}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      placeholder="Enter your birth place"
                      className="w-full px-5 py-4 bg-purple-900 bg-opacity-60 border-2 border-purple-500 border-opacity-40 rounded-xl text-purple-100 text-base placeholder-purple-400 outline-none focus:border-purple-400 focus:bg-opacity-80 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Find Button - Larger */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-xl text-white font-bold text-base hover:scale-105 transition-all shadow-lg shadow-purple-500/50 disabled:opacity-50 flex items-center justify-center gap-3 group"
                  >
                    {loading ? (
                      <i className="ri-loader-4-line animate-spin text-xl"></i>
                    ) : (
                      <>
                        <i className="ri-search-2-line text-xl group-hover:rotate-12 transition-transform"></i>
                        {lang[LangKey].zodiacFind}
                        <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-5 px-5 py-3 bg-red-500 bg-opacity-20 border-2 border-red-500 border-opacity-40 rounded-xl flex items-center gap-3 animate-shake">
                  <i className="ri-error-warning-line text-red-400 text-xl"></i>
                  <span className="text-red-300 font-medium">{error}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Feature Tags - More Prominent */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="flex items-center gap-2 px-5 py-3 bg-purple-950 bg-opacity-60 border border-purple-500 border-opacity-40 rounded-xl hover:border-purple-400 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <i className="ri-star-fill text-white text-sm"></i>
            </div>
            <span className="text-purple-200 font-semibold text-sm">Accurate Predictions</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-purple-950 bg-opacity-60 border border-purple-500 border-opacity-40 rounded-xl hover:border-purple-400 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <i className="ri-shield-check-fill text-white text-sm"></i>
            </div>
            <span className="text-purple-200 font-semibold text-sm">100% Private</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 bg-purple-950 bg-opacity-60 border border-purple-500 border-opacity-40 rounded-xl hover:border-purple-400 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <i className="ri-flashlight-fill text-white text-sm"></i>
            </div>
            <span className="text-purple-200 font-semibold text-sm">Instant Results</span>
          </div>
        </div>

      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignSearch;