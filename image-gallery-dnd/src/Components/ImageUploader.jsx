import React from "react";

const ImageUploader = ( { handleFileChange }) => {
  return (
    <div className=" flex flex-col  items-center justify-center  ">
      <label
        htmlFor="file-upload"
        className=" text-teal-500 hover:cursor-pointer  text-base md:text-2xl  bg-slate-200 hover:bg-gray-300 rounded-md  font-semibold px-2 md:px-4 py-1 md:py-2 cursor-pointer custom-file-upload"
      >
        <span className="mt-2 bg-left-bottom bg-gradient-to-r from-teal-500 to-teal-500 bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out">Upload</span>
        
      </label>
      <input
        className="cursor-pointer"
        id="file-upload"
        type="file"
        name="image"
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
};

export default ImageUploader;
