import { FC, useEffect, useState } from "react";
import Button from "../../UI/Button";
import { Link, useNavigate } from "react-router-dom";

interface NavBarProps {
  showSign?: boolean;
}

const NavBar: FC<NavBarProps> = ({ showSign = true }) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        // Change this value based on when you want the background to appear
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className="w-full py-4   fixed bg-white top-0 z-50"
    >
      <div className="  w-full flex items-center justify-between max-w-[95%] m-auto">
        {/* logo section */}
        <Link to="/" className="font-jakarta text-[16px] font-bold">
          <span>TALCKATOO</span>
        </Link>
        {/* sign up and sign in button */}
        
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className=" max-md:px-4 max-md:py-2 md:mr-4 px-7 py-2  rounded-[3px]       text-black border border-[#000]"
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              className="bg-black rounded-[3px]  max-md:px-4 max-md:py-2 ; text-white px-7 py-2"
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
