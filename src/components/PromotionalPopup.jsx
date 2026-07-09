import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addForm } from "../store/configAppSlice";

const PromotionalPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // Login form open karna
  const handleLoginClick = () => {
    dispatch(addForm());
    onClose();
  };

  // Call/Chat buttons
  const handleCallNow = () => {
    if (!user) {
      handleLoginClick();
    } else {
      window.location.href = "/call";
    }
  };

  const handleChatNow = () => {
    if (!user) {
      handleLoginClick();
    } else {
      window.location.href = "/chat";
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full relative overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
        >
          <i className="ri-close-line text-xl"></i>
        </button>

        {/* Yellow Header with Ganesha */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center relative">
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Ganesha_Basohli_miniature_circa_1730_Dubost_p74.jpg/220px-Ganesha_Basohli_miniature_circa_1730_Dubost_p74.jpg"
                alt="Ganesha"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              First Call/Chat FREE
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Astrologer Profiles */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                alt="Astrologer 1"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                alt="Astrologer 2"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face"
                alt="Astrologer 3"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
            Consult Expert AI Astrologers
          </h3>
          
          <p className="text-center text-gray-600 mb-6 text-sm">
            Get instant guidance on love, career, health & more
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCallNow}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
            >
              <i className="ri-phone-line mr-2"></i>
              Call Now
            </button>
            <button
              onClick={handleChatNow}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
            >
              <i className="ri-chat-smile-2-line mr-2"></i>
              Chat Now
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-600">
            <div>
              <i className="ri-shield-check-line text-green-600 text-lg mb-1 block"></i>
              <p>100% Verified</p>
            </div>
            <div>
              <i className="ri-time-line text-blue-600 text-lg mb-1 block"></i>
              <p>24/7 Available</p>
            </div>
            <div>
              <i className="ri-lock-line text-purple-600 text-lg mb-1 block"></i>
              <p>Secure & Private</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalPopup;