import React from "react";
import NavBar from "../components/shared/NavBar";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";
import Testimonials from "../components/LandingPage/Testimonials";
import Contact from "../components/LandingPage/Contact";
import Footer from "../components/shared/Footer";
import world from "../../public/assets/img/world.png"

const Home = () => {
  return (
    <main className="relative bg-white h-full w-full font-inter z-[5]  ">
      <img
        src={world}
        alt="shape"
        className="fixed  right-0  bottom-[8px] w-[60%] z-[-1] "
      />
      {/* nav bar section */}
      <NavBar />
      {/* End Navbar Section */}
      {/* hero section */}
      <Hero />
      {/* End Hero section */}
      {/* Todo: Add links to playstore and appstore and webstie */}
      {/* feature section */}
      <div className="border-[#33363A] mt-[5rem]  md:mt-[15rem]   h-2 w-full container" />
      <Features />
      {/* End feature section */}
      <div className="border-[#33363A] mt-[15rem]   h-2 w-full container" />
      {/* About section*/}
      <About />
      {/* End about section */}
      <div className="border-[#33363A] mt-[15rem]   h-2 w-full container" />
      {/* testimoniails section */}
      <Testimonials />
      {/* End testimonials section */}
      <div className="container p-0 max-md:p-5">
        <Contact />
      </div>
      <Footer />
      <br />
    </main>
  );
};

export default Home;
