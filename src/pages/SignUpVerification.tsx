import React, {  useState, useRef } from "react";
import NavBar from "../components/shared/NavBar";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { MdOutlineSecurity } from "react-icons/md";

interface FormData {
  email: string;
}

const SignUpVerification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<FormData>({
    email: "",
  });

  const [confirmationCode, setConfirmationCode] = useState(Array(4).fill(""));
  const refs = useRef<Array<HTMLInputElement>>([]);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [sendEmail, setSendEmail] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const sendVerificationCode = async () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/account/emailVerification`, {
        email: formData.email,
      });
      if (response){
        const { verificationCode } = response.data;
        toast.success(
          "Verification code sent to your email. Please check your email."
        );
        setVerificationCode(verificationCode);
        setSendEmail(true)
      }
    } catch (error) {
      if (error.response.data.message === "The email is already in use"){
        toast.error("The email is already in use. Please use another email or sign in");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    setConfirmationCode(pastedData.split(""));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const inputType = (e.nativeEvent as any).inputType;

    if (inputType === "deleteContentBackward") {
      setConfirmationCode((prevState) => {
        const newState = [...prevState];
        newState[index] = "";
        return newState;
      });

      if (index > 0) {
        refs.current[index - 1]?.focus();
      }

      return;
    }

    // Allow only single digits
    if (/^\d$/.test(value)) {
      setError(null);

      setConfirmationCode((prevState) => {
        const newState = [...prevState];
        newState[index] = value;
        return newState;
      });

      // Automatically focus the next input field
      if (index < 3) {
        refs.current[index + 1]?.focus();
      }
    } else {
      setError("Code must consist of 6 digits");
    }
  };
  const handleContinue = () =>{
    const code = confirmationCode.join("");
    if (code !== verificationCode || code === "") {
      setError("Verification code does not match");
      return;
    }
    navigate("/sign-up");
  }
  return (
    <section className="relative bg-white h-full w-full font-inter">
      <div className="bg-white fixed top-0 left-0 w-full h-full -z-20"></div>
      <img
        src="/assets/img/wave.svg"
        alt="shape"
        className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
      />
      <NavBar showSign={false} />
      {/* End of Nav bar section */}
      <div className="container">
        <h1 className="head-text text-center mt-[12rem] mb-6 text-black">
          Join Talckatoo Today!
        </h1>
        {!sendEmail ? (
            <>
          <div className="flex justify-center text-center place-items-baseline mt-8">
          <Input
            // label="Email"
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1] rounded-lg-left text-black"
            label={""}
            id={""}
          />
        </div>
        <Button
          type="submit"
          className="bg-black text-white w-full h-[48px] z-[1] rounded-lg"
          onClick={sendVerificationCode}
        >
          Send verification code
        </Button>
        </>
        ):(
            <>
            <span
            className="text-black mt-4 z-[1] text-center"
            >Please enter the code we sent to your email</span>
            <div
            className="flex justify-between space-x-2 h-12"
            onPaste={handlePaste}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className={`w-12 h-12 text-center border rounded-md ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                value={confirmationCode[index]}
                onChange={(e) => handleInputChange(e, index)}
                ref={(el) => el && (refs.current[index] = el)}
              />
            ))}
          </div>
          <Button
          type="submit"
          className="bg-black text-white text-center justify-center h-[48px] z-[1] rounded-lg mt-4"
          onClick={handleContinue}
        >
          Continue
        </Button>
          </>
        )
        }
        <p className="text-black mt-4 z-[1] text-center">
            Already have an account?{" "}
            <Link
              className="text-black cursor-pointer rounded-lg underline font-semibold"
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        <div className="flex justify-center items-center mt-6 py-4 text-[#696868] gap-1">
          <div className="flex gap-1 items-center">
            <MdOutlineSecurity />
            <span>
            By signing up, you agree to our 
            </span>
           </div>
           <div className="flex gap-2">
           <p className="text-[blue] cursor-pointer" onClick={()=> navigate("/terms")}>Terms of Service & </p>
           <p className="text-[blue] cursor-pointer" onClick={()=> navigate("/privacy")}> Privacy</p>
           </div>
        </div>
      </div>
      {/* End of Sign up form  */}
      <br />
      <br />
      <br />
    </section>
  );
};
export default SignUpVerification;