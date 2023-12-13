import Button from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import hero from "../../../public/assets/img/herotrans.png"

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="container p-1">
      <div className="flex  items-center justify-center px-[5rem]">
        <div className="i">
          <div>
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
          </div>
          <div>
            
          </div>   
        </div>
        
        
        <div className="mt-[4rem] z-[1]">
          <img
            src={hero}
            alt="hero"
            className="w-[1000px] max-lg:w-[700px] h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
