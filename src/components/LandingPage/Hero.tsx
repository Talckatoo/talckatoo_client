import { useContext } from "react";
import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <section className="container py-[2rem] mt-[5rem] max-[430px]:mt-[7rem]  ">
      <div className="flex flex-col md:flex-row  md:items-center justify-center">
        <div className=" w-full md:w-[50%]">
          <div className="w-full flex flex-col items-start  max-md:items-center">
            <h1 className="head-text max-md:mx-auto max-md:text-[32px] text-[50px] text-center  md:text-start max-w-[536px]  z-[1] ">
              {t("Bridging Conversations Across Languages")}
            </h1>
            <p className="text-back max-md:mx-auto text-[18px] max-md:text-[16px] text-center md:text-start  mt-4  max-w-[536px] z-[1]">
              {t("Seamlessly chat with individuals across language barriers")}
            </p>
            <Button
              type="submit"
              className={` px-8 py-2 mt-[2rem] z-[1] ${isDarkMode ? "bg-white text-black" : "bg-black text-white"
                }`}
              onClick={() => {
                navigate("/sign-up/verification");
              }}
            >
              {t("Explore now")}

            </Button>
          </div>

          <div className="mt-[2rem] w-full flex flex-col justify-center  md:justify-start">
            <div className="flex gap-1 max-md:mx-auto">
              <img src="/assets/icons/Star.svg" alt="SVG" />
            </div>
            <h2 className="font-jakarta mt-4 font-bold max-md:mx-auto">
              {t("Best translation chat app in market")}
            </h2>
          </div>
          <p className="pt-2  text-center md:text-start text-[18px] max-md:text-[16px]">
            {t(
              "Talckatoo has revolutionized how our team communicates. The real-time translation feature means we can work seamlessly with international partners without missing  a beat!"
            )}
          </p>
          <div className="flex justify-center  md:justify-start gap-2 items-center mt-4 ">
            <img src="/assets/img/Ellipse.png" alt="SVG" />
            <span className="font-jakarta font-bold ">This is working with Portainer</span>
          </div>
        </div>

        <div className="mt-[4rem] z-[1] md:w-[50%] flex flex-col justify-center">
          <img
            src={
              isDarkMode ? "/assets/img/disc.png" : "/assets/img/herotrans.png"
            }
            alt="hero"
            className="w-[583px]  h-full object-contain hidden md:block"
          />
          <img
            src="/assets/img/text1.png"
            alt="text-image"
            className=" h-auto mx-auto block md:hidden"
          />
          <img
            src="/assets/img/text2.png"
            alt="text-image"
            className=" h-auto mx-auto block md:hidden"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
