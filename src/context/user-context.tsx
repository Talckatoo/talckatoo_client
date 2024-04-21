import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from 'i18next'; // Import i18n from i18next

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notification: Notification | null; // Add the 'notification' property
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>; // Add the 'setNotification' property
  userEmail: string; 
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: any;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  toggleDarkMode: () => {},
  isLoading: false,
  setIsLoading: () => {},
  notification: null,
  setNotification: () => {},
  userEmail: "", // Initialize userEmail state
  setUserEmail: () => {}, // Initialize setUserEmail function
  selectedLanguage: 'en',
  setSelectedLanguage: () => {},
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
    console.log('toggle dark mode');
  };

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Initialize i18n
  useTranslation(); // Call useTranslation hook to initialize i18n

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng); // Update selected language in state
  };

  useEffect(() => {
    // Check if the selected language is Arabic
    if (selectedLanguage === 'ar') {
      // Set the direction of the whole app to RTL
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      // Set the direction of the whole app to LTR
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [selectedLanguage]); // Run this effect whenever the selected language changes


  return (
    <I18nextProvider i18n={i18n}> {/* Wrap the children with I18nextProvider */}
    <UserContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        isLoading,
        setIsLoading,
        notification,
        setNotification,
        userEmail, 
        setUserEmail,
        selectedLanguage,
        setSelectedLanguage: changeLanguage, // Update setSelectedLanguage to call changeLanguage function
      }}
    >
      {children}
    </UserContext.Provider>
    </I18nextProvider>
  );
};
