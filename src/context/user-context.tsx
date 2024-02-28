import React, { createContext, useState, ReactNode } from "react";

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string; 
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  notification: Notification | null; // Add the 'notification' property
  setNotification: React.Dispatch<React.SetStateAction<Notification | null>>; // Add the 'setNotification' property
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},
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

  return (
    <UserContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
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
