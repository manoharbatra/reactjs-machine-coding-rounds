import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ImageCard = ({ elm, index, checked }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: elm.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? "0.5" : "1",
    touchAction: 'none',
  };
  return (
    <div
      ref={setNodeRef}
      style={{ transformOrigin: "0 0", ...style }}
      {...attributes}
      {...listeners}
      className={`${index === 0 ? "row-span-2 col-span-2" : ""} bg-white cursor-grab group`}
      key={index}
    >
      <div
        className={`h-full w-full relative  overflow-hidden rounded-lg border-slate border-2  `}
      >
        {!isDragging ? (
          <img
            className={`  h-full w-full object-cover rounded-md `}
            data-id={elm.id}
            src={elm?.url}
          />
        ) : (
          null
        )}
        <div
          className={`absolute h-full w-full ${
            elm?.isChecked
              ? "bottom-0 opacity-100 bg-black/20"
              : "bg-black/40 opacity-0 -bottom-10"
          }   group-hover:bottom-0 group-hover:opacity-100 ease-out  group-hover:ease-out delay-150 duration-300`}
        >
          <div className=" py-5 px-5">
            <input
              className="w-5 h-5 cursor-pointer "
              onChange={() => checked(index)}
              checked={elm?.isChecked}
              type="checkbox"
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
