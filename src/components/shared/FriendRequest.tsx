import FetchLatestMessages from "../../util/FetchLatestMessages";
import { getContactName } from "../../util/getContactName";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PiBirdFill } from "react-icons/pi";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import {
  useActionFriendMutation,
  useAddFriendMutation,
} from "../../redux/services/UserApi";
import { setAuth } from "../../redux/features/user/authSlice";
import { MdPending } from "react-icons/md";
import { useEffect } from "react";
import { setRequest } from "../../redux/features/user/requestSlice";
import { setRequests, setUsers } from "../../redux/features/user/userSlice";

interface FriendProps {
  user: any;
  key: string;
  isDarkMode: boolean;
  selected: boolean;
  socket: any;
  refetchFriendsRequest: any;
  refetch: any;
}

const FriendRequest = ({
  user,
  key,
  isDarkMode,
  selected,
  socket,
  refetchFriendsRequest,
  refetch,
}: FriendProps) => {
  const { onlineFriends } = useAppSelector((state) => state.socket);
  const conversationState = useAppSelector((state) => state.conversation);
  const { user: userData } = useAppSelector((state) => state.auth);
  const { users } = useAppSelector((state) => state.user);
  const [addFriend, { isLoading }] = useAddFriendMutation();
  const { requests } = useAppSelector((state) => state.user);
  const [actionFriend, { isLoading: AcceptIsLoading }] =
    useActionFriendMutation();

  const dispatch = useAppDispatch();

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const HandleActionFriend = async (action: string) => {
    if (AcceptIsLoading) return;
    try {
      const response = await actionFriend({
        userId: userData?._id,
        friendRequestId: user?._id,
        action: action,
      }).unwrap();
      if ("message" in response) {
        if (
          response.message === "Friend request accepted successfully" ||
          response.message === "Friend request rejected successfully"
        ) {
          const newRequests = requests.filter(
            (request: any) => request._id !== user?._id
          );

          dispatch(setRequests(newRequests));

          if (action === "accept") {
            const conversationId = response?.from?.conversations?.find(
              (conversation: any) =>
                response?.to?.conversations?.includes(conversation)
            );
            socket.current.emit("acceptFriendRequest", {
              from: userData?._id,
              to: user?.from?._id,
              Userfrom: {
                ...response?.from,
                // find the conversation id between response?.from.conversations and response?.to.conversations
                conversationId: conversationId,
              },
              Userto: {
                ...response?.to,
                conversationId: conversationId,
              },
            });

            dispatch(
              setAuth({
                ...userData,
                friends: [
                  ...userData.friends,
                  {
                    _id: user?.from?._id,
                    userName: user?.userName,
                    profileImage: user?.profileImage,
                    conversation: {
                      _id: conversationId,
                    },
                    status: "accepted",
                  },
                ],
              })
            );

            dispatch(
              setUsers({
                ...users,
                uncontactedUsers: [
                  ...users.uncontactedUsers,
                  {
                    _id: response?.from?._id,
                    userName: response?.from?.userName,
                    profileImage: response?.from?.profileImage,
                    language: response?.from?.language,
                    conversation: {
                      _id: conversationId,
                    },
                  },
                ],
              })
            );
            // reload
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative overflow-hidden bg" key={key}>
      {selected && (
        <div
          className={`absolute top-0 left-0 h-full w-2 ${
            isDarkMode ? "bg-primary-500" : "bg-secondary-500"
          } p-1`}
        ></div>
      )}

      <div
        className={`h-full flex items-center py-4 px-4
      ${selected ? "bg-[#F5F5F5] pl-8" : "bg-transparent"}
      `}
      >
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center"
            style={{
              backgroundImage: `url(${user?.from?.profileImage?.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!user?.from?.profileImage?.url && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
        </div>
        {/* Column 2: Title and Text */}
        <div className="flex-grow px-3 w-full ">
          <div className="flex items-center ">
            <p
              className={`mr-2 font-bold text-base ${
                isDarkMode ? "text-white" : "text-black"
              } line-clamp-1`}
            >
              {user?.from?.userName}
            </p>
          </div>
          <div className="relative">
            {user?.conversation?.unread?.includes(userData?._id) &&
              user?._id !== selectedId && (
                <div className="min-w-5 absolute right-1 top-[-0.5rem] w-5 min-h-5 h-5 rounded-full bg-red-500 flex justify-center items-center text-white text-xs animate-pulse" />
              )}
          </div>

          <div className={`w-full`}>
            <FetchLatestMessages u={user?.latestMessage} />
          </div>
        </div>
        {/* Column 3: Red Circle */}
        <div className="flex-none relative pr-4 space-y-4">
          <div
            className={`text-md font-medium ${
              isDarkMode ? "text-white" : "text-black"
            } `}
          ></div>
        </div>
        {/* {!userData?.friends
          ?.map((friend: any) => friend._id)
          .includes(user?._id) &&
          // send friend request
          (!userData?.friendRequests?.includes(user?._id) ? (
            <FaPlusCircle
              className="absolute right-8 top-[1.2rem] text-[28px] text-selected-friend-dark "
              onClick={() => HandleSendFriendRequest(user?._id)}
            />
          ) : (
            // pending friend request
            <MdPending className="absolute right-8 top-[1.2rem] text-[28px] text-selected-friend-dark " />
          ))} */}
      </div>
      {!userData?.friendsRequest?.includes(user?._id) && (
        <div className="flex items-center justify-around mb-4">
          {AcceptIsLoading ? (
            <div className="flex items-center gap-2 font-semibold">
              <PiBirdFill className="text-primary-500 text-[22px] animate-spin" />
              Loading...
            </div>
          ) : (
            <div
              className="flex items-center  gap-2 font-semibold"
              onClick={() => HandleActionFriend("accept")}
            >
              <FaCheckCircle className="text-green-500 text-[22px]" />
              Accept
            </div>
          )}

          <div
            className="flex items-center  gap-2 font-semibold"
            onClick={() => HandleActionFriend("reject")}
          >
            <IoMdCloseCircle className="text-red-500 text-[22px]" />
            <span className={isDarkMode ? "text-white" : ""}>Decline</span>
          </div>
        </div>
      )}

      {/* Line Divider */}
      <div
        className={`absolute bottom-0 left-4 border-t ${
          isDarkMode
            ? "border-primary-500 border-opacity-20"
            : "border-black opacity-50"
        } w-[90%]`}
      ></div>
    </div>
  );
};

export default FriendRequest;
