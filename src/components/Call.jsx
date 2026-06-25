import { useSelector } from "react-redux";
import { CallCardContainer } from "./CardContainer";
import ShimmerList from "../shimmer/ShimmerList";
import useCall from "../custom hooks/useCall";
import { useState, useEffect } from "react";
import lang from "../utils/langConstants";
import Chatbot from "./Chatbot";
import bg from "../image/bg1.jpg";

const Call = () => {
  const [search, setSearch] = useState("");
  const [mainCallList, setMaincallList] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [availableSkills, setAvailableSkills] = useState([]);

  const Langkey = useSelector((store) => store.configApp.lang);
  const Bot = useSelector((store) => store.configApp.Bot);

  useCall();
  const callList = useSelector((store) => store.astro.callList);

  // Ensure callList is always an array
  const safeCallList = Array.isArray(callList) ? callList : [];

  // Extract unique skills from astrologers
  useEffect(() => {
    if (safeCallList && safeCallList.length > 0) {
      const skillsSet = new Set();
      safeCallList.forEach((astro) => {
        if (astro.skills && Array.isArray(astro.skills)) {
          astro.skills.forEach((skill) => {
            if (skill) skillsSet.add(skill);
          });
        }
      });
      setAvailableSkills(Array.from(skillsSet));
    }
  }, [safeCallList]);

  if (!Array.isArray(callList)) return <ShimmerList />;

  const sortedCallList = [...safeCallList].sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return 0;
  });

  const onlineCount = safeCallList.filter(
    (astro) => astro.status === "online"
  ).length;

  const topRatedCount = safeCallList.filter((astro) => astro.rating >= 4.8)
    .length;

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    const filteredList = safeCallList.filter(
      (astro) =>
        astro.name?.toLowerCase().includes(searchTerm) ||
        astro.skills?.some((skill) =>
          skill.toLowerCase().includes(searchTerm)
        )
    );
    setMaincallList(filteredList);
    setActiveFilter("search");
  };

  const applyFilter = (filterType, filterValue = null) => {
    setActiveFilter(filterType);

    if (filterType === "all") {
      setMaincallList(null);
    } else if (filterType === "topRated") {
      const top = safeCallList.filter((astro) => astro.rating >= 4.8);
      setMaincallList(top);
    } else if (filterType === "offer") {
      const off = safeCallList.filter((off) => off.isShowOffer === true);
      setMaincallList(off);
    } else if (filterType === "online") {
      const online = safeCallList.filter((astro) => astro.status === "online");
      setMaincallList(online);
    } else if (filterType === "busy") {
      const busy = safeCallList.filter((astro) => astro.status === "busy");
      setMaincallList(busy);
    } else if (filterType === "offline") {
      const offline = safeCallList.filter(
        (astro) => astro.status === "offline"
      );
      setMaincallList(offline);
    } else if (filterType === "skill" && filterValue) {
      const skilled = safeCallList.filter((astro) =>
        astro.skills?.some(
          (skill) => skill.toLowerCase() === filterValue.toLowerCase()
        )
      );
      setMaincallList(skilled);
    }
  };

  const btnCSS =
    "lg:text-base active:bg-purple-900 focus:bg-purple-800 active:bg-purple-800 active:text-purple-100 bg-purple-600 bg-opacity-10 hover:bg-purple-800 transition-all text-sm border px-4 lg:px-4 py-2 lg:py-1.5 border-purple-600 text-purple-300 font-normal rounded-3xl sm:rounded-full cursor-pointer";

  const activeBtnCSS =
    "lg:text-base bg-purple-800 text-white transition-all text-sm border px-4 lg:px-4 py-2 lg:py-1.5 border-purple-600 font-normal rounded-3xl sm:rounded-full cursor-pointer";

  return (
    <div className="relative w-12/12 ">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-screen w-full brightness-50 md:scale-100 scale-x-[3] fixed top-0 left-0 -z-40"
        src={bg}
      ></img>
      <div className="pt-24 lg:pt-28 px-4 lg:px-20 md:px-16 flex flex-col justify-center items-start">
        <div className="w-full flex lg:flex-row flex-col justify-between mt-8 lg:mt-12 lg:mb-4 mb-3 items-start lg:items-center">
          <div>
            <span className="text-3xl lg:text-4xl text-purple-200 font-bold">
              {lang[Langkey].call}
            </span>

            <p className="text-green-400 text-sm mt-1">
              🟢 {onlineCount} Astrologers Online
            </p>

            <p className="text-yellow-400 text-sm">
              ⭐ {topRatedCount} Top Rated Astrologers
            </p>

            <p className="text-purple-300 text-sm">
              {safeCallList.length} Available Astrologers
            </p>
          </div>

          <div className="flex pt-3 w-full lg:w-5/12 relative items-center z-[100]">
            <input
              type="text"
              placeholder={lang[Langkey].search}
              value={search}
              onChange={handleSearch}
              className="border outline-none w-full placeholder-purple-800 placeholder-opacity-50 text-base relative z-[100] border outline-none lg:text-lg rounded-full bg-purple-300 text-purple-950 outline-1 outline-purple-700 border-purple-400 pl-9 py-0.5 lg:py-1.5 px-2"
            />

            <i className="ri-search-line text-purple-800 absolute left-3"></i>

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setMaincallList(null);
                  setActiveFilter("all");
                }}
                className="absolute right-4 text-purple-800 font-bold z-[100]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full whitespace-nowrap overflow-x-scroll no-scrollbar justify-start items-center pt-0.5 lg:pt-2 gap-2 lg:gap-4 flex-row">
          <span className={activeFilter === "filter" ? activeBtnCSS : btnCSS}>
            <i className="ri-filter-2-line pr-1"></i>
            {lang[Langkey].filter}
          </span>
          <button
            className={activeFilter === "all" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("all")}
          >
            {lang[Langkey].all}
          </button>
          <button
            className={activeFilter === "topRated" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("topRated")}
          >
            {lang[Langkey].topRated}
          </button>
          <button
            className={activeFilter === "offer" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("offer")}
          >
            {lang[Langkey].offer}
          </button>

          {/* Dynamic Skills Filters */}
          {availableSkills &&
            availableSkills.map((skill, index) => (
              <button
                key={index}
                className={
                  activeFilter === `skill-${skill}` ? activeBtnCSS : btnCSS
                }
                onClick={() => applyFilter("skill", skill)}
              >
                {skill}
              </button>
            ))}

          <button
            className={activeFilter === "online" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("online")}
          >
            Online
          </button>

          <button
            className={activeFilter === "busy" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("busy")}
          >
            Busy
          </button>

          <button
            className={activeFilter === "offline" ? activeBtnCSS : btnCSS}
            onClick={() => applyFilter("offline")}
          >
            Offline
          </button>
        </div>
      </div>

      <div>
        <div>
          {(mainCallList || sortedCallList).length > 0 ? (
            <CallCardContainer list={mainCallList || sortedCallList} />
          ) : (
            <h2 className="text-center text-white text-2xl py-10">
              No Astrologer Found
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Call;