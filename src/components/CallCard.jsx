import ShimmerList from "../shimmer/ShimmerList";
import lang from "../utils/langConstants";
import { useSelector } from "react-redux";

const CallCard = ({ info }) => {
  const Langkey = useSelector((store) => store.configApp.lang);

  if (!info) {
    return <ShimmerList />;
  }

  return (
    <div className="flex justify-start overflow-hidden shadow-sm shadow-zinc-700 hover:bg-purple-800 transition-all hover:bg-opacity-55 w-full bg-purple-950 bg-opacity-55 rounded-xl gap-4 px-2 py-2 items-start h-full flex-row">
      
      <div className="w-3/12 h-full py-2 flex flex-col justify-start items-center">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-purple-800 bg-opacity-85"></div>

          <img
            className="lg:w-20 absolute xl:left-[2px] bottom-0"
            src={info?.image}
            alt="profile"
          />
        </div>

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
          {lang[Langkey].orders}
        </span>
      </div>

      <div className="w-6/12 py-2 h-full flex flex-col gap-1 justify-start items-start">
        <span className="text-purple-200 font-semibold">
          {info?.name}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {info?.skills?.join(", ")}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {info?.languages?.join(", ")}
        </span>

        <span className="text-sm text-purple-100 font-semibold">
          {lang[Langkey].exp} : {info?.experience} {lang[Langkey].years}
        </span>

        <span className="text-sm text-purple-100">
          <span className="text-base pr-1 font-semibold text-purple-100">
            ₹{info?.pricePerMinute}
          </span>
          /{lang[Langkey].min}
        </span>
      </div>

      <div className="w-2/12 h-full flex flex-col gap-20 justify-between items-end">
        <div className="flex flex-row">
          {info?.verified && (
            <span>
              <i className="lg:text-2xl md:text-xl opacity-70 text-lg text-[#9400D3] ri-verified-badge-fill"></i>
            </span>
          )}
        </div>

        <div>
          <button className="px-5 py-1 hover:bg-purple-500 hover:text-white rounded-md text-sm border text-purple-400 border-zinc-400">
            Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallCard;