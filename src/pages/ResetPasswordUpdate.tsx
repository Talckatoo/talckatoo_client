import { useState } from 'react';
import Input from '../UI/Input';
import { usePasswordResetConfirmMutation } from '../redux/services/UserApi';
import Button from '../UI/Button';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";

const ResetPaaswordUpdate = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordResetConfirm] = usePasswordResetConfirmMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { token } = useParams();  

  const validationPassword = () => {
    if (newPassword.length < 8) {
      setPasswordError("password must be at least 8 characters")
    } else {
      setPasswordError("")
    }
    if (newPassword !== confirmNewPassword) {
      setError("password not match")
    } else {
      setError("")
    }
  }

  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    validationPassword();
    try {
      const response = await passwordResetConfirm({
        token: token as string,
        data: {
          password: newPassword as string,
        },
      });
      if ("data" in response) {
        // Password reset successful, handle accordingly
        toast.success("your password has been changed");
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    } catch (error) {
      // Password reset failed, handle accordingly
      toast.error("your password has not been changed");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white h-full w-full font-inter flex justify-center items-center ">
      <div className=" bg-[#fafafa] flex flex-col items-center justify-center gap-4 border rounded-2xl w-[600px] p-12 m-auto shadow-sm shadow-slate-800 ">
        <h2 className="text-black text-heading1-bold">Change Your Password</h2>
        {/* reset with form newPassword and confirm newPasword   */}
        <form className='w-full h-full' onSubmit={handleResetPassword} >
          <Input type="text" className="border rounded-xl  text-black placeholder-slate-950" onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" label="New Password" name="password" id="password" error={passwordError} value={newPassword} />
          <Input type="text" className="border rounded-xl  text-black placeholder-slate-950" onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" label="Confirm New Password" name="password" id="password" error={error} value={confirmNewPassword} />
          <Button type="submit"
            className="bg-green-500 text-white w-full h-full flex items-center justify-center gap-2 border rounded-xl" disabled={loading} >
            {loading ? "Changing..." : "Password Changed"}
          </Button>
        </form>

      </div>
    </div>
  )
}

export default ResetPaaswordUpdate