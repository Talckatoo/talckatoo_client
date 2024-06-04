import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useTranslation, I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  notification: Notification | null;
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>;
  userEmail: string;
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
  selectedLanguage: any;
  setSelectedLanguage: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => { },
  toggleDarkMode: () => { },
  isLoading: false,
  setIsLoading: () => { },
  notification: null,
  setNotification: () => { },
  userEmail: "",
  setUserEmail: () => { },
  selectedLanguage: 'en',
  setSelectedLanguage: () => { },
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Initialize i18n
  useTranslation();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    localStorage.setItem('selectedLanguage', lng);
  };

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    if (selectedLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    setPreferencesLoaded(true); // Preferences are loaded, now render the children
  }, [selectedLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
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
          setSelectedLanguage: changeLanguage,
        }}
      >
        {preferencesLoaded ? children : null} {/* Render children only when preferences are loaded */}
      </UserContext.Provider>
    </I18nextProvider>
  );
};
