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
      className={`w-full py-4  sticky top-0 z-50 ${
        scrolled ? "bg-[#cecece]" : ""
      }`}
    >
      <div className="container  w-full flex items-center justify-between ">
        {/* logo section */}
        <Link to="/" className="font-jakarta font-medium">
          <span>TALCKATOO</span>
        </Link>

        {/* sign up and sign in button */}
        {showSign && (
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="mr-4 bg-light-bg text-black border border-[#000]"
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              className="bg-black text-white"
              onClick={() => {
                navigate("/sign-up");
              }}     
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
