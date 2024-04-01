import Button from "../../UI/Button";
import { useTranslation } from 'react-i18next';


const Contact = () => {
  const { t } = useTranslation();
  return (
    <section className="md:mx-10 md:mt-[5rem] bg-[#fafafa] p-16 max-sm:p-6 z-[1] font-inter relative border rounded-xl">
      <img
        src="/assets/img/shape3.svg"
        alt="shape"
        className="absolute top-0 right-0"
      />
      <h2 className="text-head text-black text-[40px] font-bold mb-[1rem]">
        {t("Contact Us")}
      </h2>
      <h2 className="text-head font-normal text-black max-md:text-[16px] text-[18px] max-w-[820px] mb-[2rem]">
        {t("We're always eager to hear from you")}
      </h2>
      <div className="form flex flex-col z-[1]">
        <div className="  flex items-start max-sm:flex-col gap-8 justify-between z-[1]">
          <input
            type="text"
            placeholder={t("Enter Your name")}
            className="w-full h-[50px] bg-[#fafafa]  border-2  p-4 text-black z-[1]"
          />
          <input
            type="email email-text"
            placeholder={t("Your email")}
            className=" w-full h-[50px] bg-[#fafafa] border-2  p-4 text-black z-[1]"
          />
        </div>
        <textarea
          placeholder={t("Enter your message")}
          className="w-full h-[100px] bg-[#fafafa]  border-2  p-4 text-black mt-[2rem] resize-none z-[1]"
        />
        <Button
          type="button"
          className="bg-[#fff] text-black mt-8 z-[1] w-fit ml-auto px-12 hover:text-white hover:bg-black border rounded-xl"
          onClick={() => {}}
        >
          {t("Send")}
        </Button>
      </div>
    </section>
  );
};

export default Contact;
