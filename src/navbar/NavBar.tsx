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
const Navbar = () => {
  //Reference for dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  //States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profilePictureRef = useRef();
  const { user } = useAppSelector((state) => state.auth);
  const {recipient} = useAppSelector((state) => state.user);
  const conversationState = useAppSelector((state) => state.conversation);
  const {recipientPi} = useAppSelector((state) => state.user);
  console.log(recipientPi);
  const language = conversationState?.conversation?.language;
  console.log(language);
  
  const fullLanguage = languagesArray.map((l) => {
    if (l.code === language?.toLowerCase()) return l.language;
  });
 
  const { isDarkMode, setIsDarkMode } = useContext(UserContext);

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

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="relative z-10 max-md:px-2  py-2 md:px-10 flex justify-between items-center border-b border-opacity-20  bg-[#fff] shadow-sm ">
      <div className="flex w-[80%] gap-2 md:gap-8">
        <div className="flex items-center ml-2 gap-2 md:gap-4 ">
          {user && (
            <>
              {recipientPi?  (
                <div
                  ref={profilePictureRef}
                  onClick={handleDropdownClick}
                  className="w-10 h-10 max-md:text-[16px] md:text-[18px]  rounded-full shadow-xl flex items-center justify-center cursor-pointer"
                  style={{
                    backgroundImage: `url(${
                      recipientPi || COCKATOO
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  { !recipientPi && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  )}
                </div>
              ) : (
                <button
                  className={`text-${
                    isDarkMode ? "white" : "black"
                  } hover:text-gray-300 focus:outline-none`}
                  onClick={handleDropdownClick}
                >
                  <HiOutlineUserCircle
                    className={`text-${
                      isDarkMode ? "white" : "black"
                    } text-2xl ml-4`}
                  />
                </button>
              )}
              <div className="flex flex-col  hover:text-gray-300   mr-2 focus:outline-none sm:block">
                {user && user.userName ? (
                  <p className="max-md:text-[16px] md: text-[16px] text-bold text-[#25282C]">
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
              <div className="bg-[#25282C] py-2 flex items-center text-white px-4 rounded-bl-[0px] rounded-br-[20px] rounded-t-[20px] ">
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
          placeholder="search text"
          id="chatsearch"
          label=""
          className="max-md:hidden max-md:"
        />
      </div>

      <div className="flex gap-6 items-center max-md:gap-2  ">
      <PiVideoCameraThin size={34}/>
      <PiPhoneCallLight size={26}/>
      </div>
    </nav>
  );
};

export default Navbar;
