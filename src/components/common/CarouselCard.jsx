import React from "react";
import Button from "./Button";

const CarouselCard = ({
  item,
  Meta1Icon,
  Meta2Icon,
  ButtonIcon,
  buttonText,
  className = "",
  onClick,
  to
}) => {
  return (
    <div
      onClick={onClick}
      className={`absolute w-[280px] md:w-[320px] transition-all duration-500 ease-in-out cursor-pointer select-none ${className}`}
    >
      <div
        className="bg-white backdrop-blur-lg 
        rounded-2xl overflow-hidden
        h-[480px] flex flex-col
        border border-[#4e2d8f]
        shadow-xl shadow-black/30"
      >
        {/* Image */}
        <div className="h-[45%] w-full relative">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover pointer-events-none"
            draggable="false"
          />
        </div>

        {/* Price Badge */}
        <div
          className="absolute top-[41%] left-6
          bg-[#1D014B]
          text-[#E4DFE6]
          px-4 py-1.5 rounded-lg font-bold text-sm
          shadow-lg
          border border-[#4e2d8f]
          z-10"
        >
          {item.price || item.category }
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow text-right mt-3">
          {/* Title */}
          <h4 className="text-xl font-bold gradient-text line-clamp-1 mb-3">
            {item.title}
          </h4>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
            {item.desc
              ? item.desc.match(/([^.!?؟]+[.!?؟]+){1,2}/)?.[0]?.trim() ||
                item.desc
              : ""}
          </p>

          {/* Meta Box */}
          <div
            className="flex justify-between items-center mb-5
            
            rounded-lg p-2.5
            gradient-secondary
          "
          >
            <div className="flex items-center gap-2 text-sm text-[#E4DFE6]">
              {Meta1Icon && <Meta1Icon className="text-lg" />}
              <span>{item.meta1}</span>
            </div>

            <div className="w-[1px] h-5 bg-[#4e2d8f]"></div>

            <div className="flex items-center gap-2 text-sm text-[#E4DFE6]">
              {Meta2Icon && (
                <Meta2Icon
                  className={`text-lg ${
                    item.meta2?.toString()?.includes(".")
                      ? "fill-yellow-400 text-yellow-400"
                      : ""
                  }`}
                />
              )}
              <span>{item.meta2}</span>
            </div>
          </div>

          {/* Button */}
          <Button className="w-full " to={to} >
            <div className="flex justify-center items-center gap-2">
              {ButtonIcon && <ButtonIcon className="text-lg" />}
              {buttonText}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;