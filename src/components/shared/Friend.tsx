// Friend.tsx
import React, { useState } from "react";

interface FriendProps {
  isDarkMode: boolean,
  selected: boolean;
  newMsg: boolean;
  title: string;
  text: string;
  img: string;
  onClick: () => void; // Add onClick prop
}

const Friend = ({ isDarkMode, selected, newMsg, img, title, text, onClick }: FriendProps) => {
  return (
    <div className="relative overflow-hidden bg" onClick={onClick}>
   

      {selected && (
        <div className={`absolute top-0 left-0 h-full w-2 ${isDarkMode? "bg-primary-500":"bg-secondary-500"} p-1`}></div>
      )}

  <div
  className={`h-full flex items-center py-4 ${
    selected && isDarkMode ? "bg-selected-friend-dark pl-8 z-10" : ""
  } ${selected && !isDarkMode ? "bg-selected-friend-light pl-8 z-10" : ""}
    ${!selected? "px-4": ""}`}
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
            <p className={`mr-2 font-bold text-base ${isDarkMode? "text-white": "text-black"} line-clamp-1`}>{title}</p>
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
