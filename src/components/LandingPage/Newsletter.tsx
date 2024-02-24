import { useContext, useState } from "react";
import { UserContext } from "../../context/user-context";

import Button from "../../UI/Button";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const { isDarkMode } = useContext(UserContext);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async () => {
    console.log("Subscribing with email:", email);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/account/news-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to subscribe");
      }

      // Optionally, you can handle success scenarios here
      console.log("Subscribed successfully");
    } catch (error: any) {
      console.error("Error subscribing:", error.message);
    }
  };

  return (
    <>
      <section
        className={`md:mx-10 md:mt-[5rem]  p-16 max-sm:p-6 z-[1] font-inter relative border rounded-xl cursor-pointer`}
      >
        <h2 className="text-[28px] font-bold text-center mb-5">TALCKATOO</h2>
        <h2 className="text-[20px] font-bold text-center">
          Subscribe to our newsletter
        </h2>
        <p
          className={`text-center text-[15px]  mb-4 ${
            isDarkMode ? "text-[#E6F7E6]" : "text-gray-500"
          }`}
        >
          Stay up to date with the roadmap progress, announcements and exclusive
          discounts feel free to sign up with your email.
        </p>
        <div className="flex flex-row justify-center items-start">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-fit md:w-96 border border-gray-700 rounded-l-lg  rounded-r-none"
            value={email}
            onChange={handleEmailChange}
            name="email" // Add name attribute here
          />

          <button
            className="md:w-44 h-[46px] bg-black text-white rounded-r-lg hover:text-orange-500"
            onClick={handleSubscribe}
            type="submit"
          >
            Subscribe
          </button>
        </div>
      </section>
      <div className="flex justify-center items-center">
        We care about the protection of your data. Read our{" "}
        <a
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          href="https://talckatoo.me/terms"
        >
          {" "}
          Privacy Policy
        </a>
      </div>
    </>
  );
};

export default Newsletter;
