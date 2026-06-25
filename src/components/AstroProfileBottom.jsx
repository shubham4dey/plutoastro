import React from 'react';

const AstroProfileBottom = ({ data }) => {
  if (!data) {
    return <div className="text-center text-purple-300 py-10">Loading...</div>;
  }

  return (
    <div className="rounded-2xl text-purple-300 shadow-zinc-700 bg-purple-950 bg-opacity-55 flex flex-col lg:px-10 px-4 py-4 lg:py-10 w-full mt-4 my-20">

      <div className="w-full flex lg:gap-4 gap-1 flex-col">
        <span className="lg:text-3xl text-2xl uppercase font-bold">
          About Astrologer
        </span>

        <span
          style={{ wordSpacing: "2px" }}
          className="lg:text-lg text-sm tracking-wide font-normal text-gray-300"
        >
          {data?.name} is an experienced astrologer with{" "}
          {data?.experience || 0} years of experience in{" "}
          {data?.skills && data.skills.length > 0 
            ? data.skills.join(", ") 
            : "astrology and spiritual guidance"}.
          {data?.rating && (
            <span className="block mt-2">
              ⭐ Rating: {data.rating}/5
            </span>
          )}
        </span>
      </div>

      <div className="lg:py-4 py-2">
        <span className="lg:text-xl text-lg font-bold">
          Languages:
        </span>

        <span className="lg:text-base text-sm px-2">
          {data?.languages && data.languages.length > 0 
            ? data.languages.join(", ") 
            : "English, Hindi"}
        </span>
      </div>

      <div className="lg:py-4 py-2">
        <span className="lg:text-xl text-lg font-bold">
          Consultation Fee:
        </span>

        <span className="lg:text-base text-sm px-2">
          ₹{data?.pricePerMinute || 0}/min
        </span>
      </div>

      <div className="lg:py-4 py-2">
        <span className="lg:text-xl text-lg font-bold">
          Status:
        </span>

        <span className="lg:text-base text-sm px-2">
          {data?.status === "online" ? (
            <span className="text-green-400">● Online - Available for consultation</span>
          ) : data?.status === "busy" ? (
            <span className="text-yellow-400">● Busy - Will be available soon</span>
          ) : (
            <span className="text-red-400">● Offline - Currently unavailable</span>
          )}
        </span>
      </div>

      <div className="lg:py-4 py-2">
        <span className="lg:text-xl text-lg font-bold">
          Total Experience:
        </span>

        <span className="lg:text-base text-sm px-2">
          {data?.experience || 0} Years
        </span>
      </div>

      <div className="lg:py-4 py-2">
        <span className="lg:text-xl text-lg font-bold">
          Orders Completed:
        </span>

        <span className="lg:text-base text-sm px-2">
          {data?.orders || 250}+
        </span>
      </div>

    </div>
  );
};

export default AstroProfileBottom;