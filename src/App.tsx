import { useEffect, useRef } from "react";
import Chat from "./pages/Chat";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
// import VideoCall from "./pages/VideoCall";
import VideoRoomCall from "./pages/VideoRoomCall";
import { SignUp } from "./pages/SignUp";
import Terms from "./pages/Terms";
import ResetPaaswordUpdate from "./pages/ResetPasswordUpdate";
import ResetPassword from "./pages/ResetPassword";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  setRequests,
  setUsers,
  updateContactedUserById,
} from "./redux/features/user/userSlice";
import { useFetchAllRequestsQuery } from "./redux/services/UserApi";
import Random from "./pages/Random";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
  getUpdateProfile: (data: any) => void;
  getFriendRequest: (data: any) => void;
  getAcceptFriendRequest: (data: any) => void;
};

const App = () => {
  const dispatch = useAppDispatch();
  const socket = useRef<Socket<MyEventMap> | null>();
  const { requests } = useAppSelector((state) => state.user);
  const { users } = useAppSelector((state) => state.user);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET_URL}`);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUpdateProfile", (data: any) => {
        dispatch(updateContactedUserById(data));
      });
    }

    if (socket.current) {
      socket.current.on("getFriendRequest", () => {
        refetchFriendsRequest();
      });
      socket.current.on("getAcceptFriendRequest", () => {
        console.log("get Accept Friend Request");
        // refetch();
      });
    }
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getFriendRequest", (data: any) => {
        console.log(data);
        dispatch(setRequests([...requests, data.friendRequest]));
      });

      socket.current.on("getAcceptFriendRequest", (data: any) => {
        dispatch(
          setUsers({
            ...users,
            uncontactedUsers: [
              ...users?.uncontactedUsers,
              {
                _id: data?.Userfrom?._id,
                userName: data?.Userfrom?.userName,
                profileImage: data?.Userfrom?.profileImage,
                language: data?.Userfrom?.language,
              },
            ],
          })
        );
      });
      socket.current.on("getAcceptFriendRequest", () => {
        console.log("get Accept Friend Request");
        // refetch();
      });
    }
  }, [socket.current]);

  return (
    <div className="w-full h-full">
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPaaswordUpdate />}
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat socket={socket} />} />
        <Route path="/profile" element={<Profile socket={socket} />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/random" element={<Random socket={socket} />} />
        <Route
          path="/call/:roomId/:decodedCallData"
          element={<VideoRoomCall socket={socket} />}
        />
      </Routes>
    </div>
  );
};

export default App;
