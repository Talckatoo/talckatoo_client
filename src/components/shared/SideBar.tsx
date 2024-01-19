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
import { useSearchuserMutation } from "../../redux/services/UserApi";

const SideBar = () => {
  const [search, setSearch] = useState("");
  const { isDarkMode } = useContext(UserContext);
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const conversationState = useAppSelector((state) => state.conversation);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const [searchuser, { loading: isLoading }] = useSearchuserMutation();

  const dispatch = useAppDispatch();

  const SearchForUser = async () => {
    try {
      const response = await searchuser({ identifier: search }).unwrap();
      console.log(response);
      if ("seachedUser" in response) setSearchData([response.seachedUser]);
      else alert("User not found");
    } catch (error) {
      console.log(error);
      setSearchData([]);
    }
  };

  useEffect(() => {
    SearchForUser();
  }, [search]);

  const handleSelectContact = (u: any) => {
    if (
      searchData.length > 0 &&
      !user.friends?.map((f: any) => f._id).includes(u._id)
    )
      return;
    console.log(u);
    setSelectedUser(u);
    dispatch(setRecipientProfileImage(u?.profileImage?.url as any));
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

  useEffect(() => {
    setUsersData(searchData.length > 0 ? searchData : users?.contactedUsers);
  }, [searchData, users]);

  return (
    <div
      className={`w-2/6 min-w-[350px] h-full flex shadow-sm z-10 ${
        isDarkMode ? "bg-sidebar-dark-500" : "bg-white"
      }`}
    >
      {/*First column */}
      <div className="w-[80px] min-w-[80px] border-r pt-5 border-opacity-20 grid grid-cols-1 gap-1 content-between h-full p-1 mb-[2rem]">
        <div className="flex flex-col  gap-3 w-full">
          <div
            className={`${
              isDarkMode ? "bg-primary-500" : "bg-secondary-500"
            } mx-2 rounded-[12px]  flex items-center justify-center flex-col`}
          >
            <img
              src="./src/assests/comment_duotone.svg"
              className=" top-1 right-4 z-4 object-contain py-1 w-[29px]"
            />
          </div>
          <div className="relative border-[1px] border-secondary-500 mx-2 rounded-[12px] flex items-center justify-center flex-col">
            <img
              src={`./src/assests/${
                isDarkMode ? "User_alt_fill_dark.svg" : "User_alt_fill.svg"
              }`}
              className="z-4 object-contain py-1 w-[29px]"
            />
            {/* <div
              className="absolute top-[75%] left-[80%] w-4 h-4 bg-red-badge-500 rounded-full text-white flex items-center justify-center"
              style={{
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
                fontSize: "0.6rem",
                fontWeight: "bold",
              }}
            >
              15
            </div> */}
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
              className=" top-1 right-4 z-4 object-contain py-[6px] w-[25px]"
            />
          </div>
          <div className="mx-2 pb-2 mb-[1rem] flex items-center justify-center flex-col rounded-full overflow-hidden">
            <img
              src={`${user?.profileImage?.url}`}
              className="h-14 w-14 object-cover rounded-full"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
          {usersData
            ? usersData?.map((user: any) => (
                <div key={user._id} onClick={() => handleSelectContact(user)}>
                  <Friend
                    key={user.id}
                    user={user}
                    isDarkMode={isDarkMode}
                    selected={selectedId === user._id}
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
