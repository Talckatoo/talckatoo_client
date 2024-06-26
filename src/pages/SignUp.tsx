import React, { useContext, useState } from "react";
import NavBar from "../components/shared/NavBar";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useRegisterAuthMutation } from "../redux/services/AuthApi";
import { useDispatch } from "react-redux";
import languagesArray from "../util/languages";
import { setAuth } from "../redux/features/user/authSlice";
import { MdOutlineSecurity } from "react-icons/md";
import { UserContext } from "../context/user-context";
import { setMessages } from "../redux/features/messages/messageSlice";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}
  
interface FormErrors {
  name?: string;
  password?: string;
  confirmPassword?: string;
  selectedLanguage?: string;
  verificationCode?: string;
}

export const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [registerAuth] = useRegisterAuthMutation();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(UserContext);


  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {};
    if (!formData.name || formData.name.length < 5) {
      isValid = false;
      errors.name = "Name must be at least 5 characters.";
    }
    if (!formData.password || formData.password.length < 8) {
      isValid = false;
      errors.password = "Password must be at least 8 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      isValid = false;
      errors.confirmPassword = "Passwords must match.";
    }
    if (!selectedLanguage) {
      isValid = false;
      errors.selectedLanguage = "Please select a language to continue";
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (validateForm()) {
      try {
        const response = await registerAuth({
          userName: formData.name,
          email: userEmail.toLocaleLowerCase().trim(),
          password: formData.password,
          language: selectedLanguage,
        });

        if (response.error) {
          toast.error(response.error.data.message);
          return;
        }
        const token = response?.data?.token;
        const user = response?.data?.user;
        localStorage.setItem("token", token as string);
        localStorage.removeItem("persist:root");
        localStorage.removeItem("userId");
        localStorage.removeItem("persist:root");
        localStorage.removeItem("conversationId");
        localStorage.removeItem("selectedId");
        localStorage.removeItem("language");
        dispatch(setMessages([]));
        dispatch(setConversation({ conversationId: null, selectedId: null }));

        dispatch(setAuth(user));
        toast.success(`${t("User signed up")}`);
        navigate("/chat");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
          toast.error(`${t("Error signing up")}`);
        }
      }
    } else {
      toast.warn(`${t("Please enter valid entries")}`);
    }
  };

  return (
    <section className={`  ${ isDarkMode ?  "" : "bg-white"} h-full w-full font-inter`}>
      <img
        src="/assets/img/wave.svg"
        alt="shape"
        className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
      />
      <NavBar showSign={false} setSelectedLanguage={function (): void {
        throw new Error("Function not implemented.");
      } } selectedLanguage={""} />
      {/* End of Nav bar section */}

      <h1    className={`head-text text-center mt-[6rem] mb-6 ${
            isDarkMode ? "text-white" : "text-black"
          }`}>
        {t("JoinUs")}
      </h1>
      {/* Sign up form  */}
      <form
        className="flex flex-col items-center justify-center max-w-[400px] mx-auto"
        onSubmit={handleSubmit}
      >
        <Input
          // label="Username"
          type="text"
          name="name"
          placeholder="Username"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className={`bg-transparent border-[#33363A] z-[1] rounded-lg ${
            isDarkMode ? " text-white" : "text-black"
          }`}
          error={formErrors.name}
          label={""}
          id={""}
        />

        <Input
          // label="Password"
          name="password"
          type="password"
          placeholder="Password (at least 8 characters)"
          value={formData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={`bg-transparent border-[#33363A] z-[1] rounded-lg ${
            isDarkMode ? " text-white" : "text-black"
          }`}
          error={formErrors.password}
          label={""}
          id={""}
        />
        <Input
          // label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className={`bg-transparent border-[#33363A] z-[1] rounded-lg ${
            isDarkMode ? " text-white" : "text-black"
          }`}
          error={formErrors.confirmPassword}
          label={""}
          id={""}
        />

        <select
     className={`rounded-lg p-3 w-full border  relative text-[16px] focus:outline-none z-[1] ${
      formErrors.selectedLanguage ? "border-red-500" : ""
    } bg-transparent border-[#33363A] ${
      isDarkMode ? "text-white" : "text-black"
    }`}
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
 <option value="" disabled hidden className="text-black">
           {t("SelectLanguage")}
          </option>
          {languagesArray?.map(({ code, language }) => (
   <option key={code} value={code} 
   className={isDarkMode ? "bg-[#0E131D]" : "bg-white"}
   >
              {language}
            </option>
          ))}
        </select>
        {formErrors.selectedLanguage && (
          <p className="mt-2 text-[16px] md:text-[18px] text-red-500">
            {formErrors.selectedLanguage}
          </p>
        )}

        <Button
          type="submit"
          className={`w-full h-[48px] mt-[2rem] z-[1] rounded-lg ${ isDarkMode ?  "bg-white text-black" : "bg-black text-white"}`}
          onClick={() => {}}
        >
          {t("SignUp")}
        </Button>

        <p className={` ${isDarkMode ? "text-white" : ""} mt-4 z-[1]`}>
          {t("AlreadyIn")}{" "}
          <Link
className=" cursor-pointer rounded-lg underline font-semibold"
            to="/sign-in"
          >
            {t("SignIn")}
          </Link>
        </p>
      </form>
      <div className="flex justify-center items-center mt-6 py-4 text-[#696868] gap-1">
        <div className="flex gap-1 items-center">
        <MdOutlineSecurity className={isDarkMode ? "text-white" : ""} />
          <span
      className={isDarkMode ? "text-white" : ""}
          >{t("AgreeWithR&p")}</span>
        </div>
        <div className="flex gap-2">
          <p
              className={`${ isDarkMode ? "text-blue" : "text-[blue]" }  cursor-pointer`}
              onClick={() => navigate("/terms")}
          >
            Terms of Service &{" "}
          </p>
          <p
              className={`${ isDarkMode ? "text-blue" : "text-[blue]" }  cursor-pointer`}
              onClick={() => navigate("/privacy")}
          >
            {" "}
            Privacy
          </p>
        </div>
      </div>

      <br />
      <br />
      <br />
    </section>
  );
};