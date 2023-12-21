import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
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

const Navbar = () => {
  //Reference for dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  //States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profilePictureRef = useRef();
  const { user } = useAppSelector((state) => state.auth);
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
    <nav
      className={`relative z-10 py-2 px-3 flex justify-between items-center drop-shadow-md ${
        isDarkMode ? "bg-[#161c24]" : "bg-slate-100"
      }`}
    >
      <div
        className={`flex flex-row text-${
          isDarkMode ? "white" : "black"
        } text-2xl items-center justify-center`}
      >
        <img
          className="w-10 h-10"
          src="https://img1.picmix.com/output/stamp/normal/6/4/6/7/1647646_1b76b.gif"
          alt="logo"
        />
        TALCKATOO
      </div>
      <div className="flex items-center mr-2">
        {user && (
          <>
            <h5
              className={`text-${
                isDarkMode ? "white" : "black"
              } hover:text-gray-300  mr-2 focus:outline-none sm:block`}
            >
              {user && user.userName ? (
                <p>
                  {user.welcome ? user.welcome : "Welcome"}, {user.userName}
                </p>
              ) : (
                ""
              )}
            </h5>
            {user?.profileImage?.url ? (
              <div
                ref={profilePictureRef}
                onClick={handleDropdownClick}
                className="w-8 h-8 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
                style={{
                  backgroundImage: `url(${
                    user?.profileImage?.url || COCKATOO
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!user?.profileImage?.url && (
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
            {isDropdownOpen && (
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
            )}
          </>
        )}
        <div className="ml-4">
          {isDarkMode ? (
            <BsFillSunFill
              className="text-yellow-500 cursor-pointer"
              onClick={toggleTheme}
            />
          ) : (
            <BsFillMoonFill
              className="text-gray-500 cursor-pointer"
              onClick={toggleTheme}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
