import { useState, useEffect, useContext, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import emailRegex from "../util/constants.ts";
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import languagesArray from "../util/languages";
import { BASE_URL } from "../util/url.ts";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLanguageError, setSelectedLanguageError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const { setUser, isDarkMode } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      let isValid = true;

      if (userName.trim() === "") {
        setUsernameError("*");
        isValid = false;
      } else {
        setUsernameError("");
      }

      if (email.trim() === "") {
        setEmailError("*");
        isValid = false;
      } else {
        if (!emailRegex.test(email)) {
          setEmailError("Invalid email format");
          isValid = false;
        } else {
          setEmailError("");
        }
      }

      if (password.trim() === "") {
        setPasswordError("*");
        isValid = false;
      } else {
        setPasswordError("");
      }

      if (confirmPassword.trim() === "") {
        setConfirmPasswordError("*");
        isValid = false;
      } else if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
        isValid = false;
      } else {
        setConfirmPasswordError("");
      }

      if (selectedLanguage === "") {
        setSelectedLanguageError("* All fields are required");
        isValid = false;
      } else {
        setSelectedLanguageError("");
      }

      return isValid;
    };

    setIsFormValid(validateForm());
  }, [userName, email, password, confirmPassword, selectedLanguage]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/account/sign-up`,
          {
            userName,
            email,
            password,
            language: selectedLanguage, // Add selected language code to the request data
          }
        );

        const token = response.data.token;
        localStorage.setItem("token", JSON.stringify(token));
        setUser(response.data.user);

        toast.success("User signed up");
        navigate("/chat");
      } catch (error) {
        toast.error("Error signing up");
      }
    }
  };

  const isButtonDisabled =
    !!usernameError ||
    !!emailError ||
    !!passwordError ||
    !!confirmPasswordError ||
    !!setSelectedLanguageError ||
    !isFormValid;

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <div
      className={`flex justify-center items-center mt-0 lg:mt-5 drop-shadow-lg`}
      style={{ width: "85%" }}
    >
      <form
        className={`flex flex-col justify-center items-center gap-4 rounded-2xl px-10 py-3 ${
          isDarkMode ? "bg-slate-900" : "bg-slate-100"
        }`}
        style={{ width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2
          className={`flex justify-center items-center text-3xl lg:text-5xl text-center ${
            isDarkMode ? "text-white" : "text-black"
          }`}
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Sign up
        </h2>
        <div className="flex flex-col justify-center" style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="User Name"
            className={`w- px-4 py-2 border-b-2 outline-none ${
              usernameError ? "border-red-500" : "border-gray-300"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={userName}
            onChange={handleUsernameChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {usernameError && (
            <div className="animate__animated animate__shakeXtext-red-500 text-sm mt-0">
              {usernameError}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center" style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Email"
            className={`w-full px-4 py-2 border-b-2 outline-none ${
              emailError ? "border-red-500" : "border-gray-300"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={email}
            onChange={handleEmailChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {emailError && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {emailError}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center relative"
          style={{ width: "100%" }}
        >
          {" "}
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`w-full px-4 py-2 border-b-2 outline-none ${
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
            {showPassword ? (
              <AiFillEyeInvisible
                style={{ color: isDarkMode ? "white" : "black" }}
              />
            ) : (
              <AiFillEye style={{ color: isDarkMode ? "white" : "black" }} />
            )}
          </div>
          {passwordError && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {passwordError}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center relative"
          style={{ width: "100%" }}
        >
          {" "}
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className={`w-full px-4 py-2 border-b-2 outline-none ${
              confirmPasswordError ? "border-red-500" : "border-gray-300"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          <div
            className="absolute top-3 right-3 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? (
              <AiFillEyeInvisible
                style={{ color: isDarkMode ? "white" : "black" }}
              />
            ) : (
              <AiFillEye style={{ color: isDarkMode ? "white" : "black" }} />
            )}
          </div>
          {confirmPasswordError && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {confirmPasswordError}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center relative"
          style={{ width: "100%" }}
        >
          {" "}
          <select
            className={`w-full px-4 py-2 border-b-2 outline-none ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } ${selectedLanguage === "" ? "text-gray-600" : ""} ${
              isDarkMode ? "text-white" : "text-black"
            } ${selectedLanguage === "" ? "placeholder-gray-400" : ""}`}
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            <option value="" disabled hidden>
              Select Language
            </option>
            {languagesArray?.map(({ code, language }) => (
              <option key={code} value={code}>
                {language}
              </option>
            ))}
          </select>
          {selectedLanguageError && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {selectedLanguageError}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "100%" }}
        >
          <button
            type="submit"
            className={`flex justify-center items-center transition duration-150 ease-in-out hover:scale-105 bg-orange-50 text-gray-800 px-8 py-3 text-xl lg:text-2xl w-full mt-4 mb-4 rounded-full shadow-md transition-colors ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white"
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

export default Register;
