import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../context/user-context";
import { PiChatTextFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { MdDarkMode, MdPersonAddAlt1 } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import LanguagesArray from "./../../constants/languages";
import { setTab } from "../../redux/features/user/authSlice";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { pathname } = location;
  const { selectedTab } = useAppSelector((state) => state.auth);

  const languages = LanguagesArray();
  const languageRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const { setSelectedLanguage, selectedLanguage } = useContext(UserContext);
  const [showLanguages, setShowLanguages] = useState<boolean>(false);
  const { isDarkMode, toggleDarkMode } = useContext(UserContext);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
  };

  const handleLanguageClick = () => {
    setShowLanguages((prev) => !prev);
  };

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
    setShowLanguages(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: { target: any }) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setShowLanguages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname === "/random") {
      Dispatch(setTab("random"));
    } else if (pathname === "/profile") {
      Dispatch(setTab("profile"));
    } else if (selectedTab === "") {
      Dispatch(setTab("chats"));
    }
  }, [pathname, selectedTab]);

  const tabButtonClass = (tab: string) =>
    `${
      selectedTab !== tab
        ? `${
            isDarkMode
              ? "border-white hover:bg-gray-400 hover:border-gray-400 "
              : "border-black hover:bg-gray-200 hover:border-gray-200 "
          }`
        : `border-secondary-500  ${
            isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500"
          }`
    } border-[1px] mx-2 rounded-[12px] flex items-center justify-center flex-col transition duration-300 ease-in-out`;

  const iconClass = (tab: string) =>
    `${
      selectedTab !== tab
        ? `${isDarkMode ? "text-white" : "text-secondary-500"}`
        : `${isDarkMode ? "text-black" : "text-white"}`
    } z-4 object-contain py-1 w-[29px] text-[32px]`;

  const handleTabClick = (tab: string, path: string) => {
    Dispatch(setTab(tab));
    navigate(path);
  };

  return (
    <div
      className={`w-[80px] min-w-[80px] grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem] ${
        isDarkMode
          ? "border-r pt-5 border-[#000] border-opacity-20"
          : "border-r pt-5 border-opacity-20"
      }`}
    >
      <div className="flex flex-col gap-3 w-full">
        <div
          className={tabButtonClass("chats")}
          onClick={() => handleTabClick("chats", "/chat")}
        >
          <PiChatTextFill className={iconClass("chats")} />
        </div>
        <div
          className={tabButtonClass("friends")}
          onClick={() => handleTabClick("friends", "/chat")}
        >
          <IoPersonSharp className={iconClass("friends")} />
        </div>
        <Link to="/random">
          <div
            className={tabButtonClass("random")}
            onClick={() => handleTabClick("random", "/random")}
          >
            <GiPerspectiveDiceSixFacesRandom className={iconClass("random")} />
          </div>
        </Link>
        <div
          className={tabButtonClass("addFriends")}
          onClick={() => handleTabClick("addFriends", "/chat")}
        >
          <MdPersonAddAlt1 className={iconClass("addFriends")} />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-center">
          <MdDarkMode
            className={`text-[25px] cursor-pointer ${
              isDarkMode ? "text-white" : ""
            }`}
            onClick={toggleDarkMode}
          />
        </div>
        <div
          className={`rounded-[3px] max-md:px-1 max-md:py-1 flex items-center justify-center flex-col transition duration-300 ease-in-out relative ${
            showLanguages ? "hover:cursor-pointer" : ""
          }`}
          onClick={handleLanguageClick}
        >
          <FaGlobe
            className={`z-4 object-contain py-1 w-[29px] text-[32px] ${
              isDarkMode ? "text-white" : "text-[#25282C]"
            }`}
          />
          {showLanguages && (
            <div
              ref={languageRef}
              className={`overflow-hidden absolute z-50 bottom-[30px] ${
                selectedLanguage === "ar" ? "right-[60px]" : "left-[60px]"
              } bg-white border-[1px] border-gray-200 rounded-lg shadow-md flex flex-col items-center`}
            >
              {Object.entries(languages).map(([languageName, languageCode]) => (
                <button
                  key={languageCode}
                  onClick={() => handleLanguageChange(languageCode)}
                  className={`px-5 py-2 w-full ${
                    selectedLanguage === languageCode
                      ? "bg-secondary-500 py-3 font-bold text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  {t(languageName)}
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          className={tabButtonClass("profile")}
          onClick={() => handleTabClick("profile", "/profile")}
        >
          <RiSettings5Fill className={iconClass("profile")} />
        </div>
        <div className="mx-2 pb-2 mb-[1rem] flex items-center justify-center flex-col rounded-full overflow-hidden">
          <img
            src={user?.profileImage?.url || "/assets/icons/user.png"}
            className="h-14 w-14 object-cover rounded-full"
            alt="Profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
