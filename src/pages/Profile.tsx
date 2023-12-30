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

  const handleNameUpdate = (e: any) => {
    setName(e.target.value);
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
      updateProfile({ response: { data: { media: { url: "" } } } });
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
      className={`flex flex-1 justify-center items-center h-full ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      <div className="flex justify-center items-center">
        <form
          className="flex flex-col items-center rounded-2xl p-10 relative"
          style={{
            backgroundColor: isDarkMode ? "#111827" : "#F1F5F9",
            color: isDarkMode ? "#F1F5F9" : "#111827",
          }}
          onSubmit={handleSubmit}
        >
          <button
            className="absolute left-4 top-4 bg-transparent border-none"
            onClick={navigateChat}
          >
            <FaArrowLeft size={30} />
          </button>
          <h2
            className="mb-8 text-5xl"
            style={{
              marginRight: "180px",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Profile
          </h2>
          <div className="mb-6">
            <div className="relative w-48 h-48 rounded-full overflow-hidden mb-8">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  <FaPlus size={32} />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUpload}
              />
            </div>
            <div className="m-2">Current Username: {user?.userName}</div>
            <input
              type="text"
              placeholder="Update username"
              className={`w-96 px-5 py-2 mb-4 border-b-2 outline-none ${
                isDarkMode ? "bg-gray-800" : ""
              }`}
              style={{ color: isDarkMode ? "#fff" : "#000" }}
              value={name}
              onChange={handleNameUpdate}
            />
            <div className="m-2">Current Language: {user?.language}</div>
            <div className="mb-6 relative">
              <select
                className={`w-96 px-4 py-2 border-b-2 outline-none ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                } ${updateLanguage === "" ? "text-gray-600" : ""} ${
                  isDarkMode ? "text-white" : "text-black"
                } ${updateLanguage === "" ? "placeholder-gray-400" : ""}`}
                value={updateLanguage}
                onChange={(e) => setUpdateLanguage(e.target.value)}
              >
                <option value="" disabled hidden>
                  Update language
                </option>
                {languagesArray?.map(({ code, language }) => (
                  <option key={code} value={code}>
                    {language}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="bg-orange-50 text-gray-800 px-8 py-3 text-2xl w-96 mt-4 mb-4 rounded-full shadow-md transition-colors hover:bg-green-500 hover:text-white">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
