import { useState, useEffect, useContext, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailRegex from "../util/constants.ts";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { BASE_URL } from "../util/url.ts";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState({
    error: false,
    errorMessage: "",
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
    errorMessage: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { setUser, isDarkMode } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsFormValid(email.trim() !== "" && password.trim() !== "");
  }, [email, password]);

  useEffect(() => {}, [emailError, passwordError]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const validateEmail = (email: string) => {
    if (email.trim() === "") {
      setEmailError({
        error: true,
        errorMessage: "Email is required",
      });
    } else {
      if (!emailRegex.test(email)) {
        setEmailError({
          error: true,
          errorMessage: "Invalid email format",
        });
      } else {
        setEmailError({
          error: false,
          errorMessage: "",
        });
      }
    }
  };

  const validatePassword = (password: string) => {
    if (password.trim() === "") {
      setPasswordError({
        error: true,
        errorMessage: "Password is required",
      });
    } else if (password.length < 6) {
      setPasswordError({
        error: true,
        errorMessage: "Password must be 6 or more characters long",
      });
    } else {
      setPasswordError({
        error: false,
        errorMessage: "",
      });
    }
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = Object.values({
      emailError,
      passwordError,
    });
    console.log(errors);
    if (isFormValid) {
      if (!errors.some((error) => error.error === true)) {
        try {
          const response = await axios.post(
            `${BASE_URL}/api/v1/account/log-in`,
            {
              email: email,
              password: password,
            }
          );

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
      } else {
        toast.warn("Please enter valid entries");
      }
    }
  };

  const isButtonDisabled = !isFormValid;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div
      className="flex justify-center items-center mt-0 lg:mt-5 drop-shadow-lg"
      style={{ width: "85%" }}
    >
      <form
        className={`flex flex-col justify-center items-center rounded-2xl px-10 py-3 gap-4 ${
          isDarkMode ? "bg-slate-900" : "bg-slate-100"
        }`}
        style={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2
          className={`flex justify-center items-center text-3xl lg:text-4xl text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Sign in
        </h2>
        <div className="flex flex-col justify-center" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Email"
            className={`w-full px-5 py-2 mt-4 border-b-2 outline-none ${
              emailError.error ? "border-red-500" : "border-gray-100"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={email}
            onChange={handleEmailChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {emailError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-1">
              {emailError.errorMessage}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center relative"
          style={{ width: "100%" }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full px-4 py-2 border-b-2 outline-none ${
              passwordError.error ? "border-red-500" : "border-gray-100"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={password}
            onChange={handlePasswordChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          <div
            className="absolute top-3 right-3 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <AiFillEyeInvisible
                style={{ color: isDarkMode ? "white" : "black" }}
              />
            ) : (
              <AiFillEye style={{ color: isDarkMode ? "white" : "black" }} />
            )}
          </div>
          {passwordError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-1">
              {passwordError.errorMessage}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "100%" }}
        >
          <button
            className={`flex justify-center items-center transition duration-150 ease-in-out hover:scale-105 bg-orange-50 text-gray-800 px-8 py-3 text-xl lg:text-2xl w-full mt-4 mb-4 rounded-full shadow-md transition-colors ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "hover:bg-green-500 hover:text-white"
            } ${isDarkMode ? "text-white" : "text-black"}`}
            disabled={isButtonDisabled as boolean}
            style={{ backgroundColor: isDarkMode ? "#333" : "" }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogIn;
