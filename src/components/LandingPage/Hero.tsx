import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container mt-[5rem] p-1">
      <div className="flex flex-col items-center justify-center ">
        <h1 className="head-text text-center max-w-[983px] max-lg:max-w-[700px] z-[1]">
          Talckatoo: Bridging Conversations Across Languages
        </h1>
        <p className="sub-title-text text-center mt-4 max-w-[768px] max-lg:max-w-[700px] z-[1]">
          Seamlessly chat with individuals across language barriers. No more
          copy-pasting. Just real-time, in-chat translations.
        </p>
        <Button
          type="button"
          className="bg-primary-500 text-white mt-8 z-[1]"
          onClick={() => {
            navigate("/sign-up");
          }}
        >
          Try Talckatoo Now
        </Button>
        <div className="mt-[4rem] z-[1]">
          <img
            src="/assets/img/hero.svg"
            alt="hero"
            className="w-[1000px] max-lg:w-[700px] h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
