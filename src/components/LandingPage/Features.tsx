import { useTranslation } from 'react-i18next';

import React from "react";

const Features = () => {
  const { t } = useTranslation(); 
  return (
    <section className=" container mt-[8rem] ">
      <div className="flex flex-col md:flex-row gap-5 w-full">
        <div className="w-full md:w-[50%]">
        <div className="flex flex-col justify-center items-center md:items-start">
          <h2 className=" head-text text-black text-center  md:text-start max-w-[983px] z-[1]">
          {t("Why Choose Talckatoo")}
          </h2>
          <p className="mt-4 max-w-[533px] md-max:text-[16px] text-[18px] z-[1] text-center md:text-start">
          {t("Many chat platforms restrict you within language barriers")}
          </p>

        </div>
        <div className="mt-[5rem] grid sm:grid-cols-2 md:grid-rows-2 gap-4 sm:justify-center ">
           
           <div className="bg-light-bg shadow-lg border border-[#EFF0F6] p-4 flex items-center  max-sm:gap-4 rounded-[25px]">
            <img src="/assets/icons/traduction.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center max-sm:text-[18px]  text-[20px]"> {t("Text-to-Text Translation")}</span>       
          </div>
           <div className="bg-light-bg shadow-lg border max-sm:gap-4 border-[#EFF0F6] p-4 flex  items-center  rounded-[25px]">
            <img src="/assets/icons/voice.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center max-sm:text-[18px]  text-[20px]">{t("Voice-to-Voice Translation")}</span>
           </div>
           <div className="bg-light-bg border shadow-lg border-[#EFF0F6] p-4  items-center gap-8 rounded-[25px] hidden md:flex">
            <img src="/assets/icons/friend.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center text-[20px]">{t("Friend Matching")}</span>
           </div>
           <div className="bg-light-bg shadow-lg border border-[#EFF0F6] p-4 items-center gap-8 rounded-[25px] hidden md:flex">
            <img src="/assets/icons/tool.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center text-[20px]">{t("AI Assistance")}</span>
           </div>
        </div>
  
        </div>
        <div className="md:w-[50%] flex p-4 md:p-0 justify-center">
          <img src="/assets/img/iPhone.png" alt="iPhone" className="md:max-w-[50%] h-full object-contain" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4 sm:justify-center ">
          <div className="bg-light-bg border shadow-lg border-[#EFF0F6] p-4 flex justify-center  items-center gap-8 rounded-[25px]  md:hidden ">
            <img src="/assets/icons/friend.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span>Friend Matching </span>
           </div>
           <div className="bg-light-bg border shadow-lg border-[#EFF0F6] p-4 flex justify-center   items-center gap-8 rounded-[25px] md:hidden ">
            <img src="/assets/icons/tool.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span>AI Assistance</span>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
