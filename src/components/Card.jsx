import ShimmerList from "../shimmer/ShimmerList";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";

const Card = ({ info }) => {
const Langkey = useSelector(
(store) => store.configApp.lang
);

if (!info) {
return <ShimmerList />;
}

return ( <div
   className="
     flex justify-start
     overflow-hidden
     shadow-lg shadow-purple-900/40
     hover:shadow-purple-500/50
     hover:scale-[1.03]
     transition-all
     duration-300
     w-full
     bg-purple-950
     bg-opacity-55
     rounded-xl
     gap-4
     px-2
     py-2
     items-start
     h-full
     flex-row
   "
 >
{/* LEFT */} <div className="w-3/12 h-full py-2 flex flex-col justify-start items-center"> <div className="relative">
<img
src={info?.image || "/Logo.png"}
alt={info?.name || "profile"}
className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 bg-purple-800"
onError={(e) => {
e.target.src = "/Logo.png";
}}
/>


      {info?.status === "online" && (
        <span className="absolute bottom-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
    </div>

    <div className="mt-2">
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
      {info?.orders || 0} {lang[Langkey].orders}
    </span>
  </div>

  {/* CENTER */}
  <div className="w-7/12 py-2 flex flex-col gap-1">
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-purple-200 font-semibold">
        {info?.name}
      </span>

      {info?.favorite && (
        <span className="text-red-500">❤️</span>
      )}
    </div>

    {info?.rating >= 4.8 && (
      <span className="text-yellow-400 text-xs">
        👑 Top Rated
      </span>
    )}

    <span className="text-sm text-purple-100 font-semibold">
      {Array.isArray(info?.skills)
        ? info.skills.join(", ")
        : ""}
    </span>

    <span
      className={`text-sm font-semibold ${
        info?.status === "online"
          ? "text-green-400"
          : info?.status === "busy"
          ? "text-yellow-400"
          : "text-red-400"
      }`}
    >
      ● {info?.status}
    </span>

    <span className="text-sm text-purple-100 font-semibold">
      {lang[Langkey].exp} : {info?.experience}{" "}
      {lang[Langkey].years}
    </span>

    <span className="text-sm text-purple-100">
      <span className="text-base pr-1 font-semibold text-purple-100">
        ₹{info?.pricePerMinute}
      </span>
      /{lang[Langkey].min}
    </span>
  </div>

  {/* RIGHT */}
  <div className="w-2/12 h-full flex flex-col justify-between items-end">
    <div>
      {info?.tick && (
        <i className="lg:text-2xl md:text-xl text-lg text-[#9400D3] ri-verified-badge-fill"></i>
      )}
    </div>

    <button className="px-5 py-1 hover:bg-purple-500 hover:text-white rounded-md text-sm border text-purple-400 border-zinc-400 transition-all">
      Chat
    </button>
  </div>
</div>


);
};

export default Card;
