import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import languagesArray from "../util/languages";
import { PiVideoCameraThin } from "react-icons/pi";
import { IoChevronBack } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";

const NavBarRandom = ({ leaveRandomChat }) => {
  const profilePictureRef = useRef();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleLeaveRandomChat = () => {
    leaveRandomChat();
  };

  const handleRandomVideoCall = () => {};

  return (
    <nav className="fixed   w-full z-10 max-md:px-2 md:px-10 flex justify-between items-center border-b border-opacity-20  bg-[#fff] shadow-blur ">
      <div className="relative flex items-center justify-between w-[90%]">
        <div className="flex  w-[80%] md:gap-8">
          <div className="flex items-center md:gap-4 ">
            {user && (
              <>
                <div
                  className="flex justify-center mt-5 gap-2 cursor-pointer"
                  onClick={handleLeaveRandomChat}
                >
                  <BiLogOut color="red" size={28} />
                  <span className="text-[#ff1818] font-semibold mb-8">
                    Leave Chat
                  </span>
                </div>

                {/* <div
                ref={profilePictureRef}
                onClick={handleDropdownClick}
                className="w-10 h-10 min-h-10 min-w-10  max-md:text-[16px] md:text-[18px]  rounded-full shadow-xl flex items-center justify-center cursor-pointer"
                style={{
                  backgroundImage: `url(${recipientPi || "/assets/icons/user.png"
                    })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="flex flex-col  hover:text-gray-300   mr-2 focus:outline-none sm:block">
                {user && user?.userName ? (
                  <p className="max-md:text-[16px] md: text-[16px] text-bold text-[#25282C]">
                    {recipient}
                  </p>
                ) : (
                  ""
                )}
              </div> */}

                {/* <div className="bg-[#25282C] py-2 flex items-center text-white px-4 rounded-bl-[0px] rounded-br-[20px] rounded-t-[20px] ">
                <span className="max-md:text-[12px] md:text-[14px] ">
                  {fullLanguage}
                </span>
              </div> */}
              </>
            )}
          </div>
        </div>

        <div className="flex gap-6 items-center max-md:gap-2 ">
          <button className="text-black" onClick={handleRandomVideoCall}>
            <PiVideoCameraThin size={34} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBarRandom;
