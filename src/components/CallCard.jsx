import ShimmerList from "../shimmer/ShimmerList";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://plutoastro-backend.onrender.com";

const CallCard = ({ info }) => {
  const Langkey = useSelector((store) => store.configApp?.lang) || "en";
  const currentLang = lang[Langkey] || lang["en"] || {};

  if (!info) {
    return <ShimmerList />;
  }

  const imageSrc =
    info?.image && typeof info.image === "string"
      ? info.image.startsWith("http")
        ? info.image
        : `${BASE_URL}${info.image}`
      : "/Logo.png";

  return (
    <div className="flex flex-row justify-start items-start gap-4 w-full h-full px-2 py-2 bg-purple-950/55 rounded-xl shadow-sm shadow-zinc-700 hover:bg-purple-800/55 transition-all duration-300 overflow-hidden">
      
      {/* LEFT */}
      <div className="w-3/12 h-full py-2 flex flex-col justify-start items-center gap-2">
        {/* ✅ FIXED: Proper image container with overlay */}
        <div className="relative w-20 h-20">
          {/* Purple placeholder circle */}
          <div className="w-20 h-20 rounded-full bg-purple-800"></div>
          
          {/* Actual image - properly overlaid */}
          <img
            src={imageSrc}
            alt={info?.name || "profile"}
            className="absolute top-0 left-0 w-20 h-20 rounded-full object-cover border-2 border-purple-400"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Stars */}
        <div>
          {info?.rating > 4.9 ? (
            <>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-half-s-fill text-yellow-400"></i>
            </>
          ) : (
            <>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-s-fill text-yellow-400"></i>
              <i className="ri-star-half-s-fill text-yellow-400"></i>
            </>
          )}
        </div>

        <span className="text-xs text-purple-100 font-semibold">
          {info?.orders || 0} {currentLang.orders || "Orders"}
        </span>
      </div>

      {/* CENTER */}
      <div className="w-6/12 py-2 h-full flex flex-col gap-1 justify-start items-start">
        <span className="text-purple-200 font-semibold text-base">
          {info?.name}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {Array.isArray(info?.skills) ? info.skills.join(", ") : ""}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {Array.isArray(info?.languages) ? info.languages.join(", ") : ""}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {currentLang.exp || "Exp"} : {info?.experience || 0} {currentLang.years || "Years"}
        </span>

        <span className="text-sm text-purple-100 mt-1">
          <span className="text-base pr-1 font-semibold text-purple-100">
            ₹{info?.pricePerMinute || 0}
          </span>
          /{currentLang.min || "min"}
        </span>
      </div>

      {/* RIGHT */}
      <div className="w-3/12 h-full flex flex-col justify-between items-end">
        <div>
          {info?.verified && (
            <i className="lg:text-2xl md:text-xl text-lg text-[#9400D3] ri-verified-badge-fill opacity-70"></i>
          )}
        </div>

        <div>
          <button className="px-5 py-1.5 hover:bg-purple-500 hover:text-white rounded-md text-sm border border-zinc-400 text-purple-400 transition-all duration-200">
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallCard;