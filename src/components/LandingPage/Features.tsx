import React from "react";

const Features = () => {
  return (
    <section className="mt-[5rem]  ">
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="head-text text-center max-w-[983px] z-[1]">
          Why Choose Talckatoo?
        </h2>
        <p className="sub-title-text text-center mt-4 max-w-[768px] z-[1]">
          Many chat platforms restrict you within language barriers. But with
          us, the world is truly at your fingertips.
        </p>

        <div className="grid grid-cols-3 gap-3 mt-[3rem] z-[1] max-md:grid-cols-1">
          <div className="flex flex-col max-md:flex-row max-md:flex-wrap  items-center gap-36 max-md:gap-5 max-md:justify-center mt-[4rem]">
            <div className="bg-secondary-500 w-[342.6px] h-[115px] rounded-[25px] flex items-center  p-5 gap-4">
              <div className="flex items-center justify-center h-full w-[50px]">
                <img src="/assets/icons/traduction.png" alt="translate" />
              </div>
              <span className="text-white sub-title-text font-medium">
                Real-time Translation
              </span>
            </div>
            <div className="bg-secondary-500 w-[342.6px] h-[115px] ml-[-2rem] max-md:ml-0 rounded-[25px] flex items-center p-4 gap-4">
              <div className="flex items-center justify-center h-full w-[50px]">
                <img src="/assets/icons/notification.png" alt="translate" />
              </div>
              <span className="text-white sub-title-text font-medium">
                Instant Notifications
              </span>
            </div>
          </div>
          <div className="mt-[5rem] z-[1] items-center flex flex-col">
            <img
              src="/assets/img/phone.png"
              alt="hero"
              className="w-[300px] h-full object-contain"
            />
          </div>
          <div className="flex flex-col max-md:flex-row max-md:flex-wrap items-center gap-36 max-md:gap-3 max-md:justify-center mt-[4rem]">
            <div className="bg-secondary-500 w-[342.6px] h-[115px] rounded-[25px] flex items-center p-4 gap-4">
              <div className="flex items-center justify-center h-full w-[50px]">
                <img src="/assets/icons/voice.png" alt="translate" />
              </div>
              <span className="text-white sub-title-text font-medium ">
                Voice-to-voice translation
              </span>
            </div>
            <div className="bg-secondary-500 w-[342.6px] h-[115px] ml-[2rem] max-md:ml-0 rounded-[25px] flex items-center p-4 gap-4">
              <div className="flex items-center justify-center h-full w-[50px]">
                <img src="/assets/icons/ai.png" alt="translate" />
              </div>
              <span className="text-white sub-title-text font-medium">
                AI assistance
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
