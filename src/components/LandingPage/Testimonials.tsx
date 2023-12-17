import React from "react";
import { testimonials } from "../../constants/testimonials";

const Testimonials = () => {
  return (
    <section className="my-[2rem] p-0 max-md:p-5 container ">
      <div className="flex flex-col justify-center w-full">
        <div className="flex gap-4 uppercase">
          <img src="/assets/icons/Rectangle.svg" alt="rectangle"/>
          <span className=" font-dms text-[#5D5DFF] text-bold">Testimonials</span>
        </div>
        <div>
          <h2 className=" font-dms text-black text-[40px]  max-w-[883px] z-[1]">
            Don't take our word for it...
          </h2>
          <p className=" mt-3 max-w-[433px] z-[1]">
            Hear what our satisfied users have to say about Talckatoo.
          </p>
        </div>
        

        <div className="grid  gap-10 md:grid-cols-2  max-sm:grid-cols-1 items-center mt-[4rem] w-full z-[1] p-0  justify-between">
          {testimonials.map( (item, index) => (

    <div key={index} className="p-8 bg-light-bg rounded-[20px]">
        <p>{item.text}</p>
      <div className="flex items-center gap-4  mt-4">
       <img src={item.image} alt="i" />
       <div className="flex flex-col">
         <h4>{item.name}</h4>
          <span>{item.title}</span>
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
