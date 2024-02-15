import Button from "../../UI/Button";

const Newsletter = () => {
  return (
    <>
      <section className="md:mx-10 md:mt-[5rem] bg-[#fafafa] p-16 max-sm:p-6 z-[1] font-inter relative border rounded-xl cursor-pointer">
        <h2 className="text-[30px] font-bold text-center mb-8">TALCKATOO</h2>
        <h2 className="text-3xl font-bold text-center">Subscribe to our newsletter</h2>
        <p className="text-center text-gray-500 mb-8">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
        <div className="flex flex-row  justify-center items-start">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-96 border border-gray-700 rounded-l-lg"
          />
          <Button className="md:w-44 bg-slate-700 text-yellow-50 rounded-r-lg hover:bg-slate-600 " type={undefined}>Subscribe</Button>
        </div>
      </section>
      <div className="flex justify-center items-center">
        We care about the protection of your data. Read our <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://talckatoo.me/terms"> Privacy Policy</a>
      </div>
    </>
  );
};

export default Newsletter;
