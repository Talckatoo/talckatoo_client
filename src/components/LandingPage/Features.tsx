import { useContext } from "react";
import { UserContext } from "../../context/user-context";
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { isDarkMode } = useContext(UserContext);
  const { t } = useTranslation(); 
  return (
    <section className=" container md:mt-[8rem] mt-[5rem] ">
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <div className="w-full md:w-[50%]">
          <div className="flex flex-col justify-center items-center md:items-start">
            <h2
              className={`head-text text-center  md:text-start max-w-[983px] z-[1]`}
            >
              {t("Why Choose Talckatoo")}
            </h2>
            <p className="mt-4 max-w-[533px] md-max:text-[16px] text-[18px] z-[1] text-center md:text-start">
            {t("Many chat platforms restrict you within language barriers")}
            </p>
          </div>
          <div className="mt-[5rem] grid sm:grid-cols-2 md:grid-rows-2 gap-8 sm:justify-center ">
            <div className={` ${ isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-light-bg border-[#EFF0F6]" } shadow-blur border gap-1 max-sm:gap-4 px-8 py-4 flex justify-around items-center rounded-[25px] w-100 md:flex-row flex-col`}>
              <div className="w-1/4 flex justify-center items-center">
                <img
                  src="/assets/new/translate.png"
                  alt="translate"
                  className=" w-[42px] h-[42px]"
                />{" "}
              </div>
              <div className="w-3/4 flex justify-center">
                <span
                  className={`text-center max-sm:text-[18px] text-[20px] ${
                    isDarkMode ? "text-[#F5F5F5]" : "text-black"
                  }`}
                >
                 {t("Text-to-Text Translation")}
                </span>
              </div>
            </div>
            <div className={` ${ isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-light-bg border-[#EFF0F6]" } shadow-blur border gap-1 max-sm:gap-4 px-8 py-4 flex justify-around items-center rounded-[25px] w-100 md:flex-row flex-col`}>
              <div className="w-1/4 flex justify-center items-center">
                <img
                  src="/assets/new/online-translator.png"
                  alt="translate"
                  className=" w-[48px] h-[48px]"
                />
              </div>
              <div className="w-3/4 flex justify-center">
                <span className="text-center max-sm:text-[18px]  text-[20px]">
                {t("Voice-to-Voice Translation")}
                </span>
              </div>
            </div>
            <div className={` ${ isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-light-bg border-[#EFF0F6]" } shadow-blur border gap-1 max-sm:gap-4 px-8 py-4 flex justify-around items-center rounded-[25px] w-100 md:flex-row flex-col`}>
              <div className="w-1/4 flex justify-center items-center">
                <img
                  src="/assets/new/link.png"
                  alt="translate"
                  className=" w-[42px] h-[42px]"
                />
              </div>
              <div className="w-3/4 flex justify-center">
                <span className="text-center text-[20px]">
                {t("Friend Matching")}{" "}
                </span>
              </div>
            </div>
            <div className={` ${ isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-light-bg border-[#EFF0F6]" } shadow-blur border gap-1 max-sm:gap-4 px-8 py-4 flex justify-around items-center rounded-[25px] w-100 md:flex-row flex-col`}>
              <div className="w-1/4 flex justify-center items-center">
                <img
                  src="/assets/new/ai.png"
                  alt="translate"
                  className=" w-[42px] h-[42px]"
                />
              </div>
              <div className="w-3/4 flex justify-center">
                <span className="text-center text-[20px]">{t("AI Assistance")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-[50%] flex p-4 md:p-0 justify-center">
          <img
            src="/assets/img/iPhonePro.png"
            alt="iPhone"
            className="md:max-w-[50%] h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
