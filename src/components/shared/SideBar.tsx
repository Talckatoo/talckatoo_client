import React, { useContext, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import Friend from "./Friend";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversation } from "../../redux/features/conversation/conversationSlice";
import {
  setRecipient,
  setRecipientProfileImage,
} from "../../redux/features/user/userSlice";
import { UserContext } from "../../context/user-context";

const SideBar = () => {
  const [filterValue, setFilterValue] = useState("");
  const { isDarkMode } = useContext(UserContext);
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const conversationState = useAppSelector((state) => state.conversation);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const dispatch = useAppDispatch();

  const handleSelectContact = (u: any) => {
    console.log(u);
    setSelectedUser(u);
    dispatch(setRecipientProfileImage(u.profileImage?.url as any));
    dispatch(
      setConversation({
        conversationId: u.conversation._id,
        selectedId: u._id,
        language: u.language,
      })
    );

    dispatch(setRecipient(u.userName as any));
  };

  useEffect(() => {
    dispatch(
      setConversation({
        conversationId: selectedUser?.conversation?._id,
        selectedId: selectedUser?._id,
        language: selectedUser?.language,
      })
    );

    dispatch(setRecipient(selectedUser?.userName as any));
  }, [selectedUser]);

  return (
    <div
      className={`w-2/6 min-w-[350px] h-full flex shadow-sm ${
        isDarkMode ? "bg-sidebar-dark-500" : "bg-white"
      }`}
    >
      {/*First column */}
      <div className="w-[89px] min-w-[89px] border-r pt-5 border-opacity-20 grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem]">
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
          <div className="mx-2 pb-2 flex items-center justify-center flex-col rounded-full overflow-hidden">
            <img
              src={`${user?.profileImage.url}`}
              className="h-16 w-16 object-cover rounded-full"
              alt="Profile-picture"
            />
          </div>
        </div>
      </div>

      {/*Second column */}
      <div className="w-4/5">
        <div
          className={`my-4 ml-4 font-extrabold text-[20px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Chats
        </div>

        <div className="relative flex mx-4">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className={`${
              isDarkMode ? "bg-input-bg-dark" : "bg-secondary-500"
            } pl-12 text-white rounded-xl focus:outline-none focus:border-0 focus:ring-[3px] focus:ring-blue border-0 placeholder-white::placeholder`}
            placeholder="Search"
          />
          <IoSearch
            className={`absolute left-3 top-3 ${
              isDarkMode ? "text-sidebar-dark-500" : "text-white"
            }`}
            size={24}
          />
        </div>

        <div>
          {users
            ? users?.contactedUsers?.map((user: any) => (
                <div key={user._id} onClick={() => handleSelectContact(user)}>
                  <Friend
                    key={user.id}
                    user={user}
                    lastMsg={user?.latestMessage}
                    isDarkMode={isDarkMode}
                    selected={selectedId === user._id}
                    img={user.profileImage?.url}
                    title={user.userName}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
