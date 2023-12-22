import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { usePasswordResetMutation } from "../redux/services/UserApi";
import { toast } from "react-toastify";

interface ResetPasswordProps {
  // Define your props here
}

const ResetPassword: React.FC<ResetPasswordProps> = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetPassword] = usePasswordResetMutation();
  const [error, setError] = useState<string>("");
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
        toast.success("we sent a link to your email account");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        // Handle error response
        toast.error("this email is not registered");
      }
    } catch (error) {
      // Handle network or other errors
      toast.error("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white h-full w-full font-inter flex justify-center items-center ">
      <div className=" bg-[#fafafa] flex flex-col items-center justify-center gap-4 border rounded-2xl w-[600px] p-12 m-auto shadow-sm shadow-slate-800 ">
        <h2 className="text-black text-heading1-bold">Reset Your Password</h2>
        <Input
          label='email'
          type="email"
          name='email'
          id='email'
          className="border rounded-xl"
          placeholder="Enter your email"
          value={email}
          error={error}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="button"
          onClick={handleSendResetLink}
          disabled={loading}
          className="bg-red-500 text-white w-full h-full flex items-center justify-center gap-2 border rounded-xl"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;

