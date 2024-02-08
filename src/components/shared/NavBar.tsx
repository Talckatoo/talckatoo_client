import { FC, useEffect, useState } from "react";
import Button from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";


interface NavBarProps {
  showSign?: boolean;
}

const NavBar: FC<NavBarProps> = ({ }) => {
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
        <div className="w-full flex items-center justify-between max-w-[95%] m-auto max-[430px]:flex-col">
        {/* logo section */}
        <Link to="/" className="font-jakarta text-[20px] font-bold flex items-center justify-left">
          {
            /*
              <img 
                className="w-[75px] w-min-[75px] h-auto transition ease-in-out duration-300 scale-100 hover:scale-105"
                src="cockatoo-bw.png"
              />
            */        
          }
          <span>TALCKATOO</span>
        </Link>
        {/* sign up and sign in button */}
        <div className="flex items-center gap-4 max-[430px]:w-full max-[430px]:flex max-[430px]:justify-center">
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
