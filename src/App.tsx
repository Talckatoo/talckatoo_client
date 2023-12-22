import { useEffect } from "react";
import Chat from "./pages/Chat";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/NavBar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import ResetPaaswordUpdate from "./pages/ResetPasswordUpdate";
import ResetPassword from "./pages/ResetPassword";


const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full ">
      {location.pathname !== "/" &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/sign-up" &&  location.pathname !== "/reset-password"
        && location.pathname !== "/reset-password/:token"
        && <Navbar />}
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPaaswordUpdate />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
