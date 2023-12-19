import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container py-[2rem] lg:py-[8rem] ">
      <div className="flex flex-col md:flex-row  md:items-center justify-center">
        <div className=" w-full md:w-[50%]">
          <div className="w-full flex flex-col">
            <h1 className="head-text max-md:mx-auto text-center md:text-start max-w-[351px] max-lg:max-w-[253px] z-[1] text-black ">
              Bridging Conversations Across Languages
            </h1>
            <p className="text-back max-md:mx-auto text-center md:text-start lg:text-[13px] xl:text-[12px] mt-4 max-w-[700px] max-lg:max-w-[533px] z-[1]">
              Seamlessly chat with individuals across language barriers. No more
              copy-pasting. Just real-time, in-chat translations.
            </p>
            <Button
              type="button"
              className="bg-black mx-auto md:mx-0 text-white mt-4 z-[1] bt-size"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Download Now
            </Button>
          </div>
          <div className="mt-[3rem] w-full flex flex-col justify-center  md:justify-start">
            <div className="flex gap-1 max-md:mx-auto">
              <img src="assets/icons/Star.svg" alt="SVG" />
            </div>
            <h2 className="font-jakarta mt-4 font-bold max-md:mx-auto">
              Best chat app in market!
            </h2>
          </div>
          <p className="pt-2  text-center md:text-start  lg:text-[13px]">
            Talkcatoo has revolutionized how our team communicates. The
            real-time translation feature means we can work seamlessly with
            international partners without missing a beat!
          </p>
          <div className="flex justify-center  md:justify-start gap-2 items-center mt-4 ">
            <img src="assets/img/Ellipse.png" alt="SVG" />
            <span className="font-jakarta font-bold "> Denny Jones</span>
          </div>
        </div>

        <div className="mt-[4rem] z-[1] md:w-[50%] ">
          <img
            src="assets/img/herotrans.png"
            alt="hero"
            className="w-[900px] max-lg:w-[380px] h-full object-contain hidden md:block"
          />
          <img
            src="assets/img/text1.png"
            alt="text-image"
            className=" h-auto mx-auto block md:hidden max-w-screen-md"
          />
          <img
            src="assets/img/text2.png"
            alt="text-image"
            className=" h-auto mx-auto block md:hidden max-w-screen-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
