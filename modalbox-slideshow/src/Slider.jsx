import './slider.css';

const Slider = ({ images, active, setActive }) => {
  const onNext = () => {
    if (active < images.length - 1) {
      setActive(active + 1);
    }
  };

  const onPrev = () => {
    if (active > 0) {
      setActive(active - 1);
    }
  };

  const isFirstImage = active === 0;
  const isLastImage = active === images.length - 1;

  return (
    <div className="slider">
      <div className="slides">
        {images.map((e, i) => (
          <Slide key={e.caption} {...e} active={i === active} />
        ))}
      </div>
      <div className="navigation">
        <div className="navigation-next-prev">
            {!isFirstImage && 
            (
              <div className="next-prev prev" onClick={onPrev}>
            {" "}
            &lt;{" "}
          </div>
            )}
          {!isLastImage && (<div className="next-prev next" onClick={onNext}>
            {" "}
            &gt;{" "}
          </div>)}
          
        </div>
      </div>
    </div>
  );
};

const Slide = ({ image_url, caption, active }) => {
  return (
    <div className={`slide ${active ? "active" : ""}`}>
      <img src={image_url} alt={caption} />
      <span>{caption}</span>
    </div>
  );
};

export default Slider;
