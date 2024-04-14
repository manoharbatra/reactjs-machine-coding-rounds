import React from "react";

interface Props {
  playlists: string[];
  selectedPlaylist: string | null;
  onClick: (playlist: string | null) => void;
}

const Tabs: React.FC<Props> = ({ playlists, selectedPlaylist, onClick }) => {
  return (
    <div className="btns-playlist">
      {playlists.map((playlist: string) => (
        <button
          key={playlist}
          className={`btn-playlist${selectedPlaylist === playlist ? " active" : ""}`}
          onClick={() => onClick(playlist === "All" ? 'All' : playlist)}
        >
          {playlist}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

