import { FC, useEffect, useState, useContext } from "react";
import Button from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { MdDarkMode } from "react-icons/md";

interface NavBarProps {
  showSign?: boolean;
}

const NavBar: FC<NavBarProps> = ({}) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(UserContext);

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
          <Button
            type="button"
            className={`max-md:px-4 max-md:py-2 md:mr-4 px-7 py-2 rounded-[3px] text-black border border-[#000] ${
              isDarkMode ? `bg-white text-black` : `bg-black text-white`
            }`}
            onClick={handleSignInClick}
          >
            Log In
          </Button>
          <Button
            type="button"
            className={` rounded-[3px] max-md:px-4 max-md:py-2 px-7 py-2 ${
              isDarkMode ? `bg-white text-black` : `bg-black text-white`
            }`}
            onClick={() => {
              navigate("/sign-up/verification");
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
