import React from "react";

const OverlayImage = ({ url , isDragging }) => {
  return (
    <div className={`h-full w-full overflow-hidden border-slate-200 border-2 border-solid rounded-xl ${isDragging && "cursor-grabbing" }`}>
      <img className="h-full w-full object-cover" src={url} />
    </div>
  );
};

export default OverlayImage;
