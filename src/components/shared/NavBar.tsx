import React, { FC, useEffect, useState } from "react";
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
        scrolled ? "bg-background-500" : ""
      }`}
    >
      <div className="container  w-full flex items-center justify-between ">
        {/* logo section */}
        <Link to="/">
          <div className="">
            <img
              src="/assets/logo.svg"
              alt="logo"
              className="w-[210px] object-cover max-sm:hidden"
            />
            <img
              src="/assets/logo_s.svg"
              alt="logo"
              className="w-[60px] object-cover hidden max-sm:block"
            />
          </div>
        </Link>

        {/* sign up and sign in button */}
        {showSign && (
          <div className="flex items-center gap-4">
            <Button
              type="button"
              className="mr-4 text-primary-500 border-primary-500 "
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              className="bg-primary-500 text-white"
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