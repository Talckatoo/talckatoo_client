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
      className={`flex flex-1 h-auto flex-col justify-center items-center  ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      <div
        className="flex w-10/12 lg:w-2/3 flex-col justify-center items-center rounded-xl mt-5 mb-5 box-content p-0 lg:p-5"
        style={{
          height: "auto",
          backgroundColor: `${isDarkMode ? "#111827" : "#F1F5F9"}`,
        }}
      >
        <div
          className="flex flex-col lg:flex-row justify-center items-center gap-0"
          style={{ width: "100%", height: "auto" }}
        >
          <div className="w-32 lg:w-1/2 h-auto my-0">
            <ImageWrapper></ImageWrapper>
          </div>
          <div className="flex flex-col justify-content items-center w-full">
            {showLogin && <LogIn />}
            {showRegister && <Register />}
            <div
              className="flex justify-center items-center mt-5 mb-5"
              style={{ height: "auto" }}
            >
              <p
                className={`flex flex-col justify-center items-center text ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {showLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
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
      </div>
    </div>
  );
};

export default Main;
