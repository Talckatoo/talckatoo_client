import React, { createContext, useState, ReactNode } from "react";

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<Notification | null>(null);

  return (
    <UserContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,

        isLoading,
        setIsLoading,

        notification,
        setNotification,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
