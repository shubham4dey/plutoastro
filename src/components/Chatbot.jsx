import { useDispatch, useSelector } from "react-redux";
import { CHAT_BOT } from "../utils/constants";
import React, { useRef, useState, useEffect } from "react";
import { addBot, addForm, addLimit } from "../store/configAppSlice";
import { toast, Bounce } from "react-toastify";
import logo from "../image/Logo.png";
import lang from "../utils/langConstants";

const Chatbot = () => {
  const input = useRef();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [apiLimit, setapiLimit] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi" }
  ]);

  const LangKey = useSelector((store) => store.configApp.lang);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handlebot = () => {
    dispatch(addBot());
  };

  const handleSearch = async () => {
    const inputValue = input.current?.value?.trim();
    
    if (!inputValue) return;

    if (!user) {
      toast.error("Please Login to Continue", {
        position: "top-right",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      dispatch(addBot());
      dispatch(addForm());
      return;
    }

    if (apiLimit > 6) {
      dispatch(addLimit(false));
      toast.error("Please come tomorrow. API limit exceeded.", {
        position: "top-right",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    setMessages(prev => [...prev, { sender: "user", text: inputValue }]);
    input.current.value = "";
    setIsLoading(true);

    try {
      let systemPrompt = "";
      if (typeof CHAT_BOT === "string") {
        systemPrompt = CHAT_BOT;
      } else if (typeof CHAT_BOT === "object") {
        systemPrompt = JSON.stringify(CHAT_BOT);
      }

      // ✅ FIXED: Render Backend API URL
      const response = await fetch("http://localhost:5000/api/openai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt || "You are a helpful astrology assistant." },
            { role: "user", content: inputValue }
          ]
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const Response = data?.choices?.[0]?.message?.content;
      
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: Response || "Sorry, I couldn't process that." 
      }]);
      
      setapiLimit(apiLimit + 1);
    } catch (error) {
      console.error("Chatbot Error:", error);
      
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const messagesLeft = Math.max(0, 7 - apiLimit);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={handlebot}
      ></div>

      {/* Chat Window - Positioned below header */}
      <div className="relative w-full max-w-2xl h-[75vh] max-h-[650px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-purple-600/30 animate-slideUp mt-16">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-fuchsia-950"></div>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-700 px-6 py-4 flex items-center justify-between border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
              <img 
                className="relative w-10 h-10 rounded-full border-2 border-white/30" 
                src={logo} 
                alt="logo"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                {lang[LangKey]?.astroBot || "Pluto Bot"}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-purple-200 text-xs">Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlebot}
            className="w-10 h-10 rounded-full bg-purple-800/50 hover:bg-red-600/80 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-purple-500/30"
          >
            <i className="text-xl text-white ri-close-fill"></i>
          </button>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="relative h-[calc(100%-140px)] overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-messageIn`}
            >
              {msg.sender === "bot" && (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🔮</span>
                  </div>
                  <div className="bg-purple-800/60 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 border border-purple-600/30">
                    <p className="text-purple-100 text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <div className="flex gap-1 mt-2">
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}

              {msg.sender === "user" && (
                <div className="max-w-[80%]">
                  <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl rounded-tr-md px-4 py-3 shadow-lg shadow-purple-600/30">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <div className="flex gap-1 mt-2 justify-end">
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                      <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                  <span className="text-sm">🔮</span>
                </div>
                <div className="bg-purple-800/60 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 border border-purple-600/30">
                  <p className="text-purple-200 text-sm">AstroBot is typing...</p>
                  <div className="flex gap-1.5 mt-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-fuchsia-900/95 backdrop-blur-md border-t border-purple-600/30 px-6 py-4">
          {/* Messages Left Counter - Only show when 3 or less messages left */}
          {messagesLeft <= 3 && (
            <div className="absolute -top-3 right-6 px-3 py-1 bg-purple-700/80 rounded-full border border-purple-500/30 animate-fadeIn">
              <span className="text-purple-200 text-xs font-medium">
                {messagesLeft} messages left
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <input
              className="flex-1 px-5 py-3 bg-purple-900/60 border border-purple-600/30 rounded-full text-white placeholder-purple-300/50 outline-none focus:border-purple-500/60 focus:bg-purple-900/80 transition-all text-sm"
              type="text"
              placeholder="Ask anything you want..."
              ref={input}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-purple-500/30"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <i className="text-xl text-white ri-send-plane-2-fill"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        
        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-messageIn {
          animation: messageIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Custom Scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(147, 51, 234, 0.1);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.5);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Chatbot;