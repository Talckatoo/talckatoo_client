import React, { useContext } from "react";
import { MdDone } from "react-icons/md";
import { UserContext } from "../../context/user-context";

const About = () => {
  const {isDarkMode} = useContext(UserContext);
  return (
    <section className="container mt-[5rem]  max-md:p-5 ">
      <div className="flex flex-col ">
        <div className="flex flex-col justify-center items-center	 md:items-start">
          <h2 className="head-text text-center md:text-start max-w-[883px] z-[1]">
            One Chat Platform, Unlimited Opportunities
          </h2>
          <p className="text-center md:text-start mt-4  text-[18px] max-md:text-[16px] max-w-[964px] z-[1]">
            From casual conversations to professional meetings, make every word
            understood, every emotion felt.
          </p>
        </div>

        <div className="flex flex-col gap-5 justify-center items-center	 justify-center mt-[4rem] z-[1] w-full ">
          <div className="flex flex-col justify-center items-center md:flex-row md:items-center w-full gap-[4rem]">
            <div className={`flex flex-col md:w-1/2 w-full items-start gap-2 shadow-lg max-w-[565px]  md:h-full  py-8 px-12 rounded-[25px] border ${isDarkMode ? " bg-[#282828] border-[#575757]" : "bg-light-bg  border-[#EFF0F6]"}`}>
              <span className="text-primary-500 max-md:text-[16px] text-[20px] font-archetic">
                Efficient and Cost-Effective
              </span>
              <h2 className={isDarkMode ? "head-text max-md:text-[25px] text-[32px] text-white" : "head-text max-md:text-[25px] text-[32px] text-black"}>
                Stay Engaged, Always
              </h2>
              <p className={isDarkMode ? "text-[18px] max-md:text-[16px]  text-white" : "text-[18px] max-md:text-[16px]  text-black"}>
                With Talkcatoo, enjoy seamless communication, ensuring that
                every project stays on track without hitches. Dive into chats
                that resonate, with real-time translation ensuring everyone's on
                the same page.
              </p>
              <ul className=" mt-[1rem] flex items-start gap-2 flex-col  max-md:text-[16px] text-[18px]">
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Engage without language barriers
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Focus on what truly{" "}
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Dive deep into discussions with clarity
                </li>
              </ul>
            </div>
            <div className="flex justify-center md:w-1/2 w-full items-center box-border">
              <img
                src="/assets/img/about1.png"
                alt="hero"
                className="w-full max-h-[400px] object-cover rounded-[50px] py-5 px-5"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:items-center w-full gap-[4rem]">
            <div className="flex order-1 md:order-none justify-center md:w-1/2 w-full items-center box-border">
              <img
                src="/assets/img/about2.png"
                alt="hero"
                className="w-full max-h-[400px] object-cover rounded-[50px] py-5 px-5"
              />
            </div>
            <div className={`flex flex-col md:w-1/2 w-full items-start gap-2 shadow-lg max-w-[565px]  md:h-full py-8 px-12 rounded-[25px] border ${isDarkMode ? "bg-[#282828] border-[#575757]" : "border-[#EFF0F6]  bg-light-bg "}`}>
              <span className="text-primary-500 max-md:text-[16px] text-[20px] font-archetic">
                Simple, Yet Powerful
              </span>
              <h2 className={isDarkMode ? "head-text max-md:text-[25px] text-[32px] text-white" : "head-text max-md:text-[25px] text-[32px] text-black"}>
                Connect Beyond Boundaries
              </h2>
              <p className= {isDarkMode ? "text-[18px] max-md:text-[16px]  text-white" : "text-[18px] max-md:text-[16px]  text-black"}>
                With Talkcatoo, experience a chat platform that defies limits.
                Whether it's a project discussion or a casual chat, our advanced
                features ensure that distance and language are never barriers.
              </p>
              <ul className=" mt-[1rem] flex items-start gap-2 flex-col max-md:text-[16px] text-[18px]">
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Seamless chats with a user-friendly interface
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Clear voice and video calls
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  Timely notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
