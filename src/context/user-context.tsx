// import React, { createContext, useState, ReactNode } from "react";
// // import useUserRedirect from "./../hooks/useUserRedirect";

// interface UserContextProviderProps {
//   isDarkMode: boolean;
//   toggleDarkMode: () => void;

//   isLoading: boolean;
//   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export const UserContext = createContext<UserContextProviderProps>({
//   isDarkMode: false,
//   toggleDarkMode: () => {},

//   isLoading: false,
//   setIsLoading: () => {},
// });

// export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const toggleDarkMode = () => {
//     setIsDarkMode( prevMode => !prevMode);
//   };



//   // use the userRedirect hook
//   // useUserRedirect();

//   return (
//     <UserContext.Provider
//       value={{
//         isDarkMode,
//         toggleDarkMode,

//         isLoading,
//         setIsLoading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";

interface UserContextProviderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextProviderProps>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // Uncomment the hook if you intend to use it
  // useUserRedirect();

  return (
    <UserContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
