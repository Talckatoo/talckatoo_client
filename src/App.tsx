import { useEffect, useRef } from "react";
import Chat from "./pages/Chat";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
// import VideoCall from "./pages/VideoCall";
import VideoRoomCall from "./pages/VideoRoomCall";
import { SignUp } from "./pages/SignUp";
import ResetPaaswordUpdate from "./pages/ResetPasswordUpdate";
import ResetPassword from "./pages/ResetPassword";
import { io, Socket } from "socket.io-client";
import { useAppDispatch } from "./redux/hooks";
import { updateContactedUserById } from "./redux/features/user/userSlice";
import {
  useFetchAllFriendsQuery,
  useFetchAllRequestsQuery,
} from "./redux/services/UserApi";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
  getUpdateProfile: (data: any) => void;
};

const App = () => {
  const dispatch = useAppDispatch();
  const socket = useRef<Socket<MyEventMap> | null>();
  const { data: requestsData, refetch: refetchFriendsRequest } =
    useFetchAllRequestsQuery(null) as any;

  // const {
  //   data: friends,
  //   refetch,
  //   isUninitialized,
  // } = useFetchAllFriendsQuery(null) as any;

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
        <Route
          path="/call/:roomId/:decodedCallData"
          element={<VideoRoomCall socket={socket} />}
        />
      </Routes>
    </div>
  );
};

export default App;
