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
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [usernameError, setUsernameError] = useState({
    error:false,
    errorMessage: ""
  });
  const [emailError, setEmailError] = useState({
    error:false,
    errorMessage: ""
  });
  const [passwordError, setPasswordError] = useState({
    error:false,
    errorMessage: ""
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState({
    error:false,
    errorMessage: ""
  });
  const [selectedLanguageError, setSelectedLanguageError] = useState({
    error:true,
    errorMessage: "* All fields are required"
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const { setUser, isDarkMode } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const validateForm = () => {
      let isValid = (userName.trim()!=="" && email.trim()!=="" && password.trim()!=="" && confirmPassword.trim()!=="" && selectedLanguage.trim()!=="");
      return isValid;
    };

    setIsFormValid(validateForm());
  }, [userName, email, password, confirmPassword, selectedLanguage]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    const userName = e.target.value
    if (userName.trim() === "") {
      setUsernameError({error:true,errorMessage:"*"});
    } else {
      setUsernameError({error:false,errorMessage:""});
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    const email = e.target.value;
    if (email.trim() === "") {
      setEmailError({error:true,errorMessage:"*"});
    } else {
      if (!emailRegex.test(email)) {
        setEmailError({error:true,errorMessage:"Invalid email format"});
      } else {
        setEmailError({error:false,errorMessage:""});
      }
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    const selectedLanguage=e.target.value;
    if (selectedLanguage === "") {
      setSelectedLanguageError({error:true,errorMessage:"* All fields are required"});
    } else {
      setSelectedLanguageError({error:false,errorMessage:""});
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    const password=e.target.value;
    if (password.trim() === "") {
      setPasswordError({error:true,errorMessage:"*"});
    } else {
      setPasswordError({error:false,errorMessage:""});
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    const confirmPassword = e.target.value;
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError({error:true,errorMessage:"*"});
    } else if (password !== confirmPassword) {
      setConfirmPasswordError({error:true,errorMessage:"Passwords do not match"});
    } else {
      setConfirmPasswordError({error:false,errorMessage:""});
    }
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
    !!usernameError.errorMessage ||
    !!emailError.errorMessage ||
    !!passwordError.errorMessage ||
    !!confirmPasswordError.errorMessage ||
    !!selectedLanguageError.errorMessage ||
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
              usernameError.error ? "border-red-500" : "border-gray-300"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={userName}
            onChange={handleUsernameChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {usernameError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {usernameError.errorMessage}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center" style={{ width: "100%" }}>
          <input
            type="email"
            placeholder="Email"
            className={`w-full px-4 py-2 border-b-2 outline-none ${
              emailError.error ? "border-red-500" : "border-gray-300"
            } ${isDarkMode ? "bg-gray-800" : ""}`}
            value={email}
            onChange={handleEmailChange}
            style={{ color: isDarkMode ? "#fff" : "#000" }}
          />
          {emailError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {emailError.errorMessage}
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
              passwordError.error ? "border-red-500" : "border-gray-300"
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
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {passwordError.errorMessage}
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
              confirmPasswordError.error ? "border-red-500" : "border-gray-300"
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
          {confirmPasswordError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {confirmPasswordError.errorMessage}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center relative"
          style={{ width: "100%" }}
        >
          {" "}
          <select
            className={`w-full px-4 py-2 ${selectedLanguageError.error ? "border-b-2 border-b-red-500":"border-b-2 border-b-gray-300"} outline-none ${
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
          {selectedLanguageError.error && (
            <div className="animate__animated animate__shakeX text-red-500 text-sm mt-0">
              {selectedLanguageError.errorMessage}
            </div>
          )}
        </div>
        <div
          className="flex flex-col justify-center items-center"
          style={{ width: "100%" }}
        >
          <button
            type="submit"
            className={`flex justify-center items-center ${isDarkMode ? "bg-gray-700 text-white": "bg-orange-50 text-black"} transition duration-150 ease-in-out hover:scale-105 ${isButtonDisabled ? "cursor-not-allowed":"hover:bg-green-900 hover:text-white"} px-8 py-3 text-xl lg:text-2xl w-full mt-4 mb-4 rounded-full shadow-md colors ${isDarkMode ? "text-white" : "text-black"}`}
            disabled={isButtonDisabled as boolean}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
