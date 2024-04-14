import React from "react";

interface Props {
  title: string;
  url: string;
}

const VideoCard: React.FC<Props> = ({ title, url }) => {
  return (
    <div className="video-container">
      <iframe
        width="300"
        height="169"
        src={url.replace('watch?v=', 'embed/')}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <p className="video-title">{title}</p>
    </div>
  );
};

export default VideoCard;
