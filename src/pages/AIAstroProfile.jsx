import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

function AIAstroProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [astro, setAstro] =
    useState(null);

  const fetchAstrologer =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `http://plutoastro-api.onrender.com/api/ai-astrologers/${id}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          setAstro(null);
          return;
        }

        setAstro(
          data.astrologer || data
        );
      } catch (error) {
        console.log(error);
        setAstro(null);
      } finally {
        setLoading(false);
      }
    }, [id]);

  useEffect(() => {
    fetchAstrologer();
  }, [fetchAstrologer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!astro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-3xl">
        AI Astrologer Not Found
      </div>
    );
  }

  const imageUrl =
    astro?.image?.startsWith("http")
      ? astro.image
      : astro?.image
      ? `http://plutoastro-api.onrender.com${astro.image}`
      : "/Logo.png";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05000d] text-white pt-32 pb-20">

      {/* AURORA BACKGROUND */}

      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-20 left-20 w-[450px] h-[450px] bg-purple-700 rounded-full blur-[180px] opacity-25"></div>

        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-600 rounded-full blur-[220px] opacity-20"></div>

        <div className="absolute top-[50%] left-[50%] w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[150px] opacity-20"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
          backdrop-blur-3xl
          bg-gradient-to-br
          from-[#140026]/90
          via-[#12001f]/90
          to-[#0b0017]/90
          border
          border-purple-500/20
          rounded-[40px]
          p-8
          lg:p-14
          shadow-[0_0_100px_rgba(168,85,247,0.15)]
        "
        >

          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* PROFILE IMAGE */}

            <motion.div
              initial={{
                scale: 0.8,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                duration: 0.6,
              }}
              className="relative"
            >

              <div className="absolute inset-0 bg-purple-600 rounded-full blur-[120px] opacity-50 animate-pulse"></div>

              <img
                src={imageUrl}
                alt={astro.name}
                onError={(e) => {
                  e.target.src =
                    "/Logo.png";
                }}
                className="
                relative
                w-[280px]
                h-[280px]
                object-cover
                rounded-full
                border-[6px]
                border-purple-500
                shadow-[0_0_80px_rgba(168,85,247,0.8)]
              "
              />

              <div className="absolute bottom-5 right-6 w-6 h-6 rounded-full bg-green-400 border-2 border-black animate-pulse"></div>

            </motion.div>

            {/* DETAILS */}

            <div className="flex-1">

              <div className="flex flex-wrap gap-3 mb-5">

                <span className="px-4 py-2 rounded-full bg-green-500/15 border border-green-500 text-green-300">
                  🟢 Online
                </span>

                <span className="px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-500 text-yellow-300">
                  ⭐ 4.9 Rating
                </span>

                <span className="px-4 py-2 rounded-full bg-pink-500/15 border border-pink-500 text-pink-300">
                  🔥 10K+ Reviews
                </span>

              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-4">
                {astro.name}
              </h1>

              <h2 className="text-4xl font-bold text-purple-300 mb-8">
                ₹{astro.price || 20}/min
              </h2>

              {/* SPECIALITY */}

              <div className="flex flex-wrap gap-3 mb-10">

                {astro.speciality?.map(
                  (
                    item,
                    index
                  ) => (
                    <span
                      key={index}
                      className="
                      px-5
                      py-2
                      rounded-full
                      bg-purple-500/10
                      border
                      border-purple-500/40
                      hover:bg-purple-500/20
                      duration-300
                    "
                    >
                      {item}
                    </span>
                  )
                )}

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

                {[
                  {
                    title:
                      "Experience",
                    value: `${astro.experience || 5}+`,
                  },
                  {
                    title:
                      "Consultations",
                    value: "5000+",
                  },
                  {
                    title:
                      "Rating",
                    value: "4.9",
                  },
                  {
                    title:
                      "Response",
                    value:
                      "Instant",
                  },
                ].map(
                  (
                    item,
                    index
                  ) => (
                    <motion.div
                      whileHover={{
                        y: -5,
                      }}
                      key={index}
                      className="
                      bg-gradient-to-br
                      from-purple-500/10
                      to-pink-500/10
                      border
                      border-purple-500/20
                      rounded-3xl
                      p-5
                      text-center
                    "
                    >
                      <h3 className="text-purple-300 text-sm">
                        {item.title}
                      </h3>

                      <p className="text-2xl font-bold mt-1">
                        {item.value}
                      </p>

                    </motion.div>
                  )
                )}

              </div>

              {/* ABOUT */}

              <div className="mb-10">

                <h2 className="text-3xl font-bold text-purple-300 mb-4">
                  About Astrologer
                </h2>

                <p className="text-gray-300 leading-8 text-lg">
                  {astro.description ||
                    "Professional AI astrologer specialized in relationship guidance, career predictions, tarot readings and spiritual insights."}
                </p>

              </div>

              {/* CTA */}

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() =>
                  navigate(
                    `/ai-chat/${astro._id}`
                  )
                }
                className="
                px-12
                py-5
                rounded-full
                text-xl
                font-bold
                bg-gradient-to-r
                from-purple-600
                via-fuchsia-500
                to-pink-500
                shadow-[0_0_60px_rgba(168,85,247,0.7)]
              "
              >
                💬 Start Chat Now
              </motion.button>

            </div>
          </div>

        </motion.div>

      </div>
    </div>
  );
}

export default AIAstroProfile;