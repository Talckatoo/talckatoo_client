import React, { useContext, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Friend from "./Friend";
import FriendRequest from "./FriendRequest";
import LeftSideBar from "./LeftSideBar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversation } from "../../redux/features/conversation/conversationSlice";
import {
  setRecipient,
  setRecipientProfileImage,
  setRequests,
} from "../../redux/features/user/userSlice";
import { UserContext } from "../../context/user-context";
import {
  useFetchAllRequestsQuery,
  useSearchuserMutation,
} from "../../redux/services/UserApi";
import { FaUserXmark } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const tab = {
  friends: "friends",
  chats: "chats",
  addFriends: "addFriends",
  random: "random",
  profile: "profile",
};

const SideBar = ({
  socket,
  refetch,
  buttonSelected,
  isLoading,
}: {
  socket: any;
  refetch: any;
  buttonSelected: string;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const { users, requests } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;

  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [allUser, setAllUser] = useState<any[]>([]);

  const [searchuser] = useSearchuserMutation();

  // Fetch all requests
  const { data: requestsData, refetch: refetchFriendsRequest } =
    useFetchAllRequestsQuery(null) as any;

  useEffect(() => {
    if (requestsData) {
      dispatch(setRequests(requestsData?.friendRequests));
    }
  }, [requestsData, dispatch]);

  useEffect(() => {
    socket?.current?.on("getAcceptFriendRequest", () => {
      setSearch("");
    });
  }, [socket.current]);

  useEffect(() => {
    if (users) {
      setAllUser(users?.contactedUsers?.concat(users?.uncontactedUsers));
    }
  }, [users]);

  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 1000);
  }, [error]);

  const searchForUser = async () => {
    try {
      const response = await searchuser({ identifier: search }).unwrap();

      if (response.seachedUser) {
        setSearchData([response.seachedUser]);
      }
    } catch (error) {
      setError(error.status);
      setSearchData([]);
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      searchForUser();
    } else {
      setSearchData([]);
    }
  }, [search]);

  const handleSelectContact = (user: any) => {
    setSelectedUser(user);
    dispatch(setRecipientProfileImage(user?.profileImage?.url));
    dispatch(
      setConversation({
        conversationId: user?.conversation?._id ?? null,
        selectedId: user?._id,
        language: user?.language,
      })
    );

    localStorage.setItem("conversationId", user?.conversation?._id);
    localStorage.setItem("selectedId", user?._id);
    localStorage.setItem("language", user?.language);

    dispatch(setRecipient(user?.userName));
  };

  useEffect(() => {
    setUsersData(
      searchData.length > 0 && search !== ""
        ? searchData
        : !searchData.length && !search.length
        ? users?.contactedUsers
        : []
    );
  }, [searchData, users, search]);


  const handleSearchInChat = (e: any) => {
    setSearch(e.target.value);
  };

  const renderFriendRequests = () => (
    <>
      {requests?.filter(
        (r: { status: string; to: { _id: any } }) =>
          r.status === "pending" && r.to._id === user._id
      ).length > 0 && (
        <div
          className={`flex items-center justify-center text-2xl font-bold ${
            isDarkMode ? "text-white" : "text-secondary-500"
          }`}
        >
          {t("Friend Requests")}
        </div>
      )}

      {requests
        ?.filter(
          (r: { status: string; to: { _id: any } }) =>
            r.status === "pending" && r.to._id === user._id
        )
        .map((request: any) => (
          <div key={request._id}>
            <FriendRequest
              key={request._id}
              user={request}
              isDarkMode={isDarkMode}
              selected={selectedId === request._id}
              socket={socket}
              refetchFriendsRequest={refetchFriendsRequest}
              refetch={refetch}
            />
          </div>
        ))}

      {allUser?.map((user: any) => (
        <div key={user._id} onClick={() => handleSelectContact(user)}>
          <Friend
            key={user._id}
            user={user}
            isDarkMode={isDarkMode}
            selected={selectedId === user._id}
            socket={socket}
            search={search}
          />
        </div>
      ))}
    </>
  );

  const renderChatUsers = () => (
    <>
      {isLoading && (
        <div className="h-full w-full flex flex-col items-center justify-center py-4 px-4 ">
          <FontAwesomeIcon className="h-auto w-1/12" icon={faSpinner} spin />
          <p
            className={`w-full font-extrabold text-[20px] text-center ${
              isDarkMode ? "text-white" : "text-secondary-500"
            }`}
          >
            {t("Loading...")}
          </p>
        </div>
      )}

      {usersData &&
        usersData.map((user: any) => (
          <div key={user._id} onClick={() => handleSelectContact(user)}>
            <Friend
              key={user._id}
              user={user}
              isDarkMode={isDarkMode}
              selected={selectedId === user._id}
              socket={socket}
              search={search}
            />
          </div>
        ))}
      {users?.length === 0 && !isLoading && (
        <div className="h-full w-full flex flex-col items-center justify-center py-4 px-4 ">
          <FaUserXmark
            className={`w-1/12 h-auto text-secondary-500 animate__animated animate__headShake ${
              isDarkMode ? "text-white" : "text-secondary-500"
            }`}
          />
          <p
            className={`w-full font-extrabold text-[20px] text-center ${
              isDarkMode ? "text-white" : "text-secondary-500"
            } animate__animated animate__headShake`}
          >
            {t("We didn't find any results")}
          </p>
          <p
            className={`w-full text-center ${
              isDarkMode ? "text-white" : "text-secondary-500"
            } animate__animated animate__headShake`}
          >
            {t(
              "Make sure everything is spelled correctly or try different keywords"
            )}
          </p>
        </div>
      )}
    </>
  );

  const { selectedTab } = useAppSelector((state) => state.auth);

  return (
    <div
      className={`w-2/6 min-w-[350px] h-full flex shadow-blur z-10 ${
        isDarkMode ? "bg-[#181818]" : "bg-white"
      }`}
    >
      <LeftSideBar />
      <div className="w-full overflow-y-auto">
        <div
          className={`my-4 ml-4 font-extrabold text-[20px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {selectedTab === tab.chats && t("Chats")}
          {selectedTab === tab.friends && t("Friends")}
          {selectedTab === tab.addFriends && t("Add Friends")}
        </div>
        {selectedTab === tab.addFriends && (
          <div className="relative flex mx-4">
            <input
              type="text"
              value={search}
              onChange={handleSearchInChat}
              className={`${
                isDarkMode ? "bg-[#282828]" : "bg-secondary-500"
              } pl-12 text-white rounded-xl focus:outline-none focus:border-0 focus:ring-[3px] focus:ring-blue border-0 placeholder-white::placeholder`}
              placeholder={t("Search")}
            />
            <IoSearch
              className={`absolute left-3 top-3 ${
                isDarkMode ? "text-white" : "text-white"
              }`}
              size={24}
            />
          </div>
        )}
        {selectedTab === tab.addFriends
          ? renderChatUsers()
          : renderFriendRequests()}

        {error && (
          <div className="flex items-start mt-[5rem] justify-center h-full w-full">
            <p
              className={`font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("This user does not exist")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
