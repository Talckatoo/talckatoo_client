import { useState } from 'react';
import Button from "../../UI/Button";

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = async () => {
    console.log('Subscribing with email:', email);
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/account/news-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      // Optionally, you can handle success scenarios here
      console.log('Subscribed successfully');
    } catch (error: any) {
      console.error('Error subscribing:', error.message);
    }
  };

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
            value={email}
            onChange={handleEmailChange}
            name="email" // Add name attribute here
          />

          <Button className="md:w-44 bg-slate-700 text-yellow-50 rounded-r-lg hover:bg-slate-600" onClick={handleSubscribe} type="submit" >Subscribe</Button>
        </div>
      </section>
      <div className="flex justify-center items-center">
        We care about the protection of your data. Read our <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://talckatoo.me/terms"> Privacy Policy</a>
      </div>
    </>
  );
};

export default Newsletter;
