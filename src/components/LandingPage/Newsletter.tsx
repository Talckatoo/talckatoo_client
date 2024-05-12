import { useState, useContext, SetStateAction } from 'react';
import { UserContext } from './../../context/user-context';
import Notify from '../../UI/Notify';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const { notification, setNotification } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const { isDarkMode } = useContext(UserContext);

  const handleEmailChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    if (email === '') {
      setNotification({ type: 'warning', message: t('Email is required') });
      return false;
    } else if (!re.test(email)) {
      setNotification({ type: 'warning', message: t('Please enter a valid email') });
      return false;
    }
    return true; // Return true if email is valid
  };

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      return;
    }
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
        setNotification({ type: 'error', message: t('Your email is already subscribed') });
      } else {
        setNotification({ type: 'success', message: t('Subscribed successfully') });
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
      <section
        className={`md:mx-10 md:mt-[5rem] shadow-blur p-14 max-sm:p-6 z-[1] font-inter relative  backdrop-filter backdrop-blur-[20px]  rounded-xl cursor-pointer ${isDarkMode ? "backdrop:bg-background-500" : " backdrop:bg-white "
          }`}
      >
        <h2 className="text-[28px] font-bold text-center mb-5">{t('TALCKATOO')}</h2>
        <h2 className="text-[20px] font-bold text-center">
          {t('Subscribe to our newsletter')}
        </h2>
        <p
          className={`text-center text-[15px]  mb-4 ${isDarkMode ? "text-[#E6F7E6] news" : "text-gray-500"
            }`}
        >
          {t('Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.')}
        </p>
        <div className="flex flex-row justify-center items-start">
          <input
            type="email"
            placeholder={t('Enter your email')}
            className="w-full md:w-96 border border-gray-700 ltr:rounded-l-lg rtl:rounded-r-lg   rtl:rounded-l-none ltr:rounded-r-none"
            value={email}
            onChange={handleEmailChange}
            name="email"
          />

          <button
            className="md:w-44 p-2 h-[46px] rtl:rounded-l-lg bg-black text-white ltr:rounded-r-lg"
            onClick={handleSubscribe}
            type="submit"
          >
            {t('Subscribe')}
          </button>
        </div>
      </section>
      <div
        className={`flex justify-center items-center  mt-4 ${isDarkMode ? "news" : ""
          }`}
      >
        {t('We care about the protection of your data. Read our')}  &nbsp;
        <a
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          href="https://talckatoo.me/terms"
        >
          {t('Privacy Policy')}
        </a>
      </div>
      {notification && <Notify type={notification.type} message={notification.message} dismissNotification={dismissNotification} />}
    </>
  );
};

export default Newsletter;
