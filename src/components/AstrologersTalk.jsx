import { useDispatch, useSelector } from "react-redux";
import { PROFILE_IMG, TALK_PROMPT } from "../utils/constants";
import bg from "../image/bg1.jpg";
import openai from "../utils/openai";
import React, { useRef, useState } from "react";
import { addBot, addForm, addLimit } from "../store/configAppSlice";
import { toast, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AstrologersTalk = () => {
  const astroProfile = useSelector((store) => store.astro.astroProfile);
  const { data } = astroProfile || {}; // ✅ FIX: Agar astroProfile null ho toh crash nahi hoga
  const info = data || {}; // ✅ FIX: info ko hamesha object ensure kiya
  
  const input = useRef();
  
  // ✅ FIX 1: "undefined: Hi" ko rokne ke liye fallback "Astrologer" lagaya
  const [result, setresult] = useState([(info?.name || "Astrologer") + ": Hi"]);
  const [apiLimit, setapiLimit] = useState(1);

  const user = useSelector((store) => store.user);
  const form = useSelector((store) => store.configApp.form);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlebot = () => {
    navigate("/astroProfile/" + (info?.name || "astrologer"));
  };

  const handleSearch = async () => {
    if (!user) {
      toast.error("Please Login to Continue", {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      dispatch(addBot());
      dispatch(addForm());
      return;
    }
    if (apiLimit > 4) {
      dispatch(addLimit(false));
      toast.error("Please come tomorrow, API limit exceeded", {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    const gptSearch =
      TALK_PROMPT +
      "name=" + (info?.name || "Astrologer") +
      "skills=" + (info?.skills || "Astrology") +
      "experience=" + (info?.exp || "10 years") +
      "user input=" + input.current.value;

    const data = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptSearch }],
      model: "gpt-3.5-turbo",
    });
    const Responce = data?.choices?.[0]?.message?.content;

    // ✅ FIX: Yahan bhi fallback lagaya taaki response ke saath "undefined" na aaye
    setresult([
      ...result,
      "You: " + input.current.value,
      (info?.name || "Astrologer") + ": " + (Responce || "Sorry, I couldn't process that."),
    ]);
    input.current.value = "";
    setapiLimit(apiLimit + 1);
  };

  return (
    // ✅ FIX 3: Responsive layout fix (pt-[20%] hata kar safe padding di, h-screen ki jagah h-[100dvh] for mobile browsers)
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center px-4 lg:px-16 bg-gray-900 overflow-hidden">
      
      {/* Background Image with safe scaling */}
      <img
        alt="bg"
        className="absolute inset-0 w-full h-full object-cover brightness-50 -z-10"
        src={bg}
      />

      {/* Main Chat Container */}
      <div className="w-full max-w-2xl rounded-xl overflow-hidden relative flex flex-col h-[85vh] lg:h-[80vh] bg-purple-950/80 backdrop-blur-sm border border-purple-800/50 shadow-2xl">
        
        {/* Header */}
        <div className="w-full flex flex-row justify-between items-center bg-purple-800/90 py-3 px-4 lg:px-6 shrink-0">
          <div className="flex flex-row gap-3 justify-center items-center">
            <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-purple-800 overflow-hidden border-2 border-purple-400">
              <img
                className="w-full h-full object-cover"
                src={PROFILE_IMG + (info?.picId || "")}
                alt="profile"
                onError={(e) => { e.target.src = "https://via.placeholder.com/50"; }} // ✅ Fallback image
              />
            </div>
            <span className="text-lg lg:text-2xl text-purple-100 font-semibold tracking-wide">
              {info?.name || "Astrologer"}
            </span>
          </div>
          <i
            className="text-2xl lg:text-3xl text-purple-300 ri-close-fill cursor-pointer hover:text-white transition"
            onClick={handlebot}
          ></i>
        </div>

        {/* Messages Area - ✅ FIX: flex-1 use kiya taaki height automatically adjust ho */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          {result?.map((msg, index) => {
            const isUser = msg.startsWith("You:");
            return (
              <div
                key={index}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm lg:text-base leading-relaxed shadow-md ${
                  isUser 
                    ? "bg-purple-600 text-white self-end rounded-br-none" 
                    : "bg-gray-800/80 text-purple-100 self-start rounded-bl-none border border-purple-700/50"
                }`}
              >
                <span>{msg}</span>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-purple-900/90 px-4 py-3 lg:px-6 lg:py-4 border-t border-purple-800">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }} // ✅ FIX: Enter key se bhi submit hoga
            className="w-full relative flex justify-center items-center"
          >
            <input
              className="w-full py-3 text-purple-900 font-medium outline-none px-4 text-base lg:text-lg rounded-xl pr-12 bg-purple-100 focus:ring-2 focus:ring-purple-500 transition"
              type="text"
              // ✅ FIX 2: Placeholder change kar diya
              placeholder="Type your message here..."
              ref={input}
            />
            <button
              type="submit"
              className="px-4 py-3 absolute right-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-lg"
            >
              <i className="text-xl ri-send-plane-2-fill"></i>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AstrologersTalk;