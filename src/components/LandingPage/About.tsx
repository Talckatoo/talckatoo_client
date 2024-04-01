import { useTranslation } from 'react-i18next';
import { MdDone } from "react-icons/md";

const About = () => {
  const { t } = useTranslation();
  return (
    <section className="container mt-[5rem]  max-md:p-5 ">
      <div className="flex flex-col ">
        <div className="flex flex-col justify-center items-center md:items-start">
        <h2 className="head-text text-center md:text-start text-black max-w-[883px] z-[1]">
          {t("One Chat Platform, Unlimited Opportunities")}
        </h2>
        <p className="text-center md:text-start mt-4  text-[18px] max-md:text-[16px] max-w-[964px] z-[1]">
        {t("There are no limits to the extent")}
        </p>
          <br/>
          <ul className='px-5 m-5'>
            <li>{t("Business meetings in companies that hire globally")}</li>  
            <li>{t("Friends and family catchups")}</li>
            <li>{t("Random friend matching")}</li>
            <li>{t("Customer support")}</li>
            <li>{t("…and much more")}</li>
          </ul>

        </div>
        
        <div className="grid grid-cols-2 grid-rows-2 max-md:grid-cols-1 gap-x-[4rem] gap-y-12 items-center mt-[4rem] z-[1] w-full ">
          <div className="flex flex-col items-start gap-2 shadow-lg max-w-[565px]  md:h-full bg-light-bg py-8 px-12 rounded-[25px] border border-[#EFF0F6]">
            <span className="text-primary-500 max-md:text-[16px] text-[20px] font-archetic">
              {t("Efficient and Cost-Effective")}
            </span>
            <h2 className="head-text max-md:text-[25px] text-[32px] text-black">{t("Stay Engaged, Always")}</h2>
            <p className=" text-[18px] max-md:text-[16px]">
              {t("We offer an effective and affordable option")}
            </p>
            <ul className=" mt-[1rem] flex items-start gap-2 flex-col  max-md:text-[16px] text-[18px]">
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Engage without language barriers")}
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Focus on what truly")}{" "}
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Dive deep into discussions with clarity")}
              </li>
            </ul>
          </div>

          <div className="">
            <img
              src="/assets/img/about1.png"
              alt="hero"
              className="md:w-[96%]  max-h-[411px] object-cover rounded-[25px]"
            />
          </div>
          <div className="max-md:order-1 w-full">
            <img
              src="/assets/img/about2.png"
              alt="hero"
              className=" md:w-[96%] max-h-[411px] object-cover rounded-[25px]"
            />
          </div>
          <div className="flex flex-col items-start shadow-lg gap-2 max-w-[565px] md:h-full bg-light-bg py-8 px-12 rounded-[25px] border border-[#EFF0F6]">
            <span className="text-primary-500 max-md:text-[16px] text-[20px] font-archetic">
              {t("Simple, Yet Powerful")}
            </span>
            <h2 className="head-text max-md:text-[25px] text-[32px] text-black">{t("Connect Beyond Boundaries")}</h2>
            <p className="text-[18px] max-md:text-[16px]">
              {t("With a one-of-a-kind design")}
            </p>
            <ul className=" mt-[1rem] flex items-start gap-2 flex-col max-md:text-[16px] text-[18px]">
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Seamless chats with a user-friendly interface")}
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Clear voice and video calls")}
              </li>
              <li className="flex items-center gap-2">
                <MdDone className="text-green-600" />
                {t("Timely notifications")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
