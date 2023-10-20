import React from "react";
import NavBar from "../components/shared/NavBar";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";
import Testimonials from "../components/LandingPage/Testimonials";
import Contact from "../components/LandingPage/Contact";
import Footer from "../components/shared/Footer";

const Home = () => {
  return (
    <main className="relative bg-background-500 h-full w-full font-inter ">
      <div className="bg-background-500 fixed top-0 left-0 w-full h-full -z-20"></div>
      <img
        src="/assets/img/shape1.svg"
        alt="shape"
        className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
      />
      <img
        src="/assets/img/shape2.svg"
        alt="shape"
        className="fixed  left-0  bottom-[-150px] max-lg:w-[350px]"
      />
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
      <hr className="border-[#33363A] mt-[15rem]   h-2 w-full container" />
      {/* About section*/}
      <About />
      {/* End about section */}
      <hr className="border-[#33363A] mt-[15rem]   h-2 w-full container" />
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
