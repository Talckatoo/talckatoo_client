import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import { getContactName } from "../util/getContactName";
import { io, Socket } from "socket.io-client";
import COCKATOO from "./.././assests/cockatoo.png";
import FetchLatestMessages from "../util/FetchLatestMessages"
import DOMAIN from "../util/url";
type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
};

interface User {
    _id: string;
    userName: string;
    conversation: string;
    profileImage: {
      url: string
    };
    language: string;
  }

interface UsersList {
  contactedUsers: User[];
  uncontactedUsers: User[];
}

const Chat = () => {
  const {
    user,
    conversationId,
    setConversationId,
    selectId,
    setSelectId,
    isDarkMode,
    setRecipient,
    messages,
    language, setLanguage,
  } = useContext(UserContext);

  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [view , setView] = useState<'friends' | 'people'>('friends');
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  

  useEffect(() => {
    socket.current = io(`${DOMAIN.BACKEND_DEPLOY_URL}`);
  }, []);

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users: unknown[]) => {
        let usersMap = new Set();
        users.map((user: any) => {
          usersMap.add(user[0]);
          let usersArray: any[] = Array.from(usersMap);
          setOnlineUsers(usersArray);
        });
      });
    }
  }, [socket.current, user]);

  useEffect(() => {
    if (
      usersList?.contactedUsers &&
      usersList?.uncontactedUsers &&
      onlineUsers
    ) {
      const onlContact = usersList.contactedUsers.filter((u) =>
        onlineUsers.includes(u._id)
      );
      const onlUnContact = usersList.uncontactedUsers.filter((u) =>
        onlineUsers.includes(u._id)
      );
      setOnlineFriends([...onlContact, ...onlUnContact]);
    }
  }, [onlineUsers, usersList?.contactedUsers, usersList?.uncontactedUsers]);

  const fetchUsers = async () => {
    const { data } = await axios.get(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsersList(data.users)
  };

  useEffect(() => {
    fetchUsers();
    if (socket.current) {
      socket.current.on('getMessage', () => {
        fetchUsers();
      });
    }
  }, [socket.current, messages]);

  const handleSelectContact = (u: User) => {
    setConversationId(u.conversation._id);
    setSelectId(u._id);
    setLanguage(u?.language)
  };

  const handleSelectUnContact = (unContact: User) => {
    setConversationId(null);
    setSelectId(unContact._id);
    setRecipient(unContact.userName);
    setLanguage(unContact.language)
  };

  const handleSelectPeople = () => {
    setConversationId(null)
    setSelectId(null);
    setView("people")
  }


  return (
    <>
      <div className={`flex h-[100vh] overflow-hidden flex-grow ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`md:w-72  max-h-screen p-2 ${isDarkMode ? "bg-gray-800" : "bg-slate-200"}`}
        >
          <div className="flex items-center justify-center gap-2">
            <button
              className={`p-2 rounded-lg ${
                view === "friends" ? "bg-slate-500 hover:bg-slate-400" : "bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={() => setView("friends")}
            >
              Friends
            </button>
            <button
              className={`p-2 rounded-lg ${
                view === "people" ? "bg-slate-500 hover:bg-slate-400" : "bg-slate-300 hover:bg-slate-400"
              }`}
              onClick={handleSelectPeople}
            >
              People
            </button>
          </div>
          {
            view === 'friends' && (
          
          <div className="overflow-y-auto h-full ">
            {usersList
              ? usersList.contactedUsers.map((u) => {
                  return (
                    <div
                      key={u._id}
                      className={
                        "flex rounded-lg m-2 p-1 cursor-pointer " +
                        ((conversationId === u.conversation._id && isDarkMode)
                          ? "bg-slate-500 text-white hover:bg-slate-600"
                          : (conversationId === u.conversation._id && !isDarkMode)
                          ? "bg-slate-500 text-black hover:bg-slate-400"
                          : isDarkMode
                          ? "bg-[#161c24] text-white hover:bg-slate-600"
                          : "bg-slate-300 text-black hover:bg-slate-400")
                      }
                      onClick={() => handleSelectContact(u)}
                    >

                    

  <div className="flex flex-row">
                        <div className="w-1/4 flex items-center justify-center mx-2">
                          <div className="relative">
                            <div
                              className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center"
                              style={{
                                backgroundImage: `url(${
                                  u.profileImage?.url || COCKATOO
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!u.profileImage && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6 text-gray-300"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                            </div>
                            {getContactName(u.userName, onlineFriends)}
                          </div>
                        </div>
                        <div className="flex w-3/4 pl-2 ml-2 mb-1">
                        <div className="flex flex-col">
                          <div className="h-1/2 mb-1">
                            {u.userName}
                            </div>
                            <div className="h-1/2">
                            <FetchLatestMessages u={u}/>
                          </div> 
                      </div>

                         
                        </div>
                      </div>
           
          
                    </div>
                  );
                })
              : null}
          </div>
            )
          }
  
          {
            view === 'people' && (
          <div className="overflow-y-auto h-full ">
            {usersList
              ? usersList.uncontactedUsers.map((unContact) => {
                  if (unContact._id === user?._id) {
                    return null;
                  }
                  return (
                    <div
                      key={unContact._id}
                      className={
                        "flex rounded-lg m-2 p-1 cursor-pointer " +
                        ((selectId === unContact._id && isDarkMode)
                          ? "bg-slate-500 text-white hover:bg-slate-600"
                          : (selectId === unContact._id && !isDarkMode)
                          ? "bg-slate-500 text-black hover:bg-slate-400"
                          : isDarkMode
                          ? "bg-[#161c24] text-white hover:bg-slate-600"
                          : "bg-slate-300 text-black hover:bg-slate-400")
                      }
                      onClick={() => handleSelectUnContact(unContact)}
                    >
                      <div className="flex flex-row gap-4">
                        <div className="h-full w-1/3 items-center justify-between">
                          <div className="relative">
                            <div
                              className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center"
                              style={{
                                backgroundImage: `url(${
                                  unContact.profileImage?.url || COCKATOO
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!unContact.profileImage && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6 text-gray-300"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                            </div>
                            {getContactName(unContact.userName, onlineFriends)}
                          </div>
                        </div>
                        <div className="flex w-2/3 items-center justify-center">
                          <div className="text-center">
                            {unContact.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
            )
          }
        </div>

        <ChatContainer socket={socket} />
      </div>
    </>
  );
};

export default Chat;
