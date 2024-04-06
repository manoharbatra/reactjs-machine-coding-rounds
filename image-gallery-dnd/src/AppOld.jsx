import { useEffect, useState } from "react";
import "./App.css";
import { Images } from "./util/image.util";
import {
  DndContext,
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

function App() {
   const [images, setImages] = useState([...Images]);
  // const [images, setImages] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get("https://nest-image-gallery.vercel.app/api/v1/image/all")
  //     .then(function (response) {
  //       const imageData = response.data.map((image) => {
  //         return { ...image, isChecked: false };
  //       });
  //       setImages(imageData);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, []);

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
  };

  //to handle individual select
  const checked = (index) => {
    console.log("checked");
    const updatedImages = [...images];
    updatedImages[index].isChecked = !updatedImages[index].isChecked;
    setImages(updatedImages);
  };

  //to handle delete
  const handleDelete = () => {
    console.log("delete");
    const deletingIds = [];
    images.forEach((image) => {
      if (image.isChecked) {
        deletingIds.push(image._id);
      }
    });

    const deletingIdsStr = deletingIds.join(",");

    console.log("deletingIds", deletingIdsStr);

    axios
      .delete(
        "https://nest-image-gallery.vercel.app/api/v1/image/delete-multiple?ids=" +
          deletingIdsStr
      )
      .then(function (response) {
        console.log(response);
        if (response.data.isDeleted) {
          const remainingImages = images.filter(
            (image) => !deletingIds.includes(image._id)
          );
          setImages(remainingImages);
        }
      })
      .error(function (error) {
        console.log(error);
      });
  };

  //to handle dnd kit OnDragEnd
  const onDragEnd = (event) => {
    // console.log(event)
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

  //keeping the total selected img
  const totalChecked = images.filter((image) => image.isChecked).length ?? 0;

  //Separate imageCard for dnd kit with dnd kit function and props
  const ImageCard = ({ elm, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: elm._id });
    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`${index === 0 ? "row-span-2 col-span-2" : " "} group `}
        key={index}
        onClick={() => {
          console.log("Image clicked");
          checked(index);
        }}
      >
        <div className="relative overflow-hidden rounded-lg border-slate border-2  ">
          <img
            className="w-full object-fill"
            data-id={elm._id}
            src={elm?.url}
          />
          <div
            className={`absolute h-full w-full ${
              elm?.isChecked
                ? "bottom-0 opacity-100 bg-black/20"
                : "bg-black/40 opacity-0 -bottom-10"
            }  group-hover:bottom-0 group-hover:opacity-100 ease-out  group-hover:ease-out delay-150 duration-300`}
          >
            <div className=" py-5 px-5">
              <input
                className="w-5 h-5"
                onClick={() => {
                  console.log("Image clicked");
                  checked(index);
                }}
                defaultChecked={elm?.isChecked}
                type="checkbox"
              ></input>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleFileChange = (e) => {
    const form = new FormData();

    const file = e.target.files[0];
    console.log(file);
    // // setUploadImage(file);
    form.append("image", file);

    axios
      .post(
        "https://api.imgbb.com/1/upload?key=4389f6aa038004767b479af56fd374b6",
        form
      )
      .then(function (response) {
        console.log(response);
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
        console.log("createNewEntry", response);
        setImages([...images, { ...response.data, isChecked: false }]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  console.log(images);

  return (
    <>
      <div className="bg-white rounded-xl   ">
        <div className="px-1.5 py-3 border-black border-b-2">
          {/* checking if any image selected, if selected then delete button will appear */}
          {totalChecked ? (
            <div className="flex flex-row items-center justify-between  ">
              <div className="flex gap-4 border-white border-4">
                <input
                  className="mt-1 h-5 w-5 md:h-7 md:w-7"
                  type="checkbox"
                  onChange={() => handleUnChecked()}
                  defaultChecked={totalChecked > 0 ? true : false}
                />
                <span className="text-base md:text-2xl font-semibold">
                  {totalChecked} Images Selected
                </span>
              </div>

              <div
                className=" flex justify-center items-center gap-3 text-base md:text-2xl  bg-slate-200 hover:bg-slate-400 rounded-md hover:cursor-pointer font-semibold px-2 md:px-4 py-1 md:py-2"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-red-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
                Delete
              </div>
            </div>
          ) : (
            <div className="text-base md:text-2xl py-2 font-semibold">
              Image Gallery
            </div>
          )}
        </div>
        {/* dnd kit component */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-5 ">
              {/* checking if any image available or not */}
              {images?.length > 0 ? (
                images.map((elm, index) => (
                  <ImageCard key={index} index={index} elm={elm} />
                ))
              ) : (
                <p className="text-3xl font-bold">No Images </p>
              )}
              {/* <img src={uploadImage} /> */}
              <div className="flex flex-col w-full items-center justify-center bg-slate-100 border-dashed border-black border-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>

                {/* <p>Upload Images</p> */}
                <label htmlFor="file-upload" className="custom-file-upload">
                  Custom Upload
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </div>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default App;
