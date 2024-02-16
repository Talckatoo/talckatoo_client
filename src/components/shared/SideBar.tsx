import React, { useContext, useEffect, useState } from "react";
import { IoPersonSharp, IoSearch } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Friend from "./Friend";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setConversation } from "../../redux/features/conversation/conversationSlice";
import {
  setRecipient,
  setRecipientProfileImage,
  setRequests,
  setUsers,
} from "../../redux/features/user/userSlice";
import { UserContext } from "../../context/user-context";
import {
  useFetchAllRequestsQuery,
  useSearchuserMutation,
} from "../../redux/services/UserApi";
import { PiChatTextFill } from "react-icons/pi";
import { RiSettings5Fill } from "react-icons/ri";
import FriendRequest from "./FriendRequest";
import { setRequest } from "../../redux/features/user/requestSlice";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import LeftSideBar from "./LeftSideBar";

const SideBar = ({ socket, refetch }: { socket: any; refetch: any }) => {
  const [search, setSearch] = useState("");
  const { isDarkMode } = useContext(UserContext);
  const { users } = useAppSelector((state) => state.user);
  const { user } = useAppSelector((state) => state.auth);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const conversationState = useAppSelector((state) => state.conversation);
  const [showRequest, setShowRequest] = useState(false);
  const { requests } = useAppSelector((state) => state.user);
  const [allUser, setAllUser] = useState<any[]>([]);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const [searchuser] = useSearchuserMutation();
  // get all requests
  const { data: requestsData, refetch: refetchFriendsRequest } =
    useFetchAllRequestsQuery(null) as any;

  useEffect(() => {
    if (requestsData) {
      dispatch(setRequests(requestsData?.friendRequests));
    }
  }, [requestsData]);

  useEffect(() => {
    if (users) {
      setAllUser(users?.contactedUsers?.concat(users?.uncontactedUsers));
    }
  }, [users]);

  const dispatch = useAppDispatch();

  const SearchForUser = async () => {
    try {
      const response = await searchuser({ identifier: search }).unwrap();
      if ("seachedUser" in response) setSearchData([response.seachedUser]);
      else alert("User not found");
    } catch (error) {
      console.log(error);
      setSearchData([]);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (search.length > 0) SearchForUser();
    else setSearchData([]);
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

    dispatch(setRecipient(u?.userName as any));
  };

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
      <LeftSideBar
        showSetting={false}
        showRequest={showRequest}
        setShowRequest={setShowRequest}
        showRandom={false}
      />
      {/*Second column */}
      <div className="w-4/5 overflow-y-auto ">
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

        {!showRequest ? (
          <div>
            {usersData
              ? usersData?.map((user: any) => (
                  <div key={user._id} onClick={() => handleSelectContact(user)}>
                    <Friend
                      key={user.id}
                      user={user}
                      isDarkMode={isDarkMode}
                      selected={selectedId === user._id}
                      socket={socket}
                    />
                  </div>
                ))
              : null}
          </div>
        ) : (
          <div>
            {requests?.filter(
              (r: any) => r.status === "pending" && r.to._id === user._id
            ).length > 0 && (
              <div className="flex items-center justify-center text-2xl font-bold text-gray-600">
                Friend Requests
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

            <div className="flex items-center justify-center text-2xl font-bold text-gray-600 mt-8">
              Friends
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
