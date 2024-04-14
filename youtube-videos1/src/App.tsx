import React, { useState } from 'react';
import Modal from './components/Modal';
import {notesData} from './notes';
import {rawData} from './data/videosCSV.ts'
import './App.css';
import ReactPlayer from 'react-player';

interface Video {
  category: string;
  playlist: string;
  title: string;
  url: string;
}

const parseRawData = (rawData: string): Video[] => {
  return rawData.split('\n').map((entry) => {
    const [category, playlist, title, url] = entry.split(',');
    return { category, playlist, title, url };
  });
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState<Video[]>(parseRawData(rawData));
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>("All");
  const [modalText, setModalText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredVideos = videos.filter((video) => {
    return (
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || !selectedCategory || video.category === selectedCategory) &&
      (selectedPlaylist === "All" || !selectedPlaylist || video.playlist === selectedPlaylist)
    );
  });

  const categories = ['All', ...Array.from(new Set(videos.map((video) => video.category)))];
  const playlists =
    selectedCategory &&
    selectedCategory === 'All'
      ? undefined :
    ["All", ...Array.from(new Set(videos.filter((video) => video.category === selectedCategory).map((video) => video.playlist)))];

  const openModalCategory = (selectedCategory: string) => {
    if (selectedCategory && notesData[selectedCategory]) {
      setModalText(notesData[selectedCategory].notes);
      setIsModalOpen(true);
    }
  };

  const openModalPlaylist = (selectedPlaylist: string) => {
    if (selectedCategory && selectedPlaylist && notesData[selectedCategory] && notesData[selectedCategory][selectedPlaylist]) {
      setModalText(notesData[selectedCategory][selectedPlaylist]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalText('');
    setIsModalOpen(false);
  };

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search your video..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="btns-category">
        {categories.map((category) => (
          <button
            className={`btn-category${selectedCategory === category ? ' active' : ''}`}
            key={category}
            onClick={() => {setSelectedCategory(category === 'All' ? 'All' : category), setSelectedPlaylist('All') }}
          >
            {category}
            <button className="btn-notes" onClick={() => openModalCategory(category)}>
              Notes
            </button>
          </button>
        ))}
      </div>
      {selectedCategory && playlists && (
        <div className="btns-playlist">
          {playlists.map((playlist) => (
            <button
              className={`btn-playlist${selectedPlaylist === playlist ? ' active' : ''}`}
              key={playlist}
              onClick={() => setSelectedPlaylist(playlist === "All" ? 'All' : playlist)}
            >
              {playlist}
              <button className="btn-notes" onClick={() => openModalPlaylist(playlist)}>
                Notes
              </button>
            </button>
          ))}
        </div>
      )}
      <div className="videos-container">
        {filteredVideos.map((video, index) => (
          <div className="video-container" key={index}>
            {/* <iframe
              width="300"
              height="169"
              src={video.url.replace('watch?v=', 'embed/')}
              title={video.title} 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
            <ReactPlayer
              width="300px"
              height="169px"
              // src={video.url.replace('watch?v=', 'embed/')}
              url={video.url}
              light={true}
              // title={video.title} 
              // allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              // allowFullScreen
            />
            <p className="video-title">{video.title}</p>
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} text={modalText} />
    </div>
  );
};

export default App;
