import React, { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";

interface Messages {
  createdAt?: string | null;
  message: string;
  audioURL: string;
  sender: string | null;
  _id: string;
}

interface User {
  email: string;
  userId: string;
  userName: string;
  profileImage?: {
    url: string;
  };
  language: string;
  welcome: string;
}

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
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

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
