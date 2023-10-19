import Button from "../../UI/Button";

const Contact = () => {
  return (
    <section className="w-full mt-[6rem] bg-[#0E131D]   p-16 max-sm:p-6 z-[1] font-inter relative">
      <img
        src="/assets/img/shape3.svg"
        alt="shape"
        className="absolute top-0 right-0"
      />
      <h2 className="text-head text-white text-[40px] font-bold mb-[1rem]">
        Contact Us
      </h2>
      <h2 className="text-head font-normal text-white text-[18px] max-w-[820px] mb-[2rem]">
        We're always eager to hear from you. If you have questions, feedback, or
        just want to say hello, use the form below:
      </h2>
      <div className="flex flex-col z-[1]">
        <div className="flex items-start max-sm:flex-col gap-8 justify-between z-[1]">
          <input
            type="text"
            placeholder="Enter Your name"
            className="w-full h-[50px] bg-[#171740] border-[#8d8dffa1] border-2  p-4 text-white z-[1]"
          />
          <input
            type="text"
            placeholder="Your best email…"
            className="w-full h-[50px] bg-[#171740] border-[#8d8dffa1] border-2  p-4 text-white z-[1]"
          />
        </div>
        <textarea
          placeholder="Enter your message"
          className="w-full h-[100px] bg-[#171740] border-[#8d8dffa1] border-2  p-4 text-white mt-[2rem] resize-none z-[1]"
        />
        <Button
          type="button"
          className="bg-primary-500 text-white mt-8 z-[1] w-fit ml-auto px-12"
          onClick={() => {}}
        >
          Send
        </Button>
      </div>
    </section>
  );
};

export default Contact;
