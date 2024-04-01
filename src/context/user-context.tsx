import React, { createContext, useState, ReactNode, useEffect } from "react";
import useUserRedirect from "./../hooks/useUserRedirect";
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from 'i18next'; // Import i18n from i18next

// Assuming you have your i18n configuration set up elsewhere
// Make sure to import it properly

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  selectedLanguage: any;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},

  isLoading: false,
  setIsLoading: () => {},

  selectedLanguage: 'en',
  setSelectedLanguage: () => {},
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Initialize i18n
  useTranslation(); // Call useTranslation hook to initialize i18n

  // use the userRedirect hook
  useUserRedirect();

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
          isLoading,
          setIsLoading,
          selectedLanguage,
          setSelectedLanguage: changeLanguage, // Update setSelectedLanguage to call changeLanguage function
        }}
      >
        {children}
      </UserContext.Provider>
    </I18nextProvider>

  );
};
