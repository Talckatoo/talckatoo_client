import React, { FC, useContext, useEffect, useState } from "react";
import Button from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";

import { useTranslation } from 'react-i18next'; //TRANSLATION languages
import { FaGlobe } from 'react-icons/fa';

interface NavBarProps {
  showSign?: boolean;
}

const NavBar: FC<NavBarProps> = ({ }) => {
  const { t } = useTranslation(); //TRANSLATION languages

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

const [showLanguages, setShowLanguages] = useState(false);

  const handleLanguageClick = () => {
    setShowLanguages(!showLanguages);
  };

  const handleLanguageChange = (lng) => {
    changeLanguage(lng);
    setShowLanguages(false);
    setSelectedLanguage(lng);
  };

  const { isDarkMode } = useContext(UserContext);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default

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
    const handleScroll = () => {
      // Check if the page has been scrolled, e.g., if the vertical scroll position is greater than 0.
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // Attach the scroll event listener when the component mounts.
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once when the component mounts.

  return (
      <header className="w-full py-4 fixed top-0 z-50"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
      >
        <div className="w-full flex items-center justify-between max-w-[95%] m-auto">
        {/* logo section */}
        <Link to="/" className="font-jakarta text-[20px] font-bold">
          <span>TALCKATOO</span>
        </Link>
        {/* sign up and sign in button */}
        <div className="flex items-center gap-4">
        <div className={`${isDarkMode ? "bg-primary-500" : "bg-secondary-500 "}${
            !isButtonClicked
            ? "bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"
            : "bg-secondary-500 border-[1px] border-secondary-500 hover:bg-black"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col
            transition duration-300 ease-in-out relative
            `} onClick={handleLanguageClick}>
            <FaGlobe
               className={`${
                !isButtonClicked ? "text-secondary-500" : "text-white"
                } z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
            {showLanguages && (
            <div className="overflow-hidden absolute z-50 bottom-[-60px] left-10 bg-white border-[1px] border-gray-200 rounded-lg shadow-md flex flex-col items-center">          
            <button
            onClick={() => handleLanguageChange('en')}
            className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'en' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`}>
                English
              </button>
              <button
                onClick={() => handleLanguageChange('es')}
                className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'es' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`} 
              >
                Español
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`hover:bg-gray-300 px-5 py-2 w-full ${selectedLanguage === 'ar' ? 'bg-secondary-500 py-3 font-bold text-white' : ''}`}
              >
                Arabic
              </button>
              {/* Add more buttons for additional languages */}
            </div>
            )} 
          </div>
          <Button
            type="button"
            className="max-md:px-4 max-md:py-2 md:mr-4 px-7 py-2 rounded-[3px] text-black border border-[#000]"
            onClick={handleSignInClick}
          >
            Sign In
          </Button>
          <Button
            type="button"
            className="bg-black rounded-[3px] max-md:px-4 max-md:py-2 text-white px-7 py-2"
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            Sign Up
          </Button>

        </div>
      </div>
    </header>
  );
};

export default NavBar;
