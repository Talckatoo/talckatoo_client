import React from "react";
import { IoSearch } from "react-icons/io5";

const SideBar = () => {
  return (
    <div className="w-2/6 h-full flex">
      <div className="w-[89px] border-r pt-5 border-gray-979797 grid grid-cols-1 gap-1 content-between bg-white h-full p-1 mb-[2rem]">
        <div className="flex flex-col  gap-3 w-full">
          <div className=" bg-secondary-500 mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/chat.png"
              className=" top-1 right-4 z-4 object-contain py-2"
            />
          </div>
          <div className=" border-[1px] border-secondary-500 mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/User_alt_fill.png"
              className=" top-1 right-5 z-4 object-contain py-2"
            />
          </div>
        </div>
        <div className="flex flex-col  gap-3 w-full items-center">
          <div className=" bg-secondary-500 mx-2 rounded-[12px]  flex items-center justify-center flex-col w-full max-w-[59px]">
            <img
              src="./src/assests/Setting_line.png"
              className=" top-2 right-5 z-4 object-contain py-2"
            />
          </div>
          <img src="./src/assests/userPic.png" className="max-w-[58px]" />
        </div>
      </div>

      {/*<div className="w-4/5 divide-x">two</div>*/}

      {/*Second column */}
      <div className="w-4/5 border-r border-gray-979797 px-8 max-lg:px-4 py-4">
        <div className="my-4 ml-4  font-extrabold text-[20px]">Chats</div>
        <div className="relative flex">
          <input
            type="text"
            className="bg-secondary-500 pl-12 text-white rounded-lg focus:outline-none placeholder-white::placeholder "
            placeholder="Search"
          />
          <IoSearch className="absolute left-4 top-3 text-gray-200" size={24} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
