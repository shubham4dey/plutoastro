import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Explore from "./Explore";
import SignSearch from "./SignSearch";
import Chatbot from "./Chatbot";
import Coming from "./Coming";
import AstrologersGrid from "./AstrologersGrid";
import AIAstrologers from "./AIAstrologers";
import AstrologyProducts from "./AstrologyProducts";
import FAQ from "./FAQ";
import SpecialtiesBanner from "./SpecialtiesBanner";
import AppDownload from "./AppDownload";

import bg from "../image/newbg.jpg";
import logo from "../image/Logo.png";

import { addBot } from "../store/configAppSlice";

const Hero = () => {
  const [topAstro, setTopAstro] = useState([]);
  const dispatch = useDispatch();

  const Bot = useSelector(
    (store) => store.configApp.Bot
  );

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.consultant.list.astrotalk.com/AstroTalk/freeAPI/consultant/get-list/filter?appId=4&businessId=1&consultantTypeId=1&timezone=Asia/Kolkata&pageNo=0&pageSize=18&version=1.19.09.23&serviceId=4&languageId=1&hardwareId=&countryCode=&sortByRating=false&sortByExperience=false&sortByPrice=false&sortByOrder=false&isDesc=false&isPoAstrologer=true&userId=34925941"
      );

      const json = await response.json();
      setTopAstro(json?.content || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBot = () => {
    dispatch(addBot());
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background */}
      <div
        className="fixed inset-0 -z-50"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {Bot && <Chatbot />}

      {/* Main Content */}
      <div className="relative z-10 pt-24 lg:pt-32">

        <Explore />

        {/* Specialties & Languages Banner - MOVED HERE (After Explore, Before Astrologers) */}
        <div className="mt-28 lg:mt-36">
          <SpecialtiesBanner />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-14">

          {/* Human Astrologers */}
          <div className="mt-32 lg:mt-40">
            <AstrologersGrid />
          </div>

          {/* AI Astrologers */}
          <div className="mt-28 lg:mt-36">
            <AIAstrologers />
          </div>

          {/* Astrology Products */}
          <div className="mt-28 lg:mt-36">
            <AstrologyProducts />
          </div>

          {/* Zodiac Search */}
          <div className="mt-28 lg:mt-36">
            <SignSearch />
          </div>

          {/* Coming Soon */}
          <div className="mt-28 lg:mt-36">
            <Coming />
          </div>

          {/* App Download Section */}
          <div className="mt-28 lg:mt-36">
            <AppDownload />
          </div>

          {/* FAQ Section - ONLY ON HOME PAGE */}
          <div className="mt-28 lg:mt-36 pb-24">
            <FAQ />
          </div>

        </div>
      </div>

      {/* Floating Bot */}
      <div
        className="
          hidden
          md:block
          fixed
          right-5
          bottom-5
          z-50
        "
      >
        <img
          src={logo}
          alt="Pluto Bot"
          onClick={handleBot}
          className="
            w-24
            lg:w-32
            cursor-pointer
            hover:scale-110
            transition-all
            duration-300
            drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]
          "
        />
      </div>

    </div>
  );
};

export default Hero;