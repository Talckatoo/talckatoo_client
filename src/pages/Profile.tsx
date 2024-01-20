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
  setUser,
  setUsers,
} from "../redux/features/user/userSlice";
import { setMessages } from "../redux/features/messages/messageSlice";
import { setRequest } from "../redux/features/user/requestSlice";

// import UserProfile from "../components/UserProfile";

interface Socket {
  current: any;
}

const Profile = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAppSelector((state) => state.auth);
  const [updateLanguage, setUpdateLanguage] = useState("");
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
    name: "",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setformInput({ ...formInput, [name]: value });
    console.log(formInput);
  };
  const handleLanguageChange = (e: any) => {
    setUpdateLanguage(e.target.value);
    console.log(updateLanguage);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("User signed out");
    // clear persisted state
    dispatch(setAuth(null));
    dispatch(setUser(null));
    dispatch(setUsers([]));
    dispatch(setConversation({}));
    dispatch(setMessages([]));
    dispatch(setRequest(null));
    dispatch(setRecipient(null));

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
        formData.append("userName", name || user.userName);

        formData.append(
          "fileUrl",
          response?.data?.media?.url || user.profileImage.url
        );

        formData.append("language", updateLanguage || user.language);
      }

      const result = await updateUser({
        id: user?._id,
        data: formData,
      });

      socket.current.emit("updateProfile", {
        userName: name || user.userName,
        image: response?.data?.media?.url
          ? response?.data?.media?.url
          : user.profileImage.url,
        language: updateLanguage || user.language,
        from: user?._id,
        to: selectedId,
        onlineFriends: onlineFriends,
      });

      if ("data" in result) {
        const updatedUser = result.data.user;
        toast.success("Profile updated successfully!");

        dispatch(
          setAuth({
            ...user,
            userName: updatedUser.userName,
            profileImage: {
              url: response?.data?.media?.url,
            },
            language: updatedUser.language,
            welcome: result?.data?.user?.welcome,
          })
        );
        dispatch(
          setConversation({
            language: updateLanguage,
          })
        );
        navigateChat();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!image) {
      updateProfile({
        response: { data: { media: { url: user.profileImage.url } } },
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
        !isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      
      {/*First column */}
      <div className="w-[89px] border-r pt-5 border-primary-500 border-opacity-20 grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem]">
        <div className="flex flex-col  gap-3 w-full">
          <div
            className={`${
              isDarkMode ? "bg-primary-500" : "bg-secondary-500"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}
          >
            <img
              src="./src/assests/comment_duotone.svg"
              className=" top-1 right-4 z-4 object-contain py-2"
            />
          </div>
          <div className="relative border-[1px] border-secondary-500 mx-2 rounded-[12px] flex items-center justify-center flex-col relative">
            <img
              src={`./src/assests/${
                isDarkMode ? "User_alt_fill_dark.svg" : "User_alt_fill.svg"
              }`}
              className="z-4 object-contain py-2"
            />
            <div
              className="absolute top-[75%] left-[80%] w-4 h-4 bg-red-badge-500 rounded-full text-white flex items-center justify-center"
              style={{
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                fontSize: "0.6rem",
                fontWeight: "bold",
              }}
            >
              15
            </div>
          </div>
        </div>
        <div className="flex flex-col  gap-3 w-full">
        <a href="#"  >
          <div
            className={`${
              isDarkMode ? "bg-primary-500" : "bg-secondary-500"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}

           
          >
            <img
              src="./src/assests/Setting_line.svg"
              className=" top-1 right-4 z-4 object-contain py-2"
            />
          </div>
          </a>

          <div className="mx-2 rounded-[12px]  flex items-center justify-center flex-col">
            <img
              src="./src/assests/Ellipse 1190.svg"
              className=" top-1 right-4 z-4 mb-3 object-contain py-2"
            />
          </div>
        </div>
      </div>

      <div className=" w-[580px]  mx-auto flex flex-col md:text-[14px] ">
        <form className=" px-[5rem] py-[4rem] flex flex-col bg-[#fff] border border-[#A6A6A6]" onSubmit={handleSubmit}>
          <div className="mb-8  flex items-center justify-center gap-4 cursor-pointer relative">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="User"
                className=" object-cover h-[85px] w-[85px] rounded-full"
              />
            ) : (
             <img src={user.profileImage.url} className="h-[85px] w-[85px] rounded-full"/>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
            />
            <span className=" text-[#757575]">Upload Photo</span>
          </div>

          <Input
            name="name"
            type="text"
            label="Name"
            placeholder="Enter your full name"
            id="name"
            value={formInput.name}
            onChange={handleInputChange}
            className="bg-[#D5D5D5] text-[#A6A6A6]"
          />
          <div className="mb-12 ">
            <select
              className="p-4   w-full bg-[#D5D5D5] rounded-[10px]"
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
        <div className="flex justify-center mt-5 gap-4">
          
          <a href="" onClick={handleLogout}>
          <img src="./assets/img/signout.png" alt="logout-icon" />
          </a>
          <span className="text-[#DD0000]">Log  Out</span>
      
         
        </div>
      </div>
    </div>
  );
};

export default Profile;
