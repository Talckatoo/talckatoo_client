import React, { useContext, useState } from "react";
import NavBar from "../components/shared/NavBar";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useRegisterAuthMutation } from "../redux/services/AuthApi";
import { UserContext } from "../context/user-context";
import { useDispatch } from 'react-redux';
import languagesArray from "../util/languages";
import { setUserSelf } from "../redux/features/user/userSlice";


interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  selectedLanguage?: string;
}


export const SignUp = () => {
  const navigate = useNavigate();
  const { setUser, isDarkMode } = useContext(UserContext);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [registerAuth] = useRegisterAuthMutation();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

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
    setFormErrors(errors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await registerAuth(  
          {
            userName: formData.name,
            email: formData.email,
            password: formData.password,
            language: selectedLanguage,
          }
        );

        const token = response.data.token;
        localStorage.setItem("token", JSON.stringify(token));
        setUser(response.data.user);
        dispatch(setUserSelf(response.data.user));

        toast.success("User signed up");
        navigate("/chat");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // If it's an Axios error with a response, show the error message
          const errorMessage = error.response.data.message;
          console.error(errorMessage); // Log the error message
          console.log(error);
          toast.error(errorMessage); // Display the error message to the user
        } else {
          // Handle any other errors or log a generic message
          console.error("An error occurred:", error);
          toast.error("Error signing up");
        }
      }
    } else {
      toast.warn("Please enter valid entries");
    }
  };

  return (
    <section className="relative bg-background-500 h-full w-full font-inter">
      <div className="bg-background-500 fixed top-0 left-0 w-full h-full -z-20"></div>
      <img
        src="/assets/img/shape1.svg"
        alt="shape"
        className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
      />
      <img
        src="/assets/img/shape2.svg"
        alt="shape"
        className="fixed  left-0  bottom-[-150px] max-lg:w-[350px]"
      />
      {/* Nav bar section */}
      <NavBar showSign={false} />
      {/* End of Nav bar section */}
      <div className="container">
        <h1 className="head-text text-center my-[2rem]">
          Join Talckatoo Today!
        </h1>
        {/* Sign up form  */}
        <form
          className="flex flex-col items-center justify-center gap-2 max-w-[400px] m-auto"
          onSubmit={handleSubmit}
        >
          
          {/* <div className="flex items-center gap-4 w-full my-[1rem]">
            <div className="w-full h-[2px] bg-[#33363A]"></div>
            <p className="text-title-500 whitespace-nowrap z-[1]">
            register with your email
            </p>
            <div className="w-full h-[2px] bg-[#33363A] z-[1]"></div>
          </div> */}

          <Input
            label="Full Name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1]"
            error={formErrors.name}
          />
          <Input
            label="Email"
            type="text"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1]"
            error={formErrors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Password (at least 8 characters)"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1]"
            error={formErrors.password}
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            className="bg-transparent border-[#33363A] z-[1]"
            error={formErrors.confirmPassword}
          />

          <select
            className={`p-3 w-full border text-white relative text-[16px] focus:outline-none z-[1] ${
              formErrors.selectedLanguage ? "border-red-500" : ""
            } bg-transparent border-[#33363A]`}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Your Language
            </option>
            {languagesArray?.map(({ code, language }) => (
              <option key={code} value={code} className="bg-secondary-500">
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
            className="bg-primary-500 text-white w-full h-[48px] mt-[2rem] z-[1]"
            onClick={() => {}}
          >
            Sign Up
          </Button>

          <p className="text-title-500 mt-4 z-[1]">
            Already have an account?{" "}
            <Link className="text-primary-500 cursor-pointer" to="/sign-in">
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
