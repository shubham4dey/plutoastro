import useChat from "../custom hooks/useChat";
import { useSelector } from "react-redux";
import { ChatCardContainer } from "./CardContainer";
import ShimmerList from "../shimmer/ShimmerList";
import { useState } from "react";
import lang from "../utils/langConstants";
import Chatbot from "./Chatbot";
import bg from "../image/bg1.jpg";

const Chat = () => {
  const [search, setSearch] = useState("");
  const [mainchatList, setMainchatList] = useState(null);

  const Langkey = useSelector((store) => store.configApp.lang);
  const Bot = useSelector((store) => store.configApp.Bot);

  useChat();
  const chatList = useSelector((store) => store.astro.chatList);

  // Fix: Ensure chatList is always an array
  const safeChatList = Array.isArray(chatList) ? chatList : [];

  if (!Array.isArray(chatList)) return <ShimmerList />;

  const sortedChatList = [...safeChatList].sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    return 0;
  });

  const onlineCount = safeChatList.filter(
    (astro) => astro.status === "online",
  ).length;

  const topRatedCount = safeChatList.filter((astro) => astro.rating >= 4.8).length;

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    setSearch(searchTerm);

    const filteredList = safeChatList.filter(
      (astro) =>
        astro.name?.toLowerCase().includes(searchTerm) ||
        astro.skills?.some((skill) => skill.toLowerCase().includes(searchTerm)),
    );

    setMainchatList(filteredList);
  };

  const btnCSS =
    "lg:text-base focus:bg-purple-800 active:bg-purple-800 active:bg-purple-900 active:text-purple-100 bg-purple-600 bg-opacity-10 hover:bg-purple-800 transition-all text-sm border px-4 lg:px-4 py-2 lg:py-1.5 border-purple-600 text-purple-300 font-normal rounded-3xl sm:rounded-full cursor-pointer";

  return (
    <div className="relative w-12/12 ">
      {Bot && <Chatbot />}
      <img
        alt="bg"
        className="h-screen w-full md:scale-100 scale-x-[3] brightness-50 fixed top-0 left-0 -z-40"
        src={bg}
      ></img>
      <div className="pt-16 lg:pt-12 px-4 lg:px-20 md:px-16 flex flex-col justify-center items-start">
        <div className="w-full flex lg:flex-row flex-col justify-between mt-32 lg:mt-36 lg:mb-4 mb-3 items-start lg:items-center">
          <div>
            <span className="text-3xl lg:text-4xl lg:py-0 text-purple-200 font-bold">
              {lang[Langkey].chat}
            </span>

            <p className="text-green-400 text-sm mt-1">
              🟢 {onlineCount} Astrologers Online
            </p>

            <p className="text-yellow-400 text-sm">
              ⭐ {topRatedCount} Top Rated Astrologers
            </p>

            <p className="text-purple-300 text-sm">
               {safeChatList.length} Available Astrologers
            </p>
          </div>

          <div className="flex pt-4 lg:pt-0 w-full lg:w-5/12 relative items-center z-[100]">
            <input
              type="text"
              placeholder={lang[Langkey].search}
              value={search}
              onChange={handleSearch}
              className="border outline-none w-full  placeholder-purple-800 placeholder-opacity-50 text-base relative z-[100] border outline-none lg:text-lg rounded-full bg-purple-300 text-purple-950 outline-1 outline-purple-700 border-purple-400 pl-9  py-0.5  lg:py-1.5 px-2"
            />

            <i className="ri-search-line text-purple-800 absolute left-3"></i>

            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setMainchatList(safeChatList);
                }}
                className="absolute right-4 text-purple-800 font-bold z-[100]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full whitespace-nowrap overflow-x-scroll  no-scrollbar justify-start items-center pt-0.5 lg:pt-2 gap-2 lg:gap-4 flex-row">
          <span className={btnCSS}>
            <i className="ri-filter-2-line pr-1"></i>
            {lang[Langkey].filter}
          </span>
          <button
            className={btnCSS}
            onClick={() => {
              setMainchatList(safeChatList);
            }}
          >
            {lang[Langkey].all}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const top = safeChatList.filter((astro) => astro.rating >= 4.8);
              setMainchatList(top);
            }}
          >
            {lang[Langkey].topRated}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              let off = safeChatList.filter((off) => off.isShowOffer === true);
              setMainchatList(off);
            }}
          >
            {lang[Langkey].offer}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const vedic = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("vedic"),
                ),
              );

              setMainchatList(vedic);
            }}
          >
            {lang[Langkey].vedic}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const num = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("numerology"),
                ),
              );

              setMainchatList(num);
            }}
          >
            {lang[Langkey].numerology}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const tarot = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("tarot"),
                ),
              );

              setMainchatList(tarot);
            }}
          >
            {lang[Langkey].tarot}
          </button>

          <button
            className={btnCSS}
            onClick={() => {
              const faceReading = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("face reading"),
                ),
              );

              setMainchatList(faceReading);
            }}
          >
            {lang[Langkey].faceReading}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const vastu = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("vastu"),
                ),
              );

              setMainchatList(vastu);
            }}
          >
            {lang[Langkey].vastu}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const lifeCoach = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("life coach"),
                ),
              );

              setMainchatList(lifeCoach);
            }}
          >
            {lang[Langkey].lifeCoach}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const psychologist = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("psychologist"),
                ),
              );

              setMainchatList(psychologist);
            }}
          >
            {lang[Langkey].psychologist}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const palmistry = safeChatList.filter((astro) =>
                astro.skills?.some((skill) =>
                  skill.toLowerCase().includes("palmistry"),
                ),
              );

              setMainchatList(palmistry);
            }}
          >
            {lang[Langkey].palmistry}
          </button>
          <button
            className={btnCSS}
            onClick={() => {
              const online = safeChatList.filter(
                (astro) => astro.status === "online",
              );

              setMainchatList(online);
            }}
          >
            Online
          </button>

          <button
            className={btnCSS}
            onClick={() => {
              const busy = safeChatList.filter((astro) => astro.status === "busy");

              setMainchatList(busy);
            }}
          >
            Busy
          </button>

          <button
            className={btnCSS}
            onClick={() => {
              const offline = safeChatList.filter(
                (astro) => astro.status === "offline",
              );

              setMainchatList(offline);
            }}
          >
            Offline
          </button>
        </div>
      </div>
      <div>
        <div>
          {(mainchatList || sortedChatList).length > 0 ? (
            <ChatCardContainer list={mainchatList || sortedChatList} />
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
export default Chat;
