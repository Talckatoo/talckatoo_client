import { useEffect, useRef } from "react";
import Chat from "./pages/Chat";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/NavBar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  updateContactedUserById,
  updateContactedUsers,
} from "./redux/features/user/userSlice";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
  getUpdateProfile: (data: any) => void;
};

const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const socket = useRef<Socket<MyEventMap> | null>();
  const { users } = useAppSelector((state) => state.user);

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET_URL}`);
  }, []);

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getUpdateProfile", (data: any) => {
        console.log("data", data);
        dispatch(updateContactedUserById(data));
      });
    }
  }, [socket.current]);

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  return (
    <div className="flex flex-col h-full w-full ">
      {location.pathname !== "/" &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/sign-up" && <Navbar />}
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat socket={socket} />} />
        <Route path="/profile" element={<Profile socket={socket} />} />
      </Routes>
    </div>
  );
};

export default App;
