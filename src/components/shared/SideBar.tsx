import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import Friend from "./Friend";

const SideBar = () => {
  const [friends, setFriends] = useState([
    {
      id: 1,
      selected: false,
      newMsg: true,
      img: "Ellipse 1.svg",
      title: "Cameron Williamson",
      text: "Not too bad, just trying to catch up on some work. How about you?",
    },{
      id: 2,
      selected: true,
      newMsg: false,
      img: "Ellipse 1 (1).svg",
      title: "Robert Fox",
      text: "Not too bad, just trying to catch up on some work. How about you?",
    },{
      id: 3,
      selected: false,
      newMsg: true,
      img: "Ellipse 1 (2).svg",
      title: "Mohamed Aachour",
      text: "Not too bad, just trying to catch up on some work. How about you?",
    },{
      id: 4,
      selected: false,
      newMsg: false,
      img: "Ellipse 1 (3).svg",
      title: "Bessie Cooper",
      text: "Not too bad, just trying to catch up on some work. How about you?",
    },{
      id: 5,
      selected: false,
      newMsg: true,
      img: "Ellipse 1 (4).svg",
      title: "Eleanor Pena",
      text: "Loe the game music",
    },
    // Add other friends with id, selected, newMsg, img, title, and text properties
  ]);

  const handleFriendClick = (id: number) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) => ({
        ...friend,
        selected: friend.id === id,
      }))
    );
  };

  return (
    <div className="w-2/6 h-full flex">
      <div className="w-[89px] border-r pt-5 border-gray-979797 grid grid-cols-1 gap-1 content-between bg-white h-full p-1 mb-[2rem]">
        <div className="flex flex-col  gap-3 w-full">
          <div className="bg-secondary-500 mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/comment_duotone.svg"
              className=" top-1 right-4 z-4 object-contain py-2"
            />
          </div>
          <div className="relative border-[1px] border-secondary-500 mx-2 rounded-[12px] flex items-center justify-center flex-col relative">
            <img
              src="./src/assests/User_alt_fill.svg"
              className="z-4 object-contain py-2"
            />
            <div
              className="absolute top-[75%] left-[80%] w-4 h-4 bg-red-badge-500 rounded-full text-white flex items-center justify-center"
              style={{
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                fontSize: "0.6rem",
                fontWeight: "bold",
              }}
            >
              15
            </div>
          </div>
        </div>
        <div className="flex flex-col  gap-3 w-full">
          <div className="bg-secondary-500 mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/Setting_line.svg"
              className=" top-1 right-4 z-4 object-contain py-2"
            />
          </div>
          <div className="mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/Ellipse 1190.svg"
              className=" top-1 right-4 z-4 mb-3 object-contain py-2"
            />
          </div>
        </div>
      </div>

      {/*<div className="w-4/5 divide-x">two</div>*/}

      {/*Second column */}
      <div className="w-4/5 border-r border-gray-979797">
        <div className="my-4 ml-4  font-extrabold text-[20px]">Chats</div>
        
        <div className="relative flex mx-4">
          <input
            type="text"
            className="bg-secondary-500 pl-12 text-white rounded-xl focus:outline-none placeholder-white::placeholder"
            placeholder="Search"
          />

          <IoSearch className="absolute left-3 top-3 text-gray-200" size={24} />
        </div>

        <div>
          {friends.map((friend) => (
            <Friend
              key={friend.id}
              selected={friend.selected}
              newMsg={friend.newMsg}
              img={friend.img}
              title={friend.title}
              text={friend.text}
              onClick={() => handleFriendClick(friend.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
