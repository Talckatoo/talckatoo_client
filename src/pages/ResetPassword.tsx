import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { usePasswordResetMutation } from "../redux/services/UserApi";
import { toast } from "react-toastify";
import NavBar from "../components/shared/NavBar";
import { useTranslation } from 'react-i18next';
import { useContext } from "react";
import { UserContext } from "../context/user-context";

interface ResetPasswordProps {
  // Define your props here
}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetPassword] = usePasswordResetMutation();
  const [error, setError] = useState<string>("");
  const { isDarkMode } = useContext(UserContext);
  const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!regex.test(email)) {
      setError("Please enter a valid email");
    } else {
      setError("");
    }
  };

  const handleSendResetLink = async () => {
    validateEmail();
    try {
      setLoading(true);
      // Make a POST request to reset the password
      const response = await resetPassword({
        email: email.toLocaleLowerCase().trim(),
      });

      if ("data" in response) {
        // Password reset successful, handle accordingly
        toast.success(`${t("we sent a link to your email account")}`);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // Handle error response
        toast.error(`${t("this email is not registered")}`);
      }
    } catch (error) {
      // Handle network or other errors
      toast.error(`${t("Password reset failed")}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <NavBar showSign={false} setSelectedLanguage={function (): void {
        throw new Error("Function not implemented.");
      }} selectedLanguage={""} /> */}

      <div className={`flex justify-center items-center h-full`}  >
        <div className={` ${isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-[#fafafa]"} flex flex-col border rounded-2xl p-10 w-[510px] shadow-blur `}>
          <h2 className={`${isDarkMode ? "text-white" : "text-black"} text-heading2-semibold mb-2`}>{t("Reset Your Password")}</h2>
          <p className={`${isDarkMode ? "text-white" : "text-black"} text-body2 mb-5`}>
            {t("Enter your email address and we will send you a link to reset your password")}
          </p>
          <Input
            label=""
            type="email"
            name="email"  
            id="email"
            className="bg-transparent border-[#33363A]  rounded-lg mb-[-10px]"
            placeholder={t("Enter your email")}
            value={email}
            error={error}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleSendResetLink}
            disabled={loading}
            className={`${ isDarkMode ? "bg-white text-black": "bg-[#282828] text-white" } rounded-2xl`}
          >
            {loading ? t("Reseting") : t("Send Reset Link")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
