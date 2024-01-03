import { useEffect, useRef } from "react";
import Chat from "./pages/Chat";
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./navbar/NavBar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import ResetPaaswordUpdate from "./pages/ResetPasswordUpdate";
import ResetPassword from "./pages/ResetPassword";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { updateContactedUserById } from "./redux/features/user/userSlice";
import { setAuth } from "./redux/features/user/authSlice";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
  getUpdateProfile: (data: any) => void;
};

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const socket = useRef<Socket<MyEventMap> | null>();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET_URL}`);
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUpdateProfile", (data: any) => {
        dispatch(updateContactedUserById(data));
      });
    }
  }, [socket.current]);

  return (
    <div className="flex flex-col h-full w-full ">
      {location.pathname !== "/" &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/sign-up" &&
        location.pathname !== "/reset-password" &&
        location.pathname !== "/reset-password/:token" && <Navbar />}
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
      </Routes>
    </div>
  );
};

export default App;
