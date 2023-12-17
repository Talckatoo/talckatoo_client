import React from "react";

const Features = () => {
  return (
    <section className=" container mt-[5rem] ">
      <div className="flex gap-5 w-full">
        <div className="w-[50%]">
        <div>
          <h2 className=" head-text text-black text-start max-w-[983px] z-[1]">
          Why Choose Talckatoo?
          </h2>
          <p className=" text-start mt-4 max-w-[768px] z-[1]">
          Many chat platforms restrict you within language barriers. But with
          us, the world is truly at your fingertips.
          </p>

        </div>
        <div className="mt-[5rem] grid grid-cols-2 grid-rows-2 gap-4">
           
           <div className="bg-light-bg p-4 flex items-center gap-8 rounded-[25px]">
            <img src="/assets/icons/traduction.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center"> Text-to-Text Translation</span>       
          </div>
           <div className="bg-light-bg p-4 flex  items-center  rounded-[25px]">
            <img src="/assets/icons/voice.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span className="text-center">Voice-to-Voice Translation</span>
           </div>
           <div className="bg-light-bg p-4 flex items-center gap-8 rounded-[25px]">
            <img src="/assets/icons/friend.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span>Friend Matching </span>
           </div>
           <div className="bg-light-bg p-4 flex items-center gap-8 rounded-[25px]">
            <img src="/assets/icons/tool.png" alt="translate" className=" w-[42px] h-[42px]" />
            <span>AI Assistance</span>
           </div>
        </div>
  
        </div>
        <div className="w-[50%] flex  justify-center">
          <img src="/assets/img/iPhone.png" alt="iPhone" className="md:max-w-[50%]" />
        </div>
      </div>
    </section>
  );
};

export default Features;
