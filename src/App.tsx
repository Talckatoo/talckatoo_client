import { useEffect, useRef } from "react";
import Chat from "./pages/Chat";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import Term from "./pages/Term";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
// import VideoCall from "./pages/VideoCall";
import VideoRoomCall from "./pages/VideoRoomCall";
import { SignUp } from "./pages/SignUp";
import Privacy from "./pages/Privacy";
import ResetPasswordUpdate from "./pages/ResetPasswordUpdate";
import ResetPassword from "./pages/ResetPassword";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  setRequests,
  setUsers,
  updateContactedUserById,
} from "./redux/features/user/userSlice";
import Random from "./pages/Random";
import useUserRedirect from "./hooks/useUserRedirect";
import SignUpVerification from "./pages/SignUpVerification";
import server_endpoint from "./util/endpoint";
import ProtectedRoute from "./route/ProtectedRoute";


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
  useUserRedirect();
  const dispatch = useAppDispatch();
  const socket = useRef<Socket<MyEventMap> | null>();
  const { requests } = useAppSelector((state) => state.user);
  const { users } = useAppSelector((state) => state.user);

  useEffect(() => {
    console.log('Environment Variables:', {
      VITE_BASE_URL: import.meta.env.VITE_BASE_URL,
    });
  }, []);

  useEffect(() => {
    socket.current = io(
      `${import.meta.env.VITE_SOCKET_URL}` ||
      server_endpoint
    );

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
  }, [socket.current]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getFriendRequest", (data: any) => {
        dispatch(setRequests([...requests, data.friendRequest]));
      });

      socket.current.on("getAcceptFriendRequest", (data: any) => {
        dispatch(
          setUsers({
            ...users,
            uncontactedUsers: [
              ...users?.uncontactedUsers,
              {
                _id: data?.Userto?._id,
                userName: data?.Userto?.userName,
                profileImage: data?.Userto?.profileImage,
                language: data?.Userto?.language,
                conversation: {
                  _id: data?.Userto?.conversationId,
                },
              },
            ],
          })
        );
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
          element={<ResetPasswordUpdate />}
        />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up/verification" element={<SignUpVerification />} />
        <Route path="/terms" element={<Term />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat socket={socket} />} />
        <Route path="/profile" element={<Profile socket={socket} />} />
        <Route path="/random" element={<Random socket={socket} />} />
        <Route
          path="/call/:roomId/:decodedCallData"
          element={<VideoRoomCall socket={socket} />}
        />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
