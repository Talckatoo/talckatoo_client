// Friend.tsx
import React from "react";

interface FriendProps {
  selected: boolean;
  newMsg: boolean;
  title: string;
  text: string;
  img: string;
}

const Friend = ({ selected, newMsg, img, title, text }: FriendProps) => {
  return (
    <div className="relative overflow-hidden">
   

      {selected && (
        <div className="absolute top-0 left-0 h-full w-2 bg-secondary-500 p-1"></div>
      )}

      <div
        className={`h-full flex items-center  py-4 ${
          selected ? "bg-gray-200 pl-8 z-10" : "px-4"
        }`}
      >
        <div className="flex-none">
          <img
            src={`./src/assests/${img}`}
            className="w-16 h-16"
            alt="User"
          />
        </div>

        {/* Column 2: Title and Text */}
        <div className="flex-grow px-3">
          <div className="flex items-center">
            <p className="mr-2 font-bold text-base text-black line-clamp-1">{title}</p>
          </div>
          <p className="text-sm text-gray-700 font-normal line-clamp-2">
            {text}
          </p>
        </div>

        {/* Column 3: Red Circle */}
        {newMsg && (
          <div className="flex-none">
            <div className="w-3 h-3 bg-red-badge-500 rounded-full p-1"></div>
          </div>
        )}

      </div>
      {/* Line Divider */}
        <div className="absolute bottom-0 left-4 border-t border-black w-[90%]"></div>

    </div>
  );
};

export default Friend;
