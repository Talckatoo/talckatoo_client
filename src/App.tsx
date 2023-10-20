import { useEffect, useState } from "react";
import Chat from "./pages/Chat";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/NavBar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/chat");
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex flex-col h-full w-full ">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-background-500 z-[999] flex justify-center items-center">
          {/* add loading spinner */}
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
      {location.pathname !== "/" &&
        location.pathname !== "/sign-in" &&
        location.pathname !== "/sign-up" && <Navbar />}
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
