import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../redux/services/UserApi";
import languagesArray from "../util/languages";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAuth } from "../redux/features/user/authSlice";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { useUploadFileMutation } from "../redux/services/MediaApi";
import Input from "../UI/Input";
import { useDeleteAccountMutation } from "../redux/services/AuthApi";
import LeftSideBar from "../components/shared/LeftSideBar";
import { useTranslation } from 'react-i18next';

interface Socket {
  current: any;
}

const Profile = ({ socket }: { socket: Socket }): JSX.Element => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAppSelector((state) => state.auth);
  const [updateLanguage, setUpdateLanguage] = useState(user?.language);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  const { onlineFriends } = useAppSelector((state) => state.socket);
  const [uploadFile] = useUploadFileMutation();
  const [deleteAccount] = useDeleteAccountMutation();

  // Delete account function
  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? There is no going back after this point."
      )
    )
      try {
        const result = await deleteAccount({ email: user?.email });

        if ("data" in result) {
          toast.success("Account deleted successfully!");
          localStorage.clear();
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.log(error);
      }
  };

  interface FormInput {
    name: string;
    email: string;
  }

  const [formInput, setformInput] = useState<FormInput>({
    name: user?.userName,
    email: user?.email,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setformInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: any) => {
    setUpdateLanguage(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success(`${t("User signed out")}`);
    navigate("/");
  };

  const handleUpload = async (e: any) => {
    const file = e?.target?.files?.[0];
    setImage(file);
  };

  const updateProfile = async ({ response }: { response: any }) => {
    try {
      const formData = new FormData();
      if (user) {
        formData.append("userName", formInput.name || user?.userName);
        formData.append(
          "fileUrl",
          response?.data?.media?.url || user?.profileImage?.url
        );

        formData.append("language", updateLanguage || user?.language);
      }
      const result = (await updateUser({
        id: user?._id,
        data: formData,
      })) as any;

      socket.current.emit("updateProfile", {
        userName: formInput.name || user.userName,
        image: response?.data?.media?.url
          ? response?.data?.media?.url
          : user?.profileImage?.url,
        language: updateLanguage || user.language,
        from: user?._id,
        to: selectedId,
        onlineFriends: onlineFriends,
      });

      if ("data" in result) {
        const updatedUser = result.data.user;

        dispatch(
          setAuth({
            ...user,
            userName: updatedUser.userName,
            profileImage: result?.data?.user?.profileImage,
            language: updatedUser.language,
            welcome: result?.data?.user?.welcome,
          })
        );

        dispatch(
          setConversation({
            language: updateLanguage,
          })
        );
        
        toast.success(`${t("Profile updated successfully!")}`);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!image) {
      updateProfile({
        response: { data: { media: { url: user?.profileImage?.url } } },
      });
      return;
    }

    let response: any = null;
    let formData = new FormData();
    formData = new FormData();
    formData.append("file", image as any);
    formData.append("type", "image");
    formData.append("altText", "image");
    response = await uploadFile(formData);

    if ("data" in response) {
      if (response.data && !response.data.error) {
        updateProfile({ response });
      } else {
        console.log("error", response.data.error);
      }
    } else {
      console.log("error", response.error);
    }
  };

  const handleSetButtonSelected = (buttonSelected: string) => {
    navigate("/chat", { state: { buttonSelected } });
  };

  return (
    <div
      className={`flex flex-1 flex-grow justify-center w-full h-full ${
        isDarkMode ? "bg-[#181818]" : ""
      }`}
    >
      {/*First column */}
      <LeftSideBar
        showSetting={true}
        showRequest={false}
        setButtonSelected={handleSetButtonSelected}
        showRandom={false}
      />

      <div className="mx-auto flex flex-col justify-center h-full md:text-[14px]">
        <img
          src={`${
            isDarkMode ? "/assets/img/Shapesde.png" : "/assets/img/Shapes.png"
          }`}
          alt="shape"
          className="fixed left-24  bottom-[-9rem] w-[40%] z-[1] "
        />
        <img
          src={`${
            isDarkMode ? "/assets/img/Shapesd.png" : "/assets/img/Shapes.png"
          }`}
          alt="shape"
          className="fixed right-[2rem]  -top-16 w-[23%] z-[1] "
        />
        <form
          className=" px-[10rem] py-[4rem] flex flex-col bg-[#fff] border border-[#B9B9B9] rounded-[14px]"
          onSubmit={handleSubmit}
          style={{
            boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div className="mb-8  flex items-center justify-center gap-4 cursor-pointer relative">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="User"
                className=" object-cover h-[85px] w-[85px] rounded-full"
              />
            ) : (
              <img
                src={user?.profileImage?.url}
                className="h-[85px] w-[85px] rounded-full"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
            />
            <span className=" text-[#606060]">{t('Upload Photo')}</span>
          </div>

          <Input
            name="name"
            type="text"
            label={t("Username")}
            placeholder={t("Enter your username")}
            id="name"
            value={formInput.name}
            onChange={handleInputChange}
            className="bg-[#F5F5F5]  w-[410px] min-w-[410px] max-md:w-full"
          />

          <Input
            disabled={true}
            name="email"
            type="text"
            label="E-mail"
            placeholder="Enter your e-mail"
            id="email"
            value={formInput.email}
            onChange={handleInputChange}
            className="bg-[#F5F5F5]  w-[410px] min-w-[410px] max-md:w-full"
          />

          <div className="mb-12 ">
            <label
              htmlFor={name}
              className="block text-[14px] font-medium  mb-4 text-[#606060]"
            >
              {t("Language")}
            </label>
            <select
              className="p-4    w-full bg-[#F5F5F5] rounded-[10px] text-[#606060] focus:outline-none outline-none"
              value={updateLanguage}
              onChange={handleLanguageChange}
            >
              <option value="" disabled hidden>
                {t("Select a language")}
              </option>
              {languagesArray?.map(({ code, language }) => (
                <option key={code} value={code}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button className="bg-[#25282C] text-white px-4 py-2 font-semibold text-[16px] rounded-[10px]">
              {t("Update Profile")}
            </button>
          </div>
        </form>
        <div
          className="flex justify-center p-2 gap-4 cursor-pointer"
          onClick={() => handleLogout()}
        >
          <a href="">
            {isDarkMode ? (
              <img
                className="w-6 h-6"
                src="./assets/img/signoutW.png"
                alt="logout-icon"
              />
            ) : (
              <img
                className="w-6 h-6"
                src="./assets/img/signoutR.png"
                alt="logout-icon"
              />
            )}
          </a>
          <span className={`${isDarkMode ? "text-white" : "text-[#DD0000]" } font-semibold text-[17px]`}>
          {t("Log Out")}
          </span>
        </div>
        {/* delete account zone danger */}
        <div className={`${isDarkMode ? "z-50" : "z-50"} border   border-[#b9b9b9ab] rounded-[14px] shadow-xl bg-white `}>
            <div className="flex bg-white  justify-between px-4 py-6">
              <div>
                <h4 className="text-body-medium font-bold text-red-600" >{t("deleteAccount")}</h4>
                <p className="opacity-90 text-body-normal text-gray-500">
                  {t("descriptionDeleteAccount")}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="rounded-[10px] text-white bg-red-500 px-4 py-2 font-semibold text-[16px] "
              >
                {t("deleteAccountButton")}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
