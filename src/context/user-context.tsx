import React, { createContext, useState, ReactNode } from "react";
import useUserRedirect from "./../hooks/useUserRedirect";

interface UserContextProviderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userEmail: string; 
  setUserEmail: React.Dispatch<React.SetStateAction<string>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  setIsDarkMode: () => {},
  isLoading: false,
  setIsLoading: () => {},
  userEmail: "", // Initialize userEmail state
  setUserEmail: () => {}, // Initialize setUserEmail function
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  return (
    <UserContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        isLoading,
        setIsLoading,
        userEmail, 
        setUserEmail, 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
