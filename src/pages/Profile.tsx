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
// import UserProfile from "../components/UserProfile";

interface Socket {
  current: any;
}

const Profile = ({ socket }: { socket: Socket }): JSX.Element => {
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
    if (window.confirm('Are you sure you want to delete your account? There is no going back after this point.'))
    try {
      const result = await deleteAccount(user?.email);
      if ("data" in result) {
        toast.success("Account deleted successfully!");
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

    } catch (error) {
      console.log(error);
    }
  }

  interface FormInput {
    name: string;
  }

  const [formInput, setformInput] = useState<FormInput>({
    name: user?.userName,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setformInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: any) => {
    setUpdateLanguage(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("conversationId");
    localStorage.removeItem("selectedId");
    localStorage.removeItem("language");

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
        console.log("conversation id from profile");

        dispatch(
          setConversation({
            language: updateLanguage,
          })
        );
        toast.success("Profile updated successfully!");
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
        className={`flex flex-1 flex-grow justify-center w-full h-full ${isDarkMode ? "bg-slate-950" : ""
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
          <form
            className=" px-[10rem] py-[4rem] flex flex-col bg-[#fff] border border-[#b9b9b9ab] rounded-[14px]"
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
              <span className=" text-[#606060]">Upload Photo</span>
            </div>

            <Input
              name="name"
              type="text"
              label="Username"
              placeholder="Enter your username"
              id="name"
              value={formInput.name}
              onChange={handleInputChange}
              className="bg-[#F5F5F5]  w-[410px] min-w-[410px] max-md:w-full"
            />
            <div className="mb-12 ">
              <label
                htmlFor={name}
                className="block text-[14px] font-medium  mb-4 text-[#606060]"
              >
                Language
              </label>
              <select
                className="p-4    w-full bg-[#F5F5F5] rounded-[10px] text-[#606060] focus:outline-none outline-none"
                value={updateLanguage}
                onChange={handleLanguageChange}
              >
                <option value="" disabled hidden>
                  Select a language
                </option>
                {languagesArray?.map(({ code, language }) => (
                  <option key={code} value={code}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button className="bg-[#25282C] w-auto text-white py-4 px-[3rem] rounded-[10px]">
                Update Profile
              </button>
            </div>
          </form>
          <div
            className="flex justify-center mt-5 gap-4 cursor-pointer"
            onClick={() => handleLogout()}
          >
            <a href="">
              <img src="./assets/img/signout.png" alt="logout-icon" />
            </a>
            <span className="text-[#DD0000] font-semibold text-[17px]">
              Log Out
            </span>
          </div>
          {/* delete account zone danger */}
          <div className="border border-black-500 shadow-xl mt-2">
            <div className="flex px-3 flex-col mt-5 gap-4 cursor-pointer">
              <h3 className="text-body-bold text-red-500">Danger</h3>
              <div className="flex justify-between px-4 py-2">
                <div>
                  <h4 className="text-body-medium text-red-400">Delete Account</h4>
                  <p className="opacity-90">Delete your account and all its associated data</p>
                </div>
                <button onClick={handleDeleteAccount} className="rounded-md text-[#fafafa] bg-red-600  p-2 font-semibold text-[17px]">
                  DELETE ACCOUNT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;
