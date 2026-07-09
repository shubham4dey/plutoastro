import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
 
import lang from "../utils/langConstants";
import ZodiacContainer from "./ZodiacContainer";
 
import handbg from "../image/hand_bg.png";
import hand from "../image/hand.png";
 
import { addBot } from "../store/configAppSlice";
 
const Explore = () => {
  const Langkey = useSelector((store) => store.configApp.lang);
 
  const dispatch = useDispatch();
 
  const handlebot = () => {
    dispatch(addBot());
  };
 
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
 
          {/* BUTTONS */}
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
            {/* Astro Bot */}
            <button
              onClick={handlebot}
              className="
                px-6
                py-3
                rounded-full
                bg-purple-700
                border-2
                border-purple-700
                text-white
                font-semibold
                uppercase
                shadow-lg
                hover:bg-transparent
                hover:scale-105
                transition-all
                duration-300
              "
            >
              {lang[Langkey].astroBot}
            </button>
 
            {/* Kundli GPT */}
            <Link to="/kundligpt">
              <button
                className="
                  px-6
                  py-3
                  rounded-full
                  bg-purple-700
                  border-2
                  border-purple-700
                  text-white
                  font-semibold
                  uppercase
                  shadow-lg
                  hover:bg-transparent
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                {lang[Langkey].astroKundli}
              </button>
            </Link>
 
            {/* NEW AI ASTRO */}
            <Link to="/ai-astro">
              <button
                className="
                  px-6
                  py-3
                  rounded-full
                  bg-gradient-to-r
                  from-fuchsia-600
                  to-purple-700
                  text-white
                  font-semibold
                  uppercase
                  shadow-lg
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                🤖 AI Astro
              </button>
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