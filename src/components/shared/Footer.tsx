import {useTranslation} from 'react-i18next'

const Footer = () => {
  const {t}=useTranslation();
  return (
    <footer className="flex items-center max-md:p-5 px-[2.5rem] justify-between container mt-[2rem] max-md:mt-0 max-md:items-center text-center gap-3 max-sm:flex-col-reverse">
      <p className="">
        {t("Made with love by")}
        <span className=" text-black"> Talckatoo</span>. {t("All rights reserved.")}
      </p>

      <div className="flex items-center gap-4 res">
        {/* <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/facbook.svg" alt="facebook" />
        </div> */}
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <a target="_blank" href="https://twitter.com/talckatoo">
            <img src="/assets/icons/twiter.svg" alt="twitter" />
          </a>
        </div>
        {/* <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <img src="/assets/icons/insta.svg" alt="instagram" />
        </div> */}
        <div className="bg-secondary-500 rounded-full w-[50px] h-[50px] flex flex-col items-center justify-center">
          <a
            target="_blank"
            href="https://www.linkedin.com/company/96162808/admin/feed/posts/"
          >
            <img src="/assets/icons/linkdin.svg" alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
