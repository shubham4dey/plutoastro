import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

function AIChat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [astrologer, setAstrologer] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchAstrologer();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const fetchAstrologer =
    async () => {
      try {
        setPageLoading(true);

        console.log(
          "AI CHAT ID =",
          id
        );

        if (!id) {
          setError(
            "AI Astrologer ID Missing"
          );
          return;
        }

        // ✅ CHANGE 1: Localhost URL for development (Production ke liye neeche wali uncomment karna)
        const url = `https://plutoastro-backend.onrender.com/api/ai-astrologers/${id}`;
        // const url = `https://plutoastro-backend.onrender.com/api/ai-astrologers/${id}`;

        console.log(
          "FETCH URL =",
          url
        );

        const response =
          await axios.get(url);

        console.log(
          "AI DATA =",
          response.data
        );

        const data =
          response.data;

        setAstrologer(data);

        setMessages([
          {
            sender: "ai",
            text: `🙏 Namaste! I am ${data.name}. How can I help you today?`,
          },
        ]);
      } catch (err) {
        console.log(
          "AI FETCH ERROR",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            "Unable to load AI Astrologer"
        );
      } finally {
        setPageLoading(false);
      }
    };

  const sendMessage =
    async () => {
      if (!message.trim())
        return;

      const userMessage =
        message.trim();

      setMessages((prev) => [
        ...prev,
        {
          sender: "user",
          text: userMessage,
        },
      ]);

      setMessage("");
      setLoading(true);

      try {
        // ✅ CHANGE 2: Format history for Gemini backend
        const chatHistory = messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          content: msg.text,
        }));

        // ✅ CHANGE 3: Correct Endpoint & Payload for AI Chat
        const response =
          await axios.post(
            `https://plutoastro-backend.onrender.com/api/ai-astrologers/${id}/chat`,
            {
              message: userMessage,
              history: chatHistory,
            }
          );

        // ✅ CHANGE 4: Extract response from new backend format
        const aiReply =
          response.data?.message ||
          "No response";

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: aiReply,
          },
        ]);
      } catch (error) {
        console.log(error);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text:
              "❌ AI Server Error",
          },
        ]);
      }

      setLoading(false);
    };

  const handleKeyDown = (
    e
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#090015] flex items-center justify-center text-white text-xl">
        Loading AI Astrologer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#090015] flex items-center justify-center px-4">
        <div className="bg-[#1b0834] border border-red-500 rounded-3xl p-8 text-center max-w-lg">
          <h2 className="text-red-400 text-2xl font-bold mb-4">
            Error
          </h2>

          <p className="text-white mb-6">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/ai-astro")
            }
            className="px-6 py-3 bg-purple-600 rounded-xl text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-[#090015]
      px-4
      pb-8
      pt-40
    "
    >
      <div
        className="
        max-w-5xl
        mx-auto
      "
      >
        <div
          className="
          flex
          items-center
          justify-between
          mb-5
        "
        >
          <button
            onClick={() =>
              navigate(-1)
            }
            className="
            bg-purple-700
            hover:bg-purple-600
            px-4
            py-2
            rounded-xl
            text-white
            font-semibold
          "
          >
            ← Back
          </button>

          <h1
            className="
            text-white
            text-2xl
            font-bold
          "
          >
            {astrologer?.name}
          </h1>

          <div />
        </div>

        <div
          className="
          bg-[#1b0834]
          border
          border-purple-800
          rounded-3xl
          p-5
          h-[65vh]
          overflow-y-auto
          shadow-xl
        "
        >
          {messages.map(
            (
              msg,
              index
            ) => (
              <div
                key={index}
                className={`flex mb-5 ${
                  msg.sender ===
                  "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] px-5 py-3 rounded-2xl whitespace-pre-wrap ${
                    msg.sender ===
                    "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                      : "bg-purple-950 text-purple-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="text-purple-300 animate-pulse">
              ✨ Reading your stars...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div
          className="
          mt-5
          flex
          gap-3
          items-end
        "
        >
          <textarea
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="Ask anything about love, career, marriage, finance..."
            rows={2}
            className="
            flex-1
            resize-none
            rounded-2xl
            p-4
            bg-[#130324]
            border
            border-purple-700
            text-purple-200
            placeholder-purple-500
            outline-none
          "
          />

          <button
            onClick={
              sendMessage
            }
            disabled={
              loading
            }
            className="
            px-8
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            text-white
            font-bold
          "
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;