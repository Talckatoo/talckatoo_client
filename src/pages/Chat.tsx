import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import { getContactName } from "../util/getContactName";
import { io, Socket } from "socket.io-client";
import COCKATOO from "./.././assests/cockatoo.png";
import FetchLatestMessages from "../util/FetchLatestMessages";
import { PiBirdFill } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { setRecipient } from "../redux/features/user/userSlice";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
};

interface ContactedUser {
  _id: string;
  userName: string;
  profileImage: ProfileImage;
  conversation: Conversation;
  language: string;
}

interface Conversation {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileImage {
  public_id?: string;
  url?: string;
}

interface UncontactedUser {
  _id: string;
  userName: string;
  language: string;
}

interface UsersList {
  contactedUsers: ContactedUser[];
  uncontactedUsers: UncontactedUser[];
}

const Chat = () => {
  const { isDarkMode } = useContext(UserContext);

  const { user } = useAppSelector((state) => state.auth);
  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [view, setView] = useState<"friends" | "people">("friends");
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const conversationState = useAppSelector((state) => state.conversation);
  const messages = useAppSelector((state) => state.messages.messages);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;
  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET_URL}`, {
      transports: ["websocket"],
    });
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
    const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data);
    setUsersList(data.users);
  };
  useEffect(() => {
    fetchUsers();
    if (socket.current) {
      socket.current.on("getMessage", () => {
        fetchUsers();
      });
    }
  }, [socket.current, messages]);

  const handleSelectContact = (u: User) => {
    dispatch(
      setConversation({
        conversationId: u.conversation._id,
        selectedId: u._id,
        language: u.language,
      })
    );
    dispatch(setRecipient(u.userName));
  };

  const handleSelectUnContact = (unContact: User) => {
    dispatch(
      setConversation({
        conversationId: null,
        selectedId: unContact._id,
        language: unContact.language,
      })
    );

    dispatch(setRecipient(unContact.userName));
  };

  const handleSelectPeople = () => {
    dispatch(
      setConversation({
        conversationId: null,
        selectedId: null,
        language: null,
      })
    );
    setView("people");
  };

  return (
    <>
      <div
        className={`flex flex-1 h-[100vh] w-full overflow-hidden flex-grow ${
          isDarkMode ? "bg-dark" : "bg-light"
        }`}
      >
        <div
          className={`md:w-80  max-h-screen p-2 ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <button
              className={`p-2 rounded-lg ${
                view === "friends"
                  ? "bg-slate-500 hover:bg-slate-400 text-white"
                  : "bg-slate-300 hover:bg-slate-400 text-black"
              } font-bold`}
              onClick={() => {
                if (view !== "friends") {
                  dispatch(
                    setConversation({
                      language: null,
                    })
                  );

                  setView("friends");
                }
              }}
            >
              Friends
            </button>
            <button
              className={`p-2 rounded-lg ${
                view === "people"
                  ? "bg-slate-500 hover:bg-slate-400 text-white"
                  : "bg-slate-300 hover:bg-slate-400 text-black"
              } font-bold`}
              onClick={handleSelectPeople}
            >
              People
            </button>
          </div>
          {view === "friends" && (
            <div className="overflow-y-auto h-full">
              {usersList
                ? usersList.contactedUsers.map((u) => {
                    console.log(u);
                    return (
                      <div
                        key={u._id}
                        className={
                          "flex rounded-lg m-2 p-1 cursor-pointer last:mb-[5rem] " +
                          (conversationId === u.conversation._id && isDarkMode
                            ? "bg-slate-500 text-white hover:bg-slate-600"
                            : conversationId === u.conversation._id &&
                              !isDarkMode
                            ? "bg-slate-500 text-white hover:bg-slate-400"
                            : isDarkMode
                            ? "bg-[#161c24] text-white hover:bg-slate-600"
                            : "bg-slate-300 text-black hover:bg-slate-400")
                        }
                        onClick={() => handleSelectContact(u)}
                      >
                        <div className="flex flex-row w-full">
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
                          <div className="flex w-3/4 mb-1">
                            <div className="flex flex-col w-full gap-y-0">
                              <div className={`mb-1 font-bold w-full flex`}>
                                <div className="w-11/12">{u.userName}</div>
                                {u.conversation.unread.includes(user?._id) &&
                                  u._id !== selectedId && (
                                    <div className="flex justify-center items-center w-1/12 text-orange-400 animate__animated animate__heartBeat">
                                      <PiBirdFill></PiBirdFill>
                                    </div>
                                  )}
                              </div>
                              <div className={`w-full`}>
                                <FetchLatestMessages u={u?.latestMessage} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          )}

          {view === "people" && (
            <div className="overflow-y-auto h-full">
              {usersList
                ? usersList.uncontactedUsers.map((unContact) => {
                    if (unContact._id === user?._id) {
                      return null;
                    }
                    return (
                      <div
                        key={unContact._id}
                        className={
                          "flex rounded-lg m-2 p-1 cursor-pointer last:mb-[5rem] " +
                          (selectedId === unContact._id && isDarkMode
                            ? "bg-slate-500 text-white hover:bg-slate-600"
                            : selectedId === unContact._id && !isDarkMode
                            ? "bg-slate-500 text-white hover:bg-slate-400"
                            : isDarkMode
                            ? "bg-[#161c24] text-white hover:bg-slate-600"
                            : "bg-slate-300 text-black hover:bg-slate-400")
                        }
                        onClick={() => handleSelectUnContact(unContact)}
                      >
                        <div className="flex flex-row w-full">
                          <div className="flex h-full w-1/4 items-center justify-center mx-2">
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
                              {getContactName(
                                unContact.userName,
                                onlineFriends
                              )}
                            </div>
                          </div>
                          <div className="flex w-3/4 items-center justify-start mb-1">
                            <div className="flex font-bold w-full">
                              {unContact.userName}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          )}
        </div>
        <div className="flex w-full h-full">
          <ChatContainer socket={socket} />
        </div>
      </div>
    </>
  );
};

export default Chat;
