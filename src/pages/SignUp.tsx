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
import { MdOutlineSecurity } from "react-icons/md";
import { UserContext } from "../context/user-context";

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
  const refs = useRef<Array<HTMLInputElement>>([]);


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
        dispatch(setAuth(user));
        toast.success("User signed up");
        navigate("/chat");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        } else {
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
  
        <h1 className="head-text text-center mt-[6rem] mb-6 text-black">
          Join Talckatoo Today!
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
            className="bg-transparent border-[#33363A] z-[1] rounded-lg text-black"
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
            className={`rounded-lg p-3 my-4 w-full border text-black relative text-[16px] focus:outline-none z-[1] ${
              formErrors.selectedLanguage ? "border-red-500" : ""
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
            onClick={() => {}}
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
    
      <br />
      <br />
      <br />
    </section>
  );
};
