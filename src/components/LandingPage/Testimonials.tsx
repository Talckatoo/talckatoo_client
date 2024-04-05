import { useState, useContext } from "react";
import { UserContext } from "./../../context/user-context";
import { testimonials } from "../../constants/testimonials";

const Testimonials = () => {
  const { isDarkMode } = useContext(UserContext);

  return (
    <section className=" max-md:p-5 container mt-[8rem] ">
      <div className="flex flex-col w-full ">
        <div className="flex justify-center md:justify-start  gap-4 uppercase">
          <img src="/assets/icons/Rectangle.svg" alt="rectangle" />
          <span className=" font-dms max-md:text-[16px] text-[18px] text-[#5D5DFF] text-bold">
            Testimonials
          </span>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <h2 className=" text-center md:text-start font-dms max-md:text-[25px] md:text-[40px]  max-w-[883px] z-[1]">
            Don't take our word for it...
          </h2>
          <p className=" mt-3 max-md:text-[16px]  text-[18px] text-center md:text-start md:max-w-[433px] z-[1]">
            Hear what our satisfied users have to say about Talckatoo.
          </p>
        </div>

        <div className="grid  gap-10 md:grid-cols-2  max-sm:grid-cols-1  sm:mx-auto items-center mt-[4rem] w-full z-[1]   justify-between p-card">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`p-16  border shadow-lg  rounded-[20px] card ${
                isDarkMode
                  ? "bg-[#282828] text-white border-[#575757]"
                  : " bg-light-bg border-[#EFF0F6] text-black"
              }`}
            >
              <p className="max-md:text-[16px]    text-[18px]">{item.text}</p>
              <div className="flex items-center  gap-4  mt-4">
                <img src={item.image} alt="i" />
                <div className="flex flex-col">
                  <h4 className="max-md:text-[16px]   text-[18px] font-bold">
                    {item.name}
                  </h4>
                  <span className="max-md:text-[16px]   text-[18px]">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
