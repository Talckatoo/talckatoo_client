import { useContext, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Friend from "./Friend";
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
import FriendRequest from "./FriendRequest";
import LeftSideBar from "./LeftSideBar";
import { FaUserXmark } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next"; //TRANSLATION languages

const SideBar = ({
  socket,
  refetch,
  buttonSelected,
}: {
  socket: any;
  refetch: any;
  buttonSelected: string;
}) => {
  const { t } = useTranslation(); //TRANSLATION languages

  const [search, setSearch] = useState("");
  const { isDarkMode } = useContext(UserContext);
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const conversationState = useAppSelector((state) => state.conversation);
  const [showRequest, setShowRequest] = useState(
    buttonSelected === "friends" ? true : false
  );
  const { requests } = useAppSelector((state) => state.user);
  const [allUser, setAllUser] = useState<any[]>([]);

  const selectedId = conversationState?.conversation?.selectedId;

  const [searchuser] = useSearchuserMutation();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  // get all requests
  const { data: requestsData, refetch: refetchFriendsRequest } =
    useFetchAllRequestsQuery(null) as any;

  useEffect(() => {
    if (requestsData) {
      dispatch(setRequests(requestsData?.friendRequests));
    }
  }, [requestsData]);

  useEffect(() => {
    socket?.current?.on("getAcceptFriendRequest", () => {
      setSearch("");
    });
  }, [socket.current]);

  useEffect(() => {
    if (users) {
      setAllUser(users?.contactedUsers?.concat(users?.uncontactedUsers));
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [users]);

  const dispatch = useAppDispatch();

  const SearchForUser = async () => {
    try {
      const response = await searchuser({ identifier: search }).unwrap();
      if ("seachedUser" in response) {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        setSearchData([response.seachedUser]);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        alert("User not found");
      }
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      console.log(error);
      setSearchData([]);
    }
  };

  useEffect(() => {
    if (search.length > 0) {
      setIsLoading(true);
      SearchForUser();
    } else {
      setSearchData([]);
    }
  }, [search]);

  const handleSelectContact = (u: any) => {
    if (searchData.length > 0) return;
    setSelectedUser(u);
    dispatch(setRecipientProfileImage(u?.profileImage?.url as any));
    dispatch(
      setConversation({
        conversationId: u?.conversation?._id ?? null,
        selectedId: u?._id,
        language: u?.language,
      })
    );

    // set the conversation id and selected id and language in local storage
    localStorage.setItem("conversationId", u?.conversation?._id);
    localStorage.setItem("selectedId", u?._id);
    localStorage.setItem("language", u?.language);

    dispatch(setRecipient(u?.userName as any));
  };

  useEffect(() => {
    setUsersData(
      (searchData.length && search.length) > 0
        ? searchData
        : !searchData.length && !search.length
        ? users?.contactedUsers
        : []
    );
  }, [searchData, users]);

  return (
    <div
      className={`w-2/6 min-w-[350px] h-full flex shadow-blur z-10 ${
        isDarkMode ? "bg-[#181818]" : "bg-white"
      }`}
    >
      {/*First column */}
      <LeftSideBar
        showSetting={false}
        showRequest={showRequest}
        setShowRequest={setShowRequest}
        showRandom={false}
      />
      {/*Second column */}
      <div className="w-full overflow-y-auto ">
        <div
          className={`my-4 ml-4 font-extrabold text-[20px] ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {t("chats")}
        </div>

        <div className="relative flex mx-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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

        {!showRequest ? (
          <div>
            {isLoading ? (
              <div className="h-full w-full flex flex-col items-center justify-center py-4 px-4 ">
                <FontAwesomeIcon
                  className="h-auto w-1/12"
                  icon={faSpinner}
                  spin
                />
                <p className={`w-full font-extrabold text-[20px] text-center flex justify-center ${ isDarkMode ?  "text-white" :  "text-secondary-500"} `}>
                  {t("Loading...")}
                </p>
              </div>
            ) : usersData.length > 0 ? (
              usersData?.map((user: any) => (
                <div key={user._id} onClick={() => handleSelectContact(user)}>
                  <Friend
                    key={user.id}
                    user={user}
                    isDarkMode={isDarkMode}
                    selected={selectedId === user._id}
                    socket={socket}
                    search={search}
                  />
                </div>
              ))
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center py-4 px-4 ">
                <FaUserXmark className={`w-1/12 h-auto text-secondary-500 animate__animated animate__headShake ${ isDarkMode ?  "text-white" :  "text-secondary-500"} `} />
                <p className={`w-full font-extrabold text-[20px] text-center ${ isDarkMode ?  "text-white" :  "text-secondary-500"} flex justify-center animate__animated animate__headShake`}>
                  {t("We didn't find any results")}
                </p>
                <p className={`w-full text-center flex justify-center animate__animated animate__headShake ${ isDarkMode ?  "text-white" :  "text-secondary-500"} `}>
                  {t(
                    "Make sure everything is spelled correctly or try different keywords"
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {requests?.filter(
              (r: any) => r.status === "pending" && r.to._id === user._id
            ).length > 0 && (
              <div className={`flex items-center justify-center text-2xl font-bold ${ isDarkMode ?  "text-white" :  "text-secondary-500"} `}>
                {t("Friend Requests")}
              </div>
            )}

            {requests
              ?.filter(
                (r: any) => r.status === "pending" && r.to._id === user._id
              )
              .map((request: any) => (
                <div key={request._id}>
                  <FriendRequest
                    key={request.id}
                    user={request}
                    isDarkMode={isDarkMode}
                    selected={selectedId === request._id}
                    socket={socket}
                    refetchFriendsRequest={refetchFriendsRequest}
                    refetch={refetch}
                  />
                </div>
              ))}

            <div className={`flex items-center justify-center text-2xl font-bold ${ isDarkMode ?  "text-white" :  "text-secondary-500"} `}>
              {t("Friends")}
            </div>
            {allUser
              ? allUser?.map((user: any) => (
                  <div key={user._id} onClick={() => handleSelectContact(user)}>
                    <Friend
                      key={user.id}
                      user={user}
                      isDarkMode={isDarkMode}
                      selected={selectedId === user._id}
                      socket={socket}
                      search={search}
                    />
                  </div>
                ))
              : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
