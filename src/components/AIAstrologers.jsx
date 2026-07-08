import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function AIAstrologers() {
  const [aiAstrologers, setAiAstrologers] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const avatars = [
    "/ai/swami.jpg",
    "/ai/arjun.jpg",
    "/ai/loveguru.jpg",
    "/ai/ananya.jpg",
    "/ai/anil.jpg",
    "/ai/kiara.jpg",
  ];

  const fetchAiAstrologers =
    async () => {
      try {
        const response =
          await fetch(
            "http://plutoastro-api.onrender.com/api/ai-astrologers"
          );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch AI Astrologers"
          );
        }

        const data =
          await response.json();

        setAiAstrologers(data);
      } catch (error) {
        console.log(
          "AI Astrologers Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAiAstrologers();
  }, []);

  // Auto Slider
  useEffect(() => {
    const slider =
      sliderRef.current;

    if (
      !slider ||
      aiAstrologers.length === 0
    )
      return;

    const interval =
      setInterval(() => {
        if (
          slider.scrollLeft +
            slider.clientWidth >=
          slider.scrollWidth - 5
        ) {
          slider.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          slider.scrollBy({
            left: 260,
            behavior: "smooth",
          });
        }
      }, 3500);

    return () =>
      clearInterval(interval);
  }, [aiAstrologers]);

  // Mouse Wheel Scroll
  useEffect(() => {
    const slider =
      sliderRef.current;

    const handleWheel = (e) => {
      if (!slider) return;

      e.preventDefault();
      slider.scrollLeft +=
        e.deltaY;
    };

    slider?.addEventListener(
      "wheel",
      handleWheel,
      {
        passive: false,
      }
    );

    return () => {
      slider?.removeEventListener(
        "wheel",
        handleWheel
      );
    };
  }, []);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="mt-20">
        <div className="bg-white/10 backdrop-blur-xl rounded-[35px] border border-purple-500/30 p-10">
          <h2 className="text-4xl font-bold text-white">
            🤖 AI Astrologers
          </h2>

          <div className="flex gap-8 mt-10 overflow-hidden">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="animate-pulse"
                >
                  <div className="w-28 h-28 rounded-full bg-purple-500/30" />

                  <div className="w-28 h-4 bg-purple-500/30 rounded mt-5" />

                  <div className="w-20 h-3 bg-purple-500/20 rounded mt-3 mx-auto" />
                </div>
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-20">
      <div
        className="
          relative
          bg-gradient-to-r
          from-slate-900/90
          via-purple-900/40
          to-slate-900/90
          backdrop-blur-2xl
          rounded-[35px]
          border
          border-purple-500/30
          p-8
          shadow-[0_0_60px_rgba(168,85,247,0.25)]
          overflow-hidden
        "
      >
        {/* Heading */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-4">
              🤖 AI Astrologers
            </h2>

            <p className="text-purple-200 mt-3">
              Your Personal AI
              Astrologers Available
              24×7
            </p>
          </div>

          {aiAstrologers.length >
            4 && (
            <div className="hidden md:flex gap-3">
              <button
                onClick={
                  scrollLeft
                }
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-purple-700
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-purple-600
                "
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={
                  scrollRight
                }
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-purple-700
                  text-white
                  flex
                  items-center
                  justify-center
                  hover:bg-purple-600
                "
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Cards */}
        {aiAstrologers.length >
        0 ? (
          <div
            ref={sliderRef}
            className="
              flex
              gap-10
              overflow-x-auto
              pb-4
              scrollbar-hide
              scroll-smooth
            "
          >
            {aiAstrologers.map(
              (
                astro,
                index
              ) => (
                <div
                  key={
                    astro._id
                  }
                  onClick={() =>
                    navigate(
                      `/ai-astro/${astro._id}`
                    )
                  }
                  className="
                    min-w-[200px]
                    flex-shrink-0
                    text-center
                    cursor-pointer
                    group
                    transition-all
                    duration-500
                    hover:-translate-y-4
                  "
                >
                  <div className="relative">
                    <img
                      src={
                        astro.image
                          ? astro.image
                          : avatars[
                              index %
                                avatars.length
                            ]
                      }
                      alt={
                        astro.name
                      }
                      className="
                        w-28
                        h-28
                        rounded-full
                        object-cover
                        border-4
                        border-purple-400
                        mx-auto
                        shadow-[0_0_35px_rgba(168,85,247,0.7)]
                        group-hover:scale-110
                        transition-all
                        duration-500
                      "
                    />

                    <div className="absolute bottom-2 right-[42px]">
                      <span className="absolute inline-flex h-4 w-4 rounded-full bg-green-400 opacity-75 animate-ping"></span>

                      <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400 border-2 border-slate-900"></span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold mt-5 text-lg">
                    {astro.name}
                  </h3>

                  <p className="text-purple-300 mt-1 text-lg">
                    ₹{astro.price}/min
                  </p>

                  <p className="text-gray-300 text-xs mt-2 px-2 min-h-[36px]">
                    {astro.speciality?.join(
                      " • "
                    )}
                  </p>

                  <button
                    onClick={(
                      e
                    ) => {
                      e.stopPropagation();

                      navigate(
                        `/ai-astro/${astro._id}`
                      );
                    }}
                    className="
                      mt-5
                      px-5
                      py-2
                      rounded-full
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-500
                      text-white
                      flex
                      items-center
                      gap-2
                      mx-auto
                      hover:scale-105
                      transition-all
                    "
                  >
                    <FaRobot />
                    Chat
                  </button>
                </div>
              )
            )}
          </div>
        ) : (
          <p className="text-purple-200 text-lg">
            No AI Astrologers Found
          </p>
        )}

        {aiAstrologers.length >
          0 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() =>
                navigate(
                  "/ai-astro"
                )
              }
              className="
                px-8
                py-4
                rounded-full
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                text-white
                font-semibold
                flex
                items-center
                gap-3
                hover:scale-105
                transition-all
                shadow-[0_0_35px_rgba(168,85,247,0.5)]
              "
            >
              Explore AI
              Astrology
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default AIAstrologers;