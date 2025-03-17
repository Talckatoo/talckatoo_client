import React, { useEffect, useContext } from "react";
import NavBar from "../components/shared/NavBar";
import Input from "../UI/Input";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useLoginAuthMutation } from "../redux/services/AuthApi";
import { toast } from "react-toastify";
import { useAppDispatch } from "../redux/hooks";
import { UserContext } from "../context/user-context";
import { setAuth } from "../redux/features/user/authSlice";
import { MdOutlineSecurity } from "react-icons/md";
import { useTranslation } from 'react-i18next';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const [loginAuth] = useLoginAuthMutation();
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const userId = urlParams.get("userId");
  const { isDarkMode } = useContext(UserContext);

  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const [loading, setLoading] = React.useState<boolean>(false);

  const validateForm = (): boolean => {
    let isValid = true;
    const errors: FormErrors = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      isValid = false;
      errors.email = "Enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 6) {
      isValid = false;
      errors.password = "Password must be at least 6 characters.";
    }

    setFormErrors(errors);

    return isValid;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await loginAuth({
          email: formData.email.toLocaleLowerCase().trim(),
          password: formData.password,
        });

        if ("data" in response) {
          const token = response.data.token;
          localStorage.setItem("token", token as string);
          localStorage.removeItem("persist:root");
          localStorage.removeItem("userId");
          localStorage.removeItem("persist:root");
          localStorage.removeItem("conversationId");
          localStorage.removeItem("selectedId");
          localStorage.removeItem("language");
          dispatch(setAuth(response.data.user));
          navigate("/random");
          toast.success(`${t("User signed up")}`);
          setLoading(false);
        } else {
          toast.error(`${t("Email or password is incorrect")}`);
          setLoading(false);
        }
      } catch (error) {
        toast.error(`${t("Email or password is incorrect")}`);
        setLoading(false);
      }
    } else {
      toast.warn(`${t("Please enter valid entries")}`);
      setLoading(false);
    }
  };
  
  const redirectTogoogle = async (): Promise<void> => {
    window.open(`${import.meta.env.VITE_GOOGLE_URL}`, "_self");
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId as string);
      navigate("/chat");
    }
  }, [token, userId]);

  return (
    <section className="relative h-full w-full font-inter">
      <div className="fixed top-0 left-0 w-full h-full -z-20"></div>
      <img
        src="/assets/img/wave.svg"
        alt="shape"
        className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
      />
      {/* Nav bar section */}
      <NavBar showSign={false} setSelectedLanguage={function (): void {
        throw new Error("Function not implemented.");
      } } selectedLanguage={""} />
      {/* End of Nav bar section */}
      <div className="container">
        <h2
          className={`head-text text-center mt-[5rem] mb-1 ${
            isDarkMode ? "text-white" : " text-black"
          }`}
        >
           {t("Welcome back")}
        </h2>
        {/* Sign up form  */}
        <form
          className="flex flex-col items-center justify-center gap-2 max-w-[400px] m-auto"
          onSubmit={handleSubmit}
        >
          {/* Google button */}
          <div className="w-full max-w-[400px] h-[44px]">
            <Button
              type="button"
              className="bg-[#fafafa] text-black w-full h-full flex justify-center items-center border-[0.5px] border-[#33363A] rounded-lg shadow-blur-2xl "
              onClick={() => redirectTogoogle()}
            >
              <img
                src="/assets/icons/google-g-2015.svg"
                alt="google"
                className="w-8 h-8"
              />

              <span className="text-black">{t("Sign In with Google")}</span>
            </Button>
          </div>
          {/* End of Google button red */}

          <div className="flex items-center gap-2 w-full my-[2rem]">
            <div className="w-full h-[2px] bg-[#33363A]"></div>
            <p
              className={`text-black whitespace-nowrap ${
                isDarkMode ? "text-white" : " text-black"
              }`}
            >
             {t("Or, sign in with your email")}
            </p>
            <div className="w-full h-[2px] bg-[#33363A]"></div>
          </div>

          <Input
            label=""
            type="text"
            name="email"
            id="email"
            placeholder={t("Email")}
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`bg-transparent border-[#33363A]  rounded-lg mb-[-10px] ${isDarkMode ? " text-white": "text-black"}`}
            error={formErrors.email}
          />

          <Input
            label=""
            id="password"
            type="password"
            name="password"
            placeholder={t("Password")}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`bg-transparent border-[#33363A] rounded-lg mb-[-10px]   ${isDarkMode ? " text-white": "text-black"}`}
            error={formErrors.password}
          />
          <Button
            type="reset"
            onClick={() => {
              navigate(`/reset-password`);
            }}
            className={isDarkMode ? "text-white" : " text-black"}
          >
            {t("Forgot password?")}
          </Button>

          <Button
            type="submit"
            className={`${ isDarkMode ?  "bg-white text-black" : "bg-black text-white"} w-full h-[48px] mt-[1rem] z-[1] rounded-lg`}
          >
            {loading ? `${t("Loading...")}` : `${t("Log in")}`}
          </Button>

          <p
            className={` mt-4 z-[1] ${
              isDarkMode ? "text-white" : " text-black"
            }`}
          >
            {t("Don't have an account?")}{" "}
            <span
              className={`text-black cursor-pointer z-[1] underline font-semibold ${
                isDarkMode ? "text-white" : " text-black"
              }`}
              onClick={() => {
                navigate("/sign-up/verification");
              }}
            >
              {t("Sign Up")}
            </span>
          </p>
        </form>
        <div className="flex justify-center items-center mt-6 py-4 text-[#696868] gap-1">
          <div className="flex gap-1 items-center">
          <MdOutlineSecurity className={isDarkMode ? "text-white" : ""} />
          <span className={isDarkMode ? "text-white" : ""}>
              {t("SaftyData")}
            </span>
          </div>
          <div className="flex gap-2">
            <p
              className={`${ isDarkMode ? "text-blue" : "text-[blue]" }  cursor-pointer`}
              onClick={() => navigate("/terms")}
            >
              terms &{" "}
            </p>
            <p
              className={`${ isDarkMode ? "text-blue" : "text-[blue]" }  cursor-pointer`}
              onClick={() => navigate("/privacy")}
            >
              {" "}
              privacy
            </p>
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

export default SignIn;

