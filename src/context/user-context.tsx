import React, { createContext, useState, ReactNode } from "react";
import useUserRedirect from "./../hooks/useUserRedirect";

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},

  isLoading: false,
  setIsLoading: () => {},
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // use the userRedirect hook
  useUserRedirect();

  return (
    <UserContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,

        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
