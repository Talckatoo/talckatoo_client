import { useState, useEffect, useContext, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailRegex from "../util/constants.ts";
import jwt_decode from "jwt-decode";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import DOMAIN from "../util/url.ts";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const { setUser, isDarkMode } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
    } else {
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
      }
    }
  };

  const validatePassword = () => {
    if (password.trim() === "") {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password is too short");
    }
  };

  const validateForm = () => {
    validateEmail();
    validatePassword();
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    validateForm();

    if (isFormValid) {
      try {
        const response = await axios.post(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/account/log-in`, {
          email: email,
          password: password,
        });

        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", JSON.stringify(token));
          setUser(response.data.user);

          toast.success("User signed in");

          navigate("/chat");
        }
      } catch (error) {
        toast.error("Email or password is incorrect");
      }
    }
  };

  const isButtonDisabled = !!emailError || !!passwordError || !isFormValid;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div
      className={`flex justify-center items-center h-full ${
        isDarkMode ? "bg-gray-900" : ""
      }`}
    >
      <div className="flex justify-center items-center">
        <form
          className={`flex flex-col items-center rounded-2xl p-10 ${
            isDarkMode ? "bg-slate-900" : "bg-slate-100"
          }`}
          onSubmit={handleSubmit}
        >
          <h2
            className={`mb-8 text-5xl ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            style={{
              marginRight: "180px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Sign in
          </h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Email"
              className={`w-96 px-5 py-2 mt-4 mb-4 border-b-2 outline-none ${
                emailError ? "border-red-500" : "border-gray-100"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={email}
              onChange={handleEmailChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            {emailError && (
              <div className="text-red-500 text-sm mt-1">{emailError}</div>
            )}
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-96 px-4 py-2 border-b-2 outline-none ${
                passwordError ? "border-red-500" : "border-gray-300"
              } ${isDarkMode ? "bg-gray-800" : ""}`}
              value={password}
              onChange={handlePasswordChange}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>

          <button
            className={`bg-orange-50 text-gray-800 px-8 py-3 text-2xl w-96 mt-4 mb-4 rounded-full shadow-md transition-colors ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "hover:bg-green-500 hover:text-white"
            } ${isDarkMode ? "text-white" : "text-black"}`}
            disabled={isButtonDisabled as boolean}
            style={{ backgroundColor: isDarkMode ? "#333" : "" }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;