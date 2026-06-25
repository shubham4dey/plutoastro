import React from "react";
import TopAstroCard from "./TopAstroCard";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import lang from "../utils/langConstants";

const TopAstro = ({ list = [] }) => {
  const LangKey = useSelector(
    (store) => store.configApp.lang
  );

  return (
    <section className="w-full py-12 flex flex-col items-center">
      {/* Heading */}
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-2xl lg:text-4xl font-bold text-purple-300">
          🤖 Virtual AI Astrologers
        </h2>

        <div className="w-28 lg:w-40 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-4 mb-5" />

        <p className="text-purple-200 opacity-90 text-sm lg:text-lg max-w-3xl">
          {lang?.[LangKey]?.astroDesc ||
            "Connect with intelligent AI astrologers for instant predictions, guidance and remedies anytime."}
        </p>
      </div>

      {/* Astrologers Slider */}
      <div
        className="
          w-full
          lg:w-11/12
          mt-10
          flex
          gap-4
          overflow-x-auto
          no-scrollbar
          px-4
          pb-3
          scroll-smooth
        "
      >
        {list.length > 0 ? (
          list.map((astro) => (
            <Link
              key={astro?._id || astro?.id}
              to={`/astroProfile/${
                astro?._id || astro?.id
              }`}
              className="flex-shrink-0"
            >
              <TopAstroCard info={astro} />
            </Link>
          ))
        ) : (
          <div className="w-full text-center text-purple-300 py-16">
            No AI Astrologers Available
          </div>
        )}
      </div>
    </section>
  );
};

export default TopAstro;