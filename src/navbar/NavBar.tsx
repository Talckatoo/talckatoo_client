import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import COCKATOO from "./.././assests/cockatoo.png";
import { setAuth } from "../redux/features/user/authSlice";
import {
  setRecipient,
  setUser,
  setUsers,
} from "../redux/features/user/userSlice";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { setMessages } from "../redux/features/messages/messageSlice";
import { setRequest } from "../redux/features/user/requestSlice";
import ChatNavSearch from "../components/ChatNavSearch";
import languagesArray from "../util/languages";
import { PiVideoCameraThin } from "react-icons/pi";
import { PiPhoneCallLight } from "react-icons/pi";
import { IoChevronBack } from "react-icons/io5";

interface NavBarProps {
  onHandleCall: () => void;
}
const Navbar = ({ onHandleCall }: NavBarProps) => {
  //Reference for dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  //States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profilePictureRef = useRef();
  const { user } = useAppSelector((state) => state.auth);
  const { recipient } = useAppSelector((state) => state.user);
  const conversationState = useAppSelector((state) => state.conversation);
  const { recipientPi } = useAppSelector((state) => state.user);
  const language = conversationState?.conversation?.language;

  const fullLanguage = languagesArray.map((l) => {
    if (l.code === language?.toLowerCase()) return l.language;
  });

  const { isDarkMode, toggleDarkMode } = useContext(UserContext);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClicks);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClicks);
    };
  }, [isDropdownOpen]);

  const handleOutsideClicks: (event: MouseEvent) => void = (
    event: MouseEvent
  ) => {
    if (
      isDropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !(profilePictureRef.current as unknown as HTMLElement)?.contains(
        event.target as Node
      )
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [user]);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("User signed out");
    // clear persisted state
    dispatch(setAuth(null));
    dispatch(setUser(null));
    dispatch(setUsers([]));
    dispatch(setConversation({}));
    dispatch(setMessages([]));
    dispatch(setRequest(null));
    dispatch(setRecipient(null));

    navigate("/");
  };

  const navigate = useNavigate();

  const handleVideoCall = () => {
    onHandleCall();
  };

  const handleBack = () => {
    dispatch(
      setConversation({
        conversationId: null,
        selectedId: null,
        language: null,
      })
    );
  };

  return (
    <nav
      className={`relative z-10 max-md:px-2  py-2 md:px-10 flex justify-between items-center   shadow-sm ${
        isDarkMode
          ? "bg-[#0E131D] border-l border-[#5D5DFF] border-opacity-20 "
          : "bg-white  border-b border-opacity-20"
      }`}
    >
      <div className="flex w-[80%] gap-2 md:gap-8">
        <div className="flex items-center ml-2 gap-2 md:gap-4 ">
          {user && (
            <>
              <IoChevronBack
                className={`max-md:hidden min-w-[24px] text-[24px] md:text-[28px] md:min-w-[28px] cursor-pointer ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
                onClick={handleBack}
              />

              <div
                ref={profilePictureRef}
                onClick={handleDropdownClick}
                className="w-10 h-10 min-h-10 min-w-10  max-md:text-[16px] md:text-[18px]  rounded-full shadow-xl flex items-center justify-center cursor-pointer"
                style={{
                  backgroundImage: `url(${
                    recipientPi || "/assets/icons/user.png"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>

              <div className="flex flex-col  hover:text-gray-300   mr-2 focus:outline-none sm:block">
                {user && user?.userName ? (
                  <p
                    className={` max-md:text-[16px] md: text-[16px] text-bold text-[#25282C] ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {recipient}
                  </p>
                ) : (
                  ""
                )}
                {/* <div className="flex gap-2 items-center">
                  <img src="/assets/img/online.png" alt="oline point" />
                  <span className="text-[#879795] max-md:[12px] md:text-[14px] ">
                    Active now
                  </span>
                </div> */}
              </div>
              {/* {isDropdownOpen && (
                <div className="relative z-20" ref={dropdownRef}>
                  <div className="absolute right-0 mt-5 w-48 bg-white rounded-lg shadow-xl">
                    <a
                      href="#"
                      className={`block px-4 py-2 rounded-lg text-${
                        isDarkMode ? "gray-800" : "gray-700"
                      } hover:bg-gray-300`}
                      onClick={handleProfileClick}
                    >
                      Profile
                    </a>
                    <a
                      href=""
                      className={`block px-4 py-2 rounded-lg text-${
                        isDarkMode ? "gray-800" : "gray-700"
                      } hover:bg-gray-300`}
                      onClick={handleLogout}
                    >
                      Logout
                    </a>
                  </div>
                </div>
              )} */}
              <div
                className={`py-2 flex items-center  px-4 rounded-bl-[0px] rounded-br-[20px] rounded-t-[20px] ${
                  isDarkMode
                    ? "bg-[#D9E3EA] text-black"
                    : "bg-[#25282C] text-white"
                }`}
              >
                <span className="max-md:text-[12px] md:text-[14px] ">
                  {fullLanguage}
                </span>
              </div>
            </>
          )}
        </div>
        <ChatNavSearch
          type="text"
          name="chat"
          value=""
          placeholder=""
          id="chatsearch"
          label=""
          className="max-md:hidden max-md:"
        />
      </div>

      <div className="flex gap-6 items-center max-md:gap-2 ">
        <button
          className={isDarkMode ? "text-white " : "text-black"}
          onClick={handleVideoCall}
        >
          <PiVideoCameraThin size={34} />
        </button>
        {/* 
      <button className="text-black" onClick={handleCall}>

      <PiPhoneCallLight size={26}/>
    
      </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
