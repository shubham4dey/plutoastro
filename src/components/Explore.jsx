import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
 
import lang from "../utils/langConstants";
import ZodiacContainer from "./ZodiacContainer";
 
import handbg from "../image/hand_bg.png";
import hand from "../image/hand.png";
 
 
const Explore = () => {
  const Langkey = useSelector((store) => store.configApp.lang);
 

  return (
    <div className="w-full flex flex-col">
      {/* HERO SECTION */}
      <section
        className="
          relative
          min-h-screen
          flex
          flex-col
          lg:flex-row
          justify-center
          items-center
          px-6
          lg:px-[8rem]
          pt-22
          lg:pt-0
          pb-0
          lg:pb-24
          overflow-hidden
        "
      >
        {/* LEFT */}
        <div
          className="
            w-full
            lg:w-1/2
            flex
            flex-col
            items-center
            lg:items-start
            text-center
            lg:text-left
            z-10
          "
        >
          <h3
            className="
            text-2xl
            lg:text-5xl
            uppercase
            tracking-[12px]
            text-white
            font-light
            mb-4
            "
          >
            {lang[Langkey].welcome}
          </h3>
 
          <h1
            className="
              text-6xl
              md:text-8xl
              lg:text-[9rem]
              font-extrabold
              mb-8
              lg:mb-12
              bg-gradient-to-r
              from-purple-100
              via-purple-300
              to-purple-500
              bg-clip-text
              text-transparent
              leading-none
              drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]
            "
          >
            {lang[Langkey].astroGPT}
          </h1>
 
          <p
            className="
              text-xl
              lg:text-4xl
              text-white
              uppercase
              tracking-[8px]
              mb-6
            "
          >
            {lang[Langkey].finger}
          </p>
 
          <p
            className="
              text-sm
              lg:text-lg
              text-zinc-300
              max-w-xl
              leading-8
            "
          >
            {lang[Langkey].loginDescription}
          </p>
 
          {/* CTA BUTTON */}
          <div
            className="
              flex
              flex-wrap
              justify-center
              lg:justify-start
              gap-4
              mt-8
            "
          >
            {/* Free Chat */}
            <Link
              to="/chat"
              className="group relative inline-flex items-center gap-3 pl-8 pr-10 py-4 rounded-full text-white font-bold text-base lg:text-lg tracking-wide bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-[0_0_40px_rgba(168,85,247,0.55)] hover:shadow-[0_0_60px_rgba(217,70,239,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out"></span>
              <i className="ri-chat-1-line text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300"></i>
              <span className="relative z-10">Free Chat</span>
              <span className="relative z-10 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
            </Link>
          </div>
        </div>
 
        {/* RIGHT IMAGE */}
        <div
          className="
            relative
            w-full
            lg:w-1/2
            flex
            justify-center
            items-center
            mt-28
            lg:mt-0
          "
        >
          <img
            src={handbg}
            alt="Hand Background"
            className="
              absolute
              w-[90%]
              lg:w-[80%]
              hand
              opacity-90
            "
          />
 
          <img
            src={hand}
            alt="Hand"
            className="
              relative
              z-10
              w-[35%]
              lg:w-[45%]
            "
          />
        </div>
      </section>
 
      {/* ZODIAC SECTION */}
      <ZodiacContainer />
    </div>
  );
};
 
export default Explore;