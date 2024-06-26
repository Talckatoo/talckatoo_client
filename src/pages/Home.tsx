import { useContext } from "react";
import NavBar from "../components/shared/NavBar";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";
import Newsletter from "../components/LandingPage/Newsletter";
import { UserContext } from "../context/user-context";
import Footer from "../components/shared/Footer";
import Testimonials from "../components/LandingPage/Testimonials";

const Home = () => {
  const { isDarkMode } = useContext(UserContext);

  return (
    <div
      className={`relative h-full w-full font-inter z-[5] ${
        isDarkMode ? "text-white" : ""
      }`}
    >
      { /* shape  on dark mode*/}
      {isDarkMode ? 
      <img 
      src="/assets/img/worlddarkmode.svg"
      alt="shape"
      className="fixed  right-0  bottom-[8px] w-[60%] z-[-1] "
      />
      :
      <img
      src="/assets/img/world.png"
      alt="shape"
      className="fixed  right-0  bottom-[8px] w-[60%] z-[-1] "
      />
    }
      {/* nav bar section */}
      <NavBar />
      {/* End Navbar Section */}
      {/* hero section */}
      <Hero />
      {/* End Hero section */}
      {/* Todo: Add links to playstore and appstore and webstie */}
      {/* feature section */}

      <Features />
      {/* End feature section */}

      {/* About section*/}
      <About />
      {/* End about section */}

      {/* testimoniails section */}
      <Testimonials />
      {/* End testimonials section */}
      <div className="container p-0 max-md:p-5">
        <Newsletter />
      </div>
      <Footer />
      <br />
    </div>
  );
};

export default Home;
