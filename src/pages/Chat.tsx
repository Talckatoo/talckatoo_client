import { useState, useContext, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import { getContactName } from "../util/getContactName";
import COCKATOO from "./.././assests/cockatoo.png";
import FetchLatestMessages from "../util/FetchLatestMessages";
import { PiBirdFill } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { User, setRecipient, setUsers } from "../redux/features/user/userSlice";
import { setOnlineFriends } from "../redux/features/socket/socketSlice";
import { useFetchAllFriendsQuery } from "../redux/services/UserApi";
import { setCall } from "../redux/features/call/callSlice";
import SideBar from "../components/shared/SideBar"

interface Socket {
  current: any;
}

const Chat = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);

  const { user } = useAppSelector((state) => state.auth);
  const { onlineFriends } = useAppSelector((state) => state.socket);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [view, setView] = useState<"friends" | "people">("friends");
  const dispatch = useAppDispatch();
  const conversationState = useAppSelector((state) => state.conversation);
  const messages = useAppSelector((state) => state.messages.messages);
  const { users } = useAppSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // RTK Query
  const { data: friends, refetch } = useFetchAllFriendsQuery(null) as any;

  // useEffect(() => {
  //   dispatch(setCall(null));
  // }, []);

  useEffect(() => {
    if (friends) {
      dispatch(setUsers(friends.users));
    }
  }, [friends]);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  useEffect(() => {
    refetch();
    if (socket.current) {
      socket.current.on("getMessage", () => {
        refetch();
      });
    }
  }, [socket.current, messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUpdateProfile", (data: any) => {
        if (selectedUser?._id === data.from) {
          dispatch(
            setConversation({
              conversationId: conversationId,
              selectedId: selectedId,
              language: data.language,
            })
          );
          dispatch(setRecipient(data.userName));
        }
      });
    }
  }, [socket.current, selectedUser]);

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
    if (users?.contactedUsers && users?.uncontactedUsers && onlineUsers) {
      const onlContact = users.contactedUsers.filter((u: { _id: string }) =>
        onlineUsers.includes(u._id)
      );
      const onlUnContact = users.uncontactedUsers.filter((u: { _id: string }) =>
        onlineUsers.includes(u._id)
      );
      dispatch(setOnlineFriends([...onlContact, ...onlUnContact]));
    }
  }, [onlineUsers, users?.contactedUsers, users?.uncontactedUsers]);

  const handleSelectContact = (u: any) => {
    setSelectedUser(u);
    dispatch(
      setConversation({
        conversationId: u.conversation._id,
        selectedId: u._id,
        language: u.language,
      })
    );

    dispatch(setRecipient(u.userName as any));
  };

  useEffect(() => {
    dispatch(
      setConversation({
        conversationId: selectedUser?.conversation?._id,
        selectedId: selectedUser?._id,
        language: selectedUser?.language,
      })
    );

    dispatch(setRecipient(selectedUser?.userName as any));
  }, [selectedUser]);

  return (
    <>
      <div
        className={`flex flex-1 h-[100vh] w-full overflow-hidden flex-grow ${
          isDarkMode ? "bg-dark" : "bg-light"
        }`}
      >
        {/*        <div
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
          </div>
          {view === "friends" && (
            <div className="overflow-y-auto h-full">
              {users
                ? users?.contactedUsers?.map((u: any) => {
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
        </div>*/}

        <SideBar/>
        <div className="flex w-full h-full bg-white">
          {/*<ChatContainer socket={socket} />*/}
        </div>
      </div>
    </>
  );
};

export default Chat;
