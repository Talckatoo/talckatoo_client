import React, { useContext, useState, useRef } from "react";
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

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  selectedLanguage?: string;
  verificationCode?: string;
}

export const SignUp = () => {
  const navigate = useNavigate();
  // const { setUser, isDarkMode } = useContext(UserContext);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [registerAuth] = useRegisterAuthMutation();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const [correctVerificationCode, setCorrectVerificationCode] = React.useState("");

  const [verificationCode, setVerificationCode] = React.useState("");

  const sendVerificationCode = async () => {
    try {
      console.log('Sending verification code to email:', formData.email);

      const response = await axios.post(import.meta.env.VITE_VERIFY_EMAIL, { email: formData.email });
      const { verificationCode } = response.data;
      toast.success('Verification code sent to your email. Please check your email.');
      setVerificationCode(verificationCode);
      console.log('Verification code:', verificationCode);
    } catch (error) {
      console.error('Error requesting verification:', error);
    }
  };

  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const input4Ref = useRef<HTMLInputElement>(null);

  // Function to concatenate input values
  const getInputValue = () => {
    const value1 = input1Ref.current?.value || "";
    const value2 = input2Ref.current?.value || "";
    const value3 = input3Ref.current?.value || "";
    const value4 = input4Ref.current?.value || "";
    return value1 + value2 + value3 + value4;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {};

    if (!formData.name || formData.name.length < 5) {
      isValid = false;
      errors.name = "Name must be at least 5 characters.";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors.email = "Enter a valid email address.";
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
    // Check if verification code matches
    const inputVerificationCode = getInputValue();
    console.log('Correct verification code:', verificationCode, 'Input verification code:', inputVerificationCode);
    if (verificationCode !== inputVerificationCode) {
      isValid = false;
      errors.verificationCode = "Verification code does not match.";
    }
    setFormErrors(errors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await registerAuth({
          userName: formData.name,
          email: formData.email.toLocaleLowerCase().trim(),
          password: formData.password,
          language: selectedLanguage,
        });

        const token = response?.data?.token;
        const user = response?.data?.user;
        localStorage.setItem("token", token as string);
        dispatch(setAuth(user));
        toast.success("User signed up");
        navigate("/chat");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // If it's an Axios error with a response, show the error message
          const errorMessage = error.response.data.message;
          toast.error(errorMessage); // Display the error message to the user
        } else {
          // Handle any other errors or log a generic message
          toast.error("Error signing up");
        }
      }
    } else {
      toast.warn("Please enter valid entries");
    }
  };

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
        <h1 className="head-text text-center mt-[6rem] mb-6 text-black">
          Join Talckatoo Today!
        </h1>
        {/* Sign up form  */}
        <form
          className="flex flex-col items-center justify-center gap-2 max-w-[400px] m-auto"
          onSubmit={handleSubmit}
        >
          <Input
            // label="Username"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1] rounded-lg text-black"
            error={formErrors.name}
            label={""}
            id={""}
          />
          <div className="flex justify-items-start place-items-baseline w-full">
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
              error={formErrors.email}
              label={""}
              id={""}
            />
            <button
              type="button"
              onClick={sendVerificationCode}
              className="bg-black text-white w-[70px] h-[50px] z-[1] rounded-lg-right font-semibold py-3"
            >
              Verify
            </button>
          </div>
          {/* verification code input  */}
          <div className="flex gap-4 max-w-lg mx-auto justify-center font-[sans-serif]">
            <input  ref={input1Ref} type="text" placeholder="0" className="w-12 h-10 flex items-center text-center  text-black text-base border-2 border-gray-300 focus:border-[#007bff] outline-none rounded" />
            <input  ref={input2Ref} type="text" placeholder="0" className="w-12 h-10 flex items-center text-center  text-black text-base border-2 border-gray-300 focus:border-[#007bff] outline-none rounded" />
            <input  ref={input3Ref} type="text" placeholder="0" className="w-12 h-10 flex items-center text-center  text-black text-base border-2 border-gray-300 focus:border-[#007bff] outline-none rounded" />
            <input  ref={input4Ref} type="text" placeholder="0" className="w-12 h-10 flex items-center text-center  text-black text-base border-2 border-gray-300 focus:border-[#007bff] outline-none rounded" />
            <p className="text-red-500" >{formErrors.verificationCode}</p>
          </div>

          <Input
            // label="Password"
            name="password"
            type="password"
            placeholder="Password (at least 8 characters)"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1] rounded-lg text-black"
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
            className="bg-transparent border-[#33363A] z-[1] rounded-lg"
            error={formErrors.confirmPassword}
            label={""}
            id={""}
          />

          <select
            className={`rounded-lg p-3 w-full border text-black relative text-[16px] focus:outline-none z-[1] ${formErrors.selectedLanguage ? "border-red-500" : ""
              } bg-transparent border-[#33363A]`}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Your Language
            </option>
            {languagesArray?.map(({ code, language }) => (
              <option key={code} value={code} className="bg-white">
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
            className="bg-black text-white w-full h-[48px] mt-[2rem] z-[1] rounded-lg"
            onClick={() => { }}
          >
            Sign Up
          </Button>

          <p className="text-black mt-4 z-[1]">
            Already have an account?{" "}
            <Link
              className="text-black cursor-pointer rounded-lg underline font-semibold"
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
      {/* End of Sign up form  */}
      <br />
      <br />
      <br />
    </section>
  );
};
