import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

import ImageCard from "./Components/ImageCard";
import OverlayImage from "./Components/OverlayImage";
import Loader from "./Components/Loader";
import ImageUploader from "./Components/ImageUploader";
import { Analytics } from '@vercel/analytics/react';


function App() {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [totalChecked, setTotalChecked] = useState(0);

  useEffect(() => {
    axios
      .get("https://nest-image-gallery.vercel.app/api/v1/image/all")
      .then(function (response) {
        const imageData = response.data.map((image) => {
          const newImage = { ...image, id: image._id, isChecked: false };
          return newImage;
        });
        setImages(imageData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  //to handle bulk unselect
  const handleUnChecked = () => {
    const uncheckedImages = images.map((img) => {
      return { ...img, isChecked: false };
    });
    setImages(uncheckedImages);

    setTotalChecked(0);
  };

  //to handle individual select
  const checked = (index) => {
    const updatedImages = [...images];
    updatedImages[index].isChecked = !updatedImages[index].isChecked;
    setImages(updatedImages);

    setTotalChecked(images.filter((image) => image.isChecked).length ?? 0);
  };

  //to handle delete
  const handleDelete = () => {
    const deletingIds = [];
    images.forEach((image) => {
      if (image.isChecked) {
        deletingIds.push(image.id);
      }
    });

    const deletingIdsStr = deletingIds.map((id) => `ids=${id}`).join("&");

    axios
      .delete(
        `https://nest-image-gallery.vercel.app/api/v1/image/delete-multiple?${deletingIdsStr}`
      )
      .then(function (response) {
        if (response.data.isDeleted) {
          const remainingImages = images.filter(
            (image) => !deletingIds.includes(image.id)
          );
          setImages(remainingImages);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    setTotalChecked(0);
  };

  const handleDragStart = (event) => {
    const active = images.find((image) => image.id === event.active.id);
    setActiveImage(active.url);
  };

  const handleDragCancel = () => {
    setActiveImage(null);
  };

  //to handle dnd kit OnDragEnd
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) {
      return;
    }
    setImages((images) => {
      const oldIndex = images.findIndex((image) => image.id === active.id);
      const newIndex = images.findIndex((image) => image.id === over.id);
      return arrayMove(images, oldIndex, newIndex);
    });
  };

  // setTotalChecked(images.filter((image) => image.isChecked).length ?? 0);

  //Separate imageCard for dnd kit with dnd kit function and props

  const handleFileChange = (e) => {
    const form = new FormData();

    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));

    form.append("image", file);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4389f6aa038004767b479af56fd374b6",
        form
      )
      .then(function (response) {
        createNewEntry({
          imgBBId: response.data.data.id,
          fileName: response.data.data.image.filename,
          url: response.data.data.image.url,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const createNewEntry = (body) => {
    axios
      .post("https://nest-image-gallery.vercel.app/api/v1/image/create", body)
      .then(function (response) {
        setImages([
          ...images,
          { ...response.data, id: response.data._id, isChecked: false },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
    setImage(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl">
        <div className="px-1.5 py-3 flex justify-between  border-black border-b-2">
          <div className="flex items-center space-x-10 ">
            <div className="flex items-center gap-4 border-4 border-white">
              {!!totalChecked && (
                <input
                  className="w-5 h-5 mt-1 md:h-7 md:w-7"
                  type="checkbox"
                  onChange={() => handleUnChecked()}
                  checked={totalChecked > 0 ? true : false}
                />
              )}
              <div className="mt-1 text-base font-semibold md:text-2xl">
                {totalChecked ? (
                  <p><span className="mr-2 text-red-500">{`${totalChecked}`}</span>Images Selected</p>
                ) : (
                  "Image Gallery"
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {!!totalChecked && (
              <div
                className="px-2 py-1 text-base font-semibold text-red-500 rounded-md hover:cursor-pointer md:text-2xl bg-slate-200 hover:bg-slate-300 md:px-4 md:py-2"
                onClick={handleDelete}
              >
                <span className="mt-3 bg-left-bottom bg-gradient-to-r from-red-500 to-red-500 bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Delete
                </span>
              </div>
            )}
            <ImageUploader handleFileChange={handleFileChange} />
          </div>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-5 pt-5 md:grid-cols-3 lg:grid-cols-5 ">
              {images?.length > 0 ? (
                images.map((elm, index) => (
                  <ImageCard
                    key={elm.id}
                    index={index}
                    elm={elm}
                    checked={checked}
                  />
                ))
              ) : (
                <Loader />
              )}

              {image ? (
                <div className="relative w-56 h-56 border-2 border-solid rounded-xl">
                  <img
                    src={image}
                    className="object-cover w-full h-full opacity-50 "
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="absolute w-10 h-10 animate-spin bottom-24 right-24"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                </div>
              ) : (
                ""
              )}
            </div>
          </SortableContext>
          <DragOverlay adjustScale >
            {activeImage ? <OverlayImage url={activeImage} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}

export default App;
