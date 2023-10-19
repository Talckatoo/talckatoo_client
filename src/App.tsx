import { useEffect } from "react";
import Chat from "./pages/Chat";
import Main from "./pages/Main";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar/NavBar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

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
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/sign" element={<Main />} />
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
