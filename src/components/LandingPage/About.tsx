import React from "react";
import { MdDone } from "react-icons/md";

const About = () => {
  return (
    <section className="mt-[2rem] p-0 max-md:p-5 container">
      <div className="flex flex-col ">
        <div>
        <h2 className="head-text text-black text-start max-w-[883px] z-[1]">
          One Chat Platform, Unlimited Opportunities
        </h2>
        <p className=" mt-4 max-w-[800px] z-[1]">
        From casual conversations to professional meetings, make every word understood, every emotion felt.
        </p>

        </div>
        
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-10 items-center mt-[4rem] z-[1] w-full">
          <div className="flex flex-col items-start gap-2 max-w-[505px] bg-light-bg py-8 px-12 rounded-[25px]">
            <span className="text-primary-500 text-[20px] font-archetic">
              Efficient and Cost-Effective
            </span>
            <h2 className="head-text text-[30px]">Stay Engaged, Always</h2>
            <p className="sub-title-text">
              With Talkcatoo, enjoy seamless communication, ensuring that every
              project stays on track without hitches. Dive into chats that
              resonate, with real-time translation ensuring everyone's on the
              same page.
            </p>
            <ul className="sub-title-text font-thin mt-[1rem] flex items-start gap-2 flex-col">
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Engage without language barriers
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Focus on what truly{" "}
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Dive deep into discussions with clarity
              </li>
            </ul>
          </div>

          <div className="">
            <img
              src="/assets/img/about1.png"
              alt="hero"
              className="w-[90%] h-full  object-cover max-h-[400px]  rounded-[25px]"
            />
          </div>
          <div className="max-md:order-1">
            <img
              src="/assets/img/about2.png"
              alt="hero"
              className="w-[90%] h-full   object-cover max-h-[400px]  rounded-[25px]"
            />
          </div>
          <div className="flex flex-col items-start gap-2 max-w-[505px] bg-light-bg py-8 px-12 rounded-[25px]">
            <span className="text-primary-500 text-[20px] font-archetic">
              Simple, Yet Powerful
            </span>
            <h2 className="head-text text-[30px]">Connect Beyond Boundaries</h2>
            <p className="sub-title-text">
              With Talkcatoo, experience a chat platform that defies limits.
              Whether it's a project discussion or a casual chat, our advanced
              features ensure that distance and language are never barriers.
            </p>
            <ul className="sub-title-text font-thin mt-[1rem] flex items-start gap-2 flex-col">
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Seamless chats with a user-friendly interface
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Clear voice and video calls
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                Timely notifications
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
