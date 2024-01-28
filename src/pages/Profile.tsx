import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { useUpdateUserMutation } from "../redux/services/UserApi";
import languagesArray from "../util/languages";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setAuth } from "../redux/features/user/authSlice";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { useUploadFileMutation } from "../redux/services/MediaApi";
import Input from "../UI/Input";
import {
  setRecipient,
  setRequests,
  setUser,
  setUsers,
} from "../redux/features/user/userSlice";
import { setMessages } from "../redux/features/messages/messageSlice";
import { setRequest } from "../redux/features/user/requestSlice";
import { IoPersonSharp } from "react-icons/io5";
import { PiChatTextFill } from "react-icons/pi";
import { RiSettings5Fill } from "react-icons/ri";

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
  const [uploadedFile, setUploadedFile] = useState(null);

  const navigateChat = () => {
    navigate("/chat");
  };

  interface FormInput {
    name: string;
  }

  const [formInput, setformInput] = useState<FormInput>({
    name: user?.userName,
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setformInput((prev) => ({ ...prev, [name]: value }));
    console.log(formInput.name);
  };

  const handleLanguageChange = (e: any) => {
    setUpdateLanguage(e.target.value);
    console.log(updateLanguage);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("User signed out");
    // clear persit root from local storage
    localStorage.removeItem("persist:root");
    dispatch(setAuth(null));
    dispatch(setUser(null));
    dispatch(setUsers([]));
    dispatch(setRecipient(null));
    dispatch(setMessages([]));
    dispatch(setRequest(null));
    dispatch(setRequests([]));

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

  return (
    <div
      className={`flex flex-1 justify-center items-center  w-full h-full ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      {/*First column */}
      <div className="w-[80px] pt-[2rem] min-w-[80px] border-r  border-opacity-20 grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem]">
        <div className="flex flex-col  gap-3 w-full">
          <div
            className={`${
              isDarkMode ? "bg-primary-500" : "bg-secondary-500 "
            }${"bg-white border-[1px] border-black hover:bg-gray-200 hover:border-gray-200"} mx-2 rounded-[12px]  flex items-center justify-center flex-col
              transition duration-300 ease-in-out 
            `}
            onClick={() => navigateChat()}
          >
            <PiChatTextFill
              className={`${"text-secondary-500"} z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
          </div>
        </div>

        <div className="flex flex-col  gap-4 w-full">
          <div
            className={`${
              isDarkMode ? "bg-primary-500" : "bg-secondary-500"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}
          >
            <RiSettings5Fill
              className={`text-white z-4 object-contain py-1 w-[29px] text-[32px]`}
            />
          </div>
          <div className="mx-2 pt-1 flex items-center justify-center flex-col rounded-full overflow-hidden">
            <img
              src={`${user?.profileImage?.url}`}
              className="h-14 w-14 object-cover rounded-full"
              alt="Profile-picture"
            />
          </div>
        </div>
      </div>

      <div className="   mx-auto flex flex-col md:text-[14px]">
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
          onClick={handleLogout}
        >
          <a href="">
            <img src="./assets/img/signout.png" alt="logout-icon" />
          </a>
          <span className="text-[#DD0000] font-semibold text-[17px]">
            Log Out
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
