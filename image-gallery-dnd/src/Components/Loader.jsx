import React from "react";

const Loader = () => {
  return (
    <div className="w-max  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt  ">
      {Array.from({ length: 9 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse border-2 overflow-hidden  border-gray-300 rounded-lg w-56 h-56"
        >
          <div className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="0.5"
              stroke="currentColor"
              className="px-10 py-10 text-gray-500 bg-gray-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
