import { FC, useEffect, useState, useContext, useRef } from "react";
import Button from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { MdDarkMode } from "react-icons/md";
import { useTranslation } from 'react-i18next'; //TRANSLATION languages
import { FaGlobe } from 'react-icons/fa';

interface NavBarProps {
  showSign?: boolean;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: string;
}

const NavBar: FC<NavBarProps> = ({}) => {

  const languageRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(); //TRANSLATION languages
  const { i18n } = useTranslation();
  const { setSelectedLanguage, selectedLanguage } = useContext(UserContext); // Access setSelectedLanguage and selectedLanguage from UserContext

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
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const handleSignInClick = () => {
    // Check if token exists in local storage
    const token = localStorage.getItem("token");

    if (token) {
      // Token exists, navigate to chat page
      navigate("/chat");
    } else {
      // Token doesn't exist, navigate to sign-in page
      navigate("/sign-in");
    }
  };

  // scrool event

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

    const handleScroll = () => {
      // Check if the page has been scrolled, e.g., if the vertical scroll position is greater than 0.
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // Attach the scroll event listener when the component mounts.
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  return (
    <header
      className={
        isDarkMode
          ? "w-full py-4 fixed top-0 z-50 bg-black"
          : "bg-withe w-full py-4 fixed top-0 z-50"
      }
      // style={{isDarkMode ?
      //   { backgroundColor: scrolled ? "rgba(255, 255, 255, 0.9)" : "transparent",
      //   backdropFilter: scrolled ? "blur(8px)" : "none" }
      // }}
      style={{
        backgroundColor: isDarkMode
          ? "transparent"
          : scrolled
          ? "rgba(255, 255, 255, 0.9)"
          : "transparent",
        backdropFilter: isDarkMode ? "none" : scrolled ? "blur(8px)" : "none",
      }}
    >
      <div className="w-full flex items-center justify-between max-w-[95%] m-auto">
        <Link
          to="/"
          className="font-jakarta text-[20px] font-bold flex items-center justify-left"
        >
          <img
            className="w-[40px] w-min-[45px] mr-2 h-auto transition m ease-in-out duration-300 scale-100 hover:scale-105"
            src="/assets/img/logo.svg"
          />

          <span
            className={`hidden sm:inline ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            TALCKATOO
          </span>
        </Link>

        {/* sign up and sign in button */}
        <div className="flex items-center gap-4  max-[430px]:flex max-[430px]:justify-center">
        <MdDarkMode
            className={
              isDarkMode
                ? "text-[25px] text-white cursor-pointer"
                : "text-[25px] cursor-pointer"
            }
            onClick={toggleDarkMode}
          />
          <div className={`${isDarkMode ? "" : " "}${
            !isButtonClicked
            ? " border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"
            : " border-[1px] border-secondary-500 hover:bg-black"
            } py-2 px-2 rounded-[3px] max-md:px-1 max-md:py-1 rounded-[12px]  flex items-center justify-center flex-col
            transition duration-300 ease-in-out relative
            `} onClick={handleLanguageClick}>
            <FaGlobe
               className={`${
                !isButtonClicked ? "text-secondary-500" : "text-white"
                } z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
            {showLanguages && (
            <div ref={languageRef} className="overflow-hidden absolute z-50 bottom-[-100px] left-10 bg-white border-[1px] border-gray-200 rounded-lg shadow-md flex flex-col items-center">          
            <button
            onClick={() => handleLanguageChange('en')}
            className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'en' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`}>
                {t("English")}
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'es' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`} 
              >
                {t("Spanish")}
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'ar' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`}
              >
                {t("Arabic")}
              </button>
              {/* Add more buttons for additional languages */}
            </div>
            )} 
          </div>
      
            {/* sign up button */}
          <Button
            type="button"
            className={`max-md:px-4 max-md:py-2 md:mr-4 px-7 py-2 rounded-[3px] text-black border border-[#000] ${
              isDarkMode ? "border border-[#F5F5F5] text-white" : "border border-[#000] text-black"
            }`}
            onClick={handleSignInClick}
          >  {t("Sign In")}
          </Button>
          <Button
            type="button"
            className={` rounded-[3px] max-md:px-4 max-md:py-2 px-7 py-2 ${
              isDarkMode ? "bg-[#F5F5F5] border border-[#F5F5F5] text-black" : "text-white bg-black"
            }`}
            onClick={() => {
              navigate("/sign-up/verification");
            }}
          >
            {t("Sign Up")}
          </Button>

        </div>
      </div>
    </header>
  );
};

export default NavBar;
