import React, { createContext, useState, ReactNode, useEffect } from "react";

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

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);


  return (
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
