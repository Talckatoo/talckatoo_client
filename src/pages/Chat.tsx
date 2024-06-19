import { useState, useContext, useEffect } from "react";
import ChatContainer from "../components/ChatContainer";
import Navbar from "../navbar/NavBar";
import { UserContext } from "../context/user-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import {
  setRecipient,
  setRecipientProfileImage,
  setUsers,
} from "../redux/features/user/userSlice";
import { setOnlineFriends } from "../redux/features/socket/socketSlice";
import {
  useFetchAllFriendsQuery,
  useFetchUserByIdQuery,
} from "../redux/services/UserApi";
import { setCall } from "../redux/features/call/callSlice";
import SideBar from "../components/shared/SideBar";
import { skipToken } from "@reduxjs/toolkit/query";
import { setAuth } from "../redux/features/user/authSlice";
import HandleCall from "../components/VideoCall/services/HandleCall";
import { useLocation } from "react-router-dom";
import axios from "axios";

interface Socket {
  current: any;
}

const Chat = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);

  const { user } = useAppSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const conversationState = useAppSelector((state) => state.conversation);
  const messages = useAppSelector((state) => state.messages.messages);
  const { users } = useAppSelector((state) => state.user);
  const { requests } = useAppSelector((state) => state.user);
  const { recipient } = useAppSelector((state) => state.user);
  let { state } = useLocation();
  state ||= { buttonSelected: "chats" };
  let { buttonSelected } = state;

  // RTK Query
  const {
    data: friends,
    refetch,
    isUninitialized,
  } = useFetchAllFriendsQuery(null) as any;

  const userID = localStorage.getItem("userId");

  // const refetchF = async () => {
  //   await refetch();
  // };
  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on("getAcceptFriendRequest", () => {
  //       refetchF();
  //     });
  //   }
  // }, [socket.current]);

  const { data } = useFetchUserByIdQuery(
    userID !== null ? { id: userID } : skipToken
  ) as any;

  useEffect(() => {
    if (data) {
      dispatch(setAuth(data.user));
    }
  }, [data]);

  useEffect(() => {
    if (friends) {
      dispatch(setUsers(friends.users));
      dispatch(
        setAuth({
          ...user,
          friends: (
            friends?.users?.contactedUsers.concat(
              friends?.users?.uncontactedUsers
            ) as any[]
          )?.map((u: any) => ({
            _id: u._id,
            userName: u.userName,
            language: u.language,
            profileImage: u.profileImage,
          })),
        })
      );
    }
  }, [friends]);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;
  const language = conversationState?.conversation?.language;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const FetchFriends = async () => {
    try {
      const result = (await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/friends`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )) as any;
      if (result) {
        dispatch(setUsers(result.data.users));
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    FetchFriends();
    if (socket.current) {
      socket.current.on("getMessage", (data) => {
        if (data.to === selectedId) {
          dispatch(
            setConversation({
              conversationId: conversationId,
              selectedId: selectedId,
              language: language,
            })
          );
        }
        FetchFriends();
      });
    }
  }, [socket.current, messages]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUpdateProfile", (data: any) => {
        if (selectedId === data.from) {
          dispatch(
            setConversation({
              conversationId: conversationId,
              selectedId: selectedId,
              language: data.language,
            })
          );
          dispatch(setRecipientProfileImage(data.image));
          dispatch(setRecipient(data.userName));
        }
      });
    }
  }, [socket.current, selectedId]);

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

  // useEffect(() => {
  //   refetchFriends();
  // }, [refetchFriends, messages]);

  const handleCall = () => {
    HandleCall(user, selectedId, recipient);
  };

  return (
    <>
      <div className="flex flex-1 h-[100vh] w-full  overflow-hidden flex-grow bg-white">
        <SideBar
          socket={socket}
          refetch={refetch}
          buttonSelected={buttonSelected}
          isLoading={isLoading}
        />

        <div className=" w-full h-full flex flex-col bg-white">
          {selectedId && <Navbar onHandleCall={handleCall} />}
          <ChatContainer socket={socket} />
        </div>
      </div>
    </>
  );
};

export default Chat;
