import React from "react";
import { testimonials } from "../../constants/testimonials";

const Testimonials = () => {
  return (
    <section className="my-[2rem] p-0 max-md:p-5 container ">
      <div className="flex flex-col items-center justify-center w-full">
        <h2 className="head-text text-center max-w-[883px] z-[1]">
          Don't take our word for it...
        </h2>
        <p className="sub-title-text text-center mt-4 max-w-[768px] z-[1]">
          Hear what our satisfied users have to say about Talckatoo.
        </p>

        <div className="grid grid-cols-3 gap-10 max-md:grid-cols-2  max-sm:grid-cols-1 items-center mt-[4rem] w-full z-[1] p-0  justify-between">
          {testimonials.map((testimonial, index) => (
            <div
              className="flex flex-col justify-between relative bg-secondary-500 h-[393px] items-start gap-2 p-8"
              key={index}
            >
              <div className="flex items-start gap-2 flex-col">
                <div className=" h-[50px] w-[50px]  relative">
                  <img
                    src={`${testimonial.image}`}
                    alt="hero"
                    className="w-[48px] h-[48px] object-cover  rounded-full "
                  />
                  <img
                    src="/assets/img/quote.svg"
                    alt="quote"
                    className="absolute top-0 right-0 w-[27px] h-[18px] object-contain"
                  />
                </div>

                <p className="sub-title-text text-[#9BA9B4] text-[18px] max-w-[308px]">
                  {testimonial.text}
                </p>
              </div>
              <div className="w-full">
                <hr className="border-[#33363A]  bottom-14   h-2 w-full" />
                <p className="sub-title-text text-title-500 max-w-[308px] flex items-center gap-1 text-[16px]">
                  {testimonial.name}
                  <span className="text-secondary-500">/</span>
                  <span className="text-primary-500">{testimonial.title}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
