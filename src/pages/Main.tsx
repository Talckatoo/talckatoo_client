import { useState, useContext } from "react";
import LogIn from "../entryPoint/Login.tsx";
import Register from "../entryPoint/Register.tsx";
import ImageWrapper from "../UI/ImageWrapper.tsx";
import { UserContext } from "../context/user-context";

const Main = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const { isDarkMode } = useContext(UserContext);

  const handleRegisterClick = () => {
    setShowLogin(!showLogin);
    setShowRegister(!showRegister);
  };

  return (
    <div
      className={`flex h-full justify-start flex-wrap align-top ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      <div className="pt-24" style={{ width: "620px", height: "685px" }}>
        <ImageWrapper />
      </div>

      <div
        className="justify-center align-middle mt-24 bg-white rounded-xl"
        style={{
          width: "600px",
          height: "680px",
          backgroundColor: `${isDarkMode ? "#111827" : "#F1F5F9"}`,
        }}
      >
        <div
          className={`flex justify-center ${isDarkMode ? "bg-gray-900" : ""}`}
        >
          {showLogin && <LogIn />}
          {showRegister && <Register />}
        </div>
        <div className="flex justify-center m-4 ">
          <p className={`text ${isDarkMode ? "text-white" : "text-black"}`}>
            {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-blue-500 font-bold cursor-pointer hover:text-blue-700"
              onClick={handleRegisterClick}
            >
              {showLogin ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
