import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../../context/user-context";
import { PiChatTextFill } from "react-icons/pi";
import { IoPersonSharp } from "react-icons/io5";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiSettings5Fill } from "react-icons/ri";
import { MdDarkMode } from "react-icons/md";
import { useAppSelector } from "../../redux/hooks";
// translation button
import { useTranslation } from 'react-i18next'; //TRANSLATION languages
import { FaGlobe } from 'react-icons/fa';
import LanguagesArray from './../../constants/languages';

const LeftSideBar = ({
  showSetting,
  showRequest,
  showRandom,
  setShowRequest = () => { },
  setButtonSelected = () => { },
}: {
  showSetting?: boolean;
  showRequest: boolean;
  showRandom: boolean;
  setShowRequest?: (showRequest: boolean) => void;
  setButtonSelected?: (buttonSelected: string) => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const { pathname } = location;
  const handleSettingClick = () => {
    navigate("/profile");
  };

  // Language object
  const languages = LanguagesArray(); // Get languages object
  // Language change
  const languageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(); //TRANSLATION languages
  const { i18n } = useTranslation();
  const { setSelectedLanguage, selectedLanguage } = useContext(UserContext); // Access setSelectedLanguage and selectedLanguage from UserContext
  const [isButtonClicked] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng); // Update selected language in state
  };

  const [showLanguages, setShowLanguages] = useState<boolean>(false);
  // const { isDarkMode } = useContext(UserContext);
  const { isDarkMode, toggleDarkMode } = useContext(UserContext);

  const handleLanguageClick = () => {
    setShowLanguages((prev) => !prev);
  };

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
    setSelectedLanguage(lng); // Update selected language in UserContext
    setShowLanguages(false); // Close the dropdown
  };
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        // Clicked outside the language dropdown, close it
        setShowLanguages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  })

  return (
    <div
      className={`w-[80px] min-w-[80px] border-r pt-5  grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem] ${isDarkMode
        ? " border-[#000] border-opacity-20"
        : " border-opacity-20"
        }`}
    >
      <div className="flex flex-col  gap-3 w-full">
        <div
          className={`${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500 "}${showRequest || showRandom || showSetting
            ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${isDarkMode ? "border-white" : "border-black"
            }`
            : ` border-[1px] border-secondary-500 hover:bg-black ${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500"
            }`
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
          onClick={
            pathname === "/chat"
              ? () => setShowRequest(!showRequest)
              : () => setButtonSelected("chats")
          }
        >
          <PiChatTextFill
            className={`${showRequest || showRandom || showSetting
              ? `${isDarkMode ? "text-white " : "text-secondary-500"}`
              : `${isDarkMode ? "text-black" : "text-white"}`
              } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        <div
          className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${!showRequest
            ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${isDarkMode ? "border-white" : "border-black"
            }`
            : `bg-secondary-500 border-[1px]  hover:bg-black ${isDarkMode ? "bg-[#E9E9EF]" : "border-secondary-500"
            }`
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
          onClick={
            pathname === "/chat"
              ? () => setShowRequest(!showRequest)
              : () => setButtonSelected("friends")
          }
        >
          <IoPersonSharp
            className={`${!showRequest
              ? `${isDarkMode ? "text-white " : "text-secondary-500"}`
              : `${isDarkMode ? "text-black" : "text-white"}`
              } z-4 object-contain py-1 w-[29px] text-[32px]`}
          />
        </div>
        {/* random chat icons */}
        <Link to="/random">
          <div
            className={`${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500 "}${!showRandom
              ? `bg-white border-[1px]  hover:bg-gray-200 hover:border-gray-200 ${isDarkMode ? "border-white" : "border-black"
              }`
              : `bg-secondary-500 border-[1px]  hover:bg-black ${isDarkMode ? "bg-[#E9E9EF]" : "border-secondary-500"
              }`
              } mx-2 rounded-[12px]  flex items-center justify-center flex-col
      transition duration-300 ease-in-out 
    `}
          >
            <GiPerspectiveDiceSixFacesRandom
              className={`${!showRandom
                ? `${isDarkMode ? "text-white" : "text-secondary-500"}`
                : `${isDarkMode ? "text-black" : "text-white"}`
                } z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
          </div>
        </Link>
      </div>
      <div className="flex flex-col  gap-3 w-full">
        <div className="flex justify-center">
          <MdDarkMode
            className={
              isDarkMode
                ? "text-[25px] text-white cursor-pointer"
                : "text-[25px] cursor-pointer"
            }
            onClick={toggleDarkMode}
          />
        </div>
        {/* change language button */}
        <div className={`${isDarkMode ? "" : " "}${!isButtonClicked
          ? "  hover:cursor-pointer hover:border-gray-200"
          : "  hover:bg-black"
          }  rounded-[3px] max-md:px-1 max-md:py-1 flex items-center justify-center flex-col
            transition duration-300 ease-in-out relative
            `} onClick={handleLanguageClick}>
          <FaGlobe
            className={`${!isButtonClicked ? "text-secondary-500" : "text-white"
              } z-4 object-contain py-1 w-[29px] text-[32px]
                ${isDarkMode ? "text-white" : "text-[#25282C]"}`}
          />
          {showLanguages && (
            <div ref={languageRef} className="overflow-hidden absolute z-50 bottom-[80px] bg-white border-[1px] border-gray-200 rounded-lg shadow-blur flex flex-col items-center">
              {/* map languages */}
              {Object.entries(languages).map(([languageName, languageCode]) => (
                <button
                  key={languageCode}
                  onClick={() => handleLanguageChange(languageCode)}
                  className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === languageCode ? 'bg-secondary-500 py-3 font-bold text-white' : 'text-black'}`}
                >
                  {t(languageName)}
                </button>
              ))}
              {/* Add more buttons for additional languages */}
            </div>
          )}
        </div>
        {/* end */}

        <div
          className={`${isDarkMode ? "bg-[#E9E9EF]" : "bg-secondary-500"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}
          onClick={handleSettingClick}
        >
          <RiSettings5Fill
            className={`z-4 object-contain py-1 w-[29px] text-[32px] ${isDarkMode ? "text-[#25282C]" : "text-white"
              } `}
          />
        </div>
        <div className="mx-2 pb-2 mb-[1rem] flex items-center justify-center flex-col rounded-full overflow-hidden">
          <img
            src={user?.profileImage?.url || "/assets/icons/user.png"}
            // src={`${user?.profileImage?.url}`}
            className="h-14 w-14 object-cover rounded-full"
            alt="Profile-picture"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
