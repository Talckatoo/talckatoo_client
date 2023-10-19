import React from "react";
import NavBar from "../components/shared/NavBar";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();
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
        <h1 className="head-text text-center my-[5rem]">
          Join Talkcatoo Today!
        </h1>
        {/* Sign up form  */}
        <form className="flex flex-col items-center justify-center gap-2 max-w-[400px] m-auto">
          {/* Google button red */}
          <div className="w-full max-w-[400px] h-[48px]">
            <Button
              type="button"
              className="bg-red-500 text-white w-full h-full flex items-center justify-start gap-2"
              onClick={() => {}}
            >
              <div className="flex items-center gap-4 h-full ">
                <img
                  src="/assets/icons/google.svg"
                  alt="google"
                  className="w-6 h-6"
                />
                {/* verticule line */}
                <div className="w-[2px] h-full bg-white opacity-70"></div>
              </div>
              <span className="mx-auto">Sign Up with Google</span>
            </Button>
          </div>
          {/* End of Google button red */}

          <div className="flex items-center gap-4 w-full my-[2rem]">
            <div className="w-full h-[2px] bg-[#33363A]"></div>
            <p className="text-title-500 whitespace-nowrap">
              Or, register with your email
            </p>
            <div className="w-full h-[2px] bg-[#33363A]"></div>
          </div>

          <Input
            label="Full Name "
            name="name"
            placeholder="Enter your name"
            value=""
            onChange={() => {}}
            className="bg-transparent border-[#33363A]"
          />
          <Input
            label="Email "
            name="email"
            placeholder="Enter your email"
            value=""
            onChange={() => {}}
            className="bg-transparent border-[#33363A]"
          />
          <Input
            label="Password "
            name="email"
            placeholder="Password (at least 10 characters)"
            value=""
            onChange={() => {}}
            className="bg-transparent border-[#33363A]"
          />
          <Input
            label="Confirm Password "
            name="email"
            placeholder="Password (at least 10 characters)"
            value=""
            onChange={() => {}}
            className="bg-transparent border-[#33363A]"
          />

          <Button
            type="submit"
            className="bg-primary-500 text-white w-full h-[48px] mt-[2rem]"
            onClick={() => {}}
          >
            Sign Up
          </Button>

          <p className="text-title-500 mt-4">
            Already have an account?{" "}
            <span
              className="text-primary-500 cursor-pointer"
              onClick={() => {
                navigate("/sign-in");
              }}
            >
              Sign In
            </span>
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
