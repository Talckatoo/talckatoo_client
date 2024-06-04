import { useState, useContext } from "react";
import Input from "../UI/Input";
import { usePasswordResetConfirmMutation } from "../redux/services/UserApi";
import Button from "../UI/Button";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/shared/NavBar";
import { useTranslation } from 'react-i18next';
import { UserContext } from "../context/user-context";

const ResetPasswordUpdate = () => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordResetConfirm] = usePasswordResetConfirmMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const { isDarkMode } = useContext(UserContext);

  const validationPassword = () => {
    if (newPassword.length < 8) {
      setPasswordError("password must be at least 8 characters");
      return;
    } else {
      setPasswordError("");
    }
    if (newPassword !== confirmNewPassword) {
      setError("password not match");
      return;
    } else {
      setError("");
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    validationPassword();
    try {
      // check if token is valid
      const response = await passwordResetConfirm({
        token: token as string,
        data: {
          password: newPassword as string,
        },
      });
      if ("data" in response) {
        // Password reset successful, handle accordingly
        toast.success(`${t("your password has been changed")}`);
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      } 
    } catch (error) {
      // Password reset failed, handle accordingly
      toast.error(`${t("your password has not been changed")}`);
    }
    setLoading(false);
  };

  return (
    <>
      {/* <NavBar showSign={false} /> */}

      <div className={` flex justify-center items-center h-full`}  >
      <div className={` ${isDarkMode ? "bg-[#282828] border-[#575757b0]" : "bg-[#fafafa]"} flex flex-col border rounded-2xl p-10 w-[510px] shadow-blur `}>
          <h2 className={`${isDarkMode ? "text-white" : "text-black"} text-heading2-semibold mb-5`}>
            {t("Change Your Password")}
          </h2>
          {/* reset with form newPassword and confirm newPasword   */}
          <form className="flex justify-center  items-center flex-col" onSubmit={handleResetPassword}>
            <Input
              type="text"
              className="bg-transparent border-[#33363A]  rounded-lg mb-[-10px]"
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("New Password")}
              label=""
              name="password"
              id="password"
              error={passwordError}
              value={newPassword}
            />
            <Input
              type="text"
              className="bg-transparent border-[#33363A]  rounded-lg mb-[-10px]"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder={t("Confirm New Password")}
              label=""
              name="password"
              id="password"
              error={error}
              value={confirmNewPassword}
            />
            <Button
              type="submit"
              className={` ${ isDarkMode ?  "text-black bg-white" : "text-white bg-black "}  w-full border rounded-2xl`}
              disabled={loading}
            >
              {loading ? t("Changing...") : t("Change Password")}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordUpdate;
