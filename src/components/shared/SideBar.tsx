import React from "react";

const SideBar = () => {
  return (
    <div className="w-2/6 h-full flex">
      <div className="w-1/5 border-r border-gray-979797 grid grid-cols-1 gap-1 content-between bg-white h-full p-1">
        <div>
          <div className="relative">
            <img
              src="./src/assests/RectangleBG.png"
              className="object-contain py-1"
            />
            <img
              src="./src/assests/chat.png"
              className="absolute top-1 right-4 z-4 object-contain py-1"
            />
          </div>
          <div className="relative">
            <img
              src="./src/assests/RectangleBorder.png"
              className="object-contain py-1"
            />
            <img
              src="./src/assests/User_alt_fill.png"
              className="absolute top-1 right-5 z-4 object-contain py-1"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <img
              src="./src/assests/RectangleBG.png"
              className="object-contain py-1"
            />
            <img
              src="./src/assests/Setting_line.png"
              className="absolute top-2 right-5 z-4 object-contain py-1"
            />
          </div>
          <img src="./src/assests/userPic.png" className="max-w-52" />
        </div>
      </div>

      {/*<div className="w-4/5 divide-x">two</div>*/}

      {/*Second column */}
      <div className="w-4/5 border-r border-gray-979797">
        <div className="my-4 ml-4 font-inter font-extrabold text-20">Chats</div>
        <div className="flex items-center border border-white rounded-md px-1 py-1 bg-secondary-500">
          <img src="./src/assests/Search.png"/>
          <input type="text" className="bg-secondary-500 text-white placeholder-white::placeholder focus:outline-none border-0" placeholder="Search"/>
        </div>

      </div>
    </div>
  );
};

export default SideBar;
