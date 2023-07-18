import React, { createContext, useState, ReactNode, useEffect, } from "react";
import axios from "axios"
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import DOMAIN from "../util/url";

interface Messages {
    createdAt?: string | null,
    message: string, 
    audioURL: string,
    sender: string | null, 
    _id: string, 

}

interface User {
    email: string,
    userId: string,
    userName: string, 
    profileImage?: {
        url: string
    }, 
    language: string,
    welcome: string,
}


interface UserContextProviderProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    recipient: string | null, 
    setRecipient: React.Dispatch<React.SetStateAction<string | null>>;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    conversationId: string | null,
    setConversationId: React.Dispatch<React.SetStateAction<string | null>>
    selectId: string | null, 
    setSelectId: React.Dispatch<React.SetStateAction<string | null>>
    messages: Messages[] | null; 
    setMessages: React.Dispatch<React.SetStateAction<Messages[] | null>>;
    isLoading: boolean, 
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    language: string | null , 
    setLanguage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext= createContext<UserContextProviderProps> ({
    user: null,
    setUser: () => {},
    recipient: null, 
    setRecipient: () => {},
    isDarkMode: false,
    setIsDarkMode: () => {},
    conversationId: null,
    setConversationId: () => {},
    selectId: null, 
    setSelectId: () => {},
    messages: null, 
    setMessages: () => {},
    isLoading: false, 
    setIsLoading: () => {},
    language: null , 
    setLanguage: () => {},
})


export const UserContextProvider:React.FC<{children: ReactNode}> = ({children}) => {


    let loggedInUser: User| null
    let loggedInUserId: string | undefined


    const userWithToken = JSON.parse(localStorage.getItem('token') || 'null')
    if (userWithToken) {
        loggedInUser = jwt_decode(userWithToken)
        loggedInUserId = loggedInUser?.userId
    } else {
        loggedInUser  = null
    }


    const [user, setUser] = useState<User | null>(null)
    const [recipient, setRecipient] = useState<string | null>(null)
    const [language, setLanguage] = useState<string | null>(null)
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [conversationId, setConversationId] = useState<string|null>(null)
    const [selectId, setSelectId] = useState<string|null>(null)
    const [messages, setMessages] = useState<Messages[] | null>([])
    const [isLoading, setIsLoading] = useState(false)



      useEffect(() => {
        const fetchUser = async () => {
            try {
                if (loggedInUserId) {
                    const { data } = await axios.get(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/users/${loggedInUserId}`, {
                        headers: {
                          Authorization: `Bearer ${userWithToken}`,
                        },
                      });
                      setUser(data.user)
                }
            } catch (error) {
                toast.error("Error getting user information");
            }
          };
          
        fetchUser()
      }, [])

    return (
        <UserContext.Provider 
        value={{user, setUser, 
            conversationId, setConversationId, 
            selectId, setSelectId, 
            isDarkMode, setIsDarkMode,
            recipient, setRecipient,
            messages, setMessages,
            isLoading, setIsLoading,
            language, setLanguage,

        }}
            >
            {children}
        </UserContext.Provider>
    )
}
