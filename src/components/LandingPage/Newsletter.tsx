import { useState, useContext } from 'react';
import { UserContext } from './../../context/user-context';
import Notify from '../../UI/Notify';

const Newsletter = () => {
  const { notification, setNotification } = useContext(UserContext);
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    if (email === '') {
      setNotification({ type: 'warning', message: 'Email is required' });
      return false;
    } else if (!re.test(email)) {
      setNotification({ type: 'warning', message: 'Please enter a valid email' });
      return false;
    }
    return true; // Return true if email is valid
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/account/news-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setNotification({ type: 'error', message: 'Your email is already Subscribed' });
      } else {
        setNotification({ type: 'success', message: 'Subscribed successfully' });
      }

    } catch (error) {
      setNotification({ type: 'error', message: error.message });
    }
  };

  const dismissNotification = () => {
    setNotification(null); // Clear notification
  };

  return (
    <>
      <section className="md:mx-10 md:mt-[5rem]  p-16 max-sm:p-6 z-[1] font-inter relative border rounded-xl cursor-pointer">
        <h2 className="text-[28px] font-bold text-center mb-5">TALCKATOO</h2>
        <h2 className="text-[20px] font-bold text-center">Subscribe to our newsletter</h2>
        <p className="text-center text-[15px] text-gray-500 mb-4">Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.</p>
        <div className="flex flex-row justify-center items-start">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full md:w-96 border border-gray-700 rounded-l-lg  rounded-r-none"
            value={email}
            onChange={handleEmailChange}
            name="email"
          />

          <button className="md:w-44 h-[46px] bg-black text-white rounded-r-lg p-2 hover:text-orange-500" onClick={handleSubscribe} type="submit" >Subscribe</button>
        </div>
      </section>
      <div className="flex justify-center items-center">
        We care about the protection of your data. Read our <a className="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://talckatoo.me/terms"> Privacy Policy</a>
      </div>
      {notification && <Notify type={notification.type} message={notification.message} dismissNotification={dismissNotification} />} 
    </>
  );
};

export default Newsletter;
