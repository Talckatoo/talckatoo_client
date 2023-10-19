import React from "react";

const Footer = () => {
  return (
    <footer className="flex items-center p-0 justify-between container mt-[2rem]">
      <p className="sub-title-text ">
        Made with ❤️ by
        <span className="text-title-500"> Talckatoo</span>. All rights reserved.
      </p>

      <div className="flex items-center gap-4">
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/facbook.svg" alt="facebook" />
        </div>
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/twiter.svg" alt="twitter" />
        </div>
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/insta.svg" alt="instagram" />
        </div>
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/linkdin.svg" alt="instagram" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
