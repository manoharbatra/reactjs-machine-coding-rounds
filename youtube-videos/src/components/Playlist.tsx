import React, { useState, useEffect } from "react";
import Tabs from "./Tabs";
import VideoCard from "./VideoCard";
import { rawData } from "../data/videosCSV";

interface Video {
  playlist: string;
  title: string;
  url: string;
}

const Playlist: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    processData(rawData);
  }, []);

  const processData = (rawData: string) => {
    const lines = rawData.trim().split("\n");
    const videosData = lines.map((line) => {
      const [playlist, title, url] = line.split(",");
      return {
        playlist: playlist.trim(),
        title: title.trim(),
        url: url.trim(),
      };
    });
    setVideos(videosData);
  };

  const uniquePlaylists = ["All", ...Array.from(new Set(videos.map((video) => video.playlist)))];

  const handleClick = (playlist: string | null) => {
    setSelectedPlaylist(playlist);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredVideos = videos.filter((video) => {
    return (
      (selectedPlaylist === "All" || video.playlist === selectedPlaylist) &&
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="main-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search your video..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <Tabs playlists={uniquePlaylists} selectedPlaylist={selectedPlaylist} onClick={handleClick} />
      <div className="videos-container">
        {filteredVideos.map((video, index) => (
          <VideoCard key={index} title={video.title} url={video.url} />
        ))}
      </div>
    </div>
  );
};

export default Playlist;