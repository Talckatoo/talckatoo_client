import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { MdDone } from "react-icons/md";
import { UserContext } from "../../context/user-context";

const About = () => {
  const {isDarkMode} = useContext(UserContext);
  const { t } = useTranslation();
  return (
    <section className="container mt-[5rem]  max-md:p-5 ">
      <div className="flex flex-col ">
        <div className="flex flex-col justify-center items-center	 md:items-start">
          <h2 className="head-text text-center md:text-start max-w-[883px] z-[1]">
          {t("One Chat Platform, Unlimited Opportunities")}
          </h2>
          <p className="text-center md:text-start mt-4  text-[18px] max-md:text-[16px] max-w-[964px] z-[1]">
         
            {t("There are no limits to the extent")}
          </p>
        </div>

        <div className="flex flex-col gap-5 justify-center items-center	 justify-center mt-[4rem] z-[1] w-full ">
          <div className="flex flex-col justify-center items-center md:flex-row md:items-center w-full gap-[4rem]">
            <div className={`flex flex-col md:w-1/2 w-full items-start gap-2 shadow-lg max-w-[565px]  md:h-full  py-8 px-12 rounded-[25px] border ${isDarkMode ? " bg-[#282828] border-[#575757]" : "bg-light-bg  border-[#EFF0F6]"}`}>
              <span className="text-primary-500 max-md:text-[16px] text-[20px] font-archetic">
              {t("Efficient and Cost-Effective")}
              </span>
              <h2 className={isDarkMode ? "head-text max-md:text-[25px] text-[32px] text-white" : "head-text max-md:text-[25px] text-[32px] text-black"}>
              {t("Stay Engaged, Always")}
              </h2>
              <p className={isDarkMode ? "text-[18px] max-md:text-[16px]  text-white" : "text-[18px] max-md:text-[16px]  text-black"}>
              {t("We offer an effective and affordable option")}
              </p>
              <ul className=" mt-[1rem] flex items-start gap-2 flex-col  max-md:text-[16px] text-[18px]">
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Engage without language barriers")}
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Focus on what truly")}{" "}
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Dive deep into discussions with clarity")}
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
              {t("Simple, Yet Powerful")}
              </span>
              <h2 className={isDarkMode ? "head-text max-md:text-[25px] text-[32px] text-white" : "head-text max-md:text-[25px] text-[32px] text-black"}>
              {t("Connect Beyond Boundaries")}
              </h2>
              <p className= {isDarkMode ? "text-[18px] max-md:text-[16px]  text-white" : "text-[18px] max-md:text-[16px]  text-black"}>
              
                {t("With a one-of-a-kind design")}
              </p>
              <ul className=" mt-[1rem] flex items-start gap-2 flex-col max-md:text-[16px] text-[18px]">
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Seamless chats with a user-friendly interface")}
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Clear voice and video calls")}
                </li>
                <li className={`flex items-center gap-2  ${isDarkMode ? "text-white" : "text-black"}`}>
                  <MdDone className="text-green-600" />
                  {t("Timely notifications")}
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
