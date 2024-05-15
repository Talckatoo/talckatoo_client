import FetchLatestMessages from "../../util/FetchLatestMessages";
import { getContactName } from "../../util/getContactName";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { FaPlusCircle } from "react-icons/fa";
import { useAddFriendMutation } from "../../redux/services/UserApi";
import { setAuth } from "../../redux/features/user/authSlice";
import { MdPending } from "react-icons/md";

interface FriendProps {
  user: any;
  key: string;
  isDarkMode: boolean;
  selected: boolean;
  socket: any;
  search: string;
}

const Friend = ({
  user,
  key,
  isDarkMode,
  selected,
  socket,
  search,
}: FriendProps) => {
  const { onlineFriends } = useAppSelector((state) => state.socket);
  const conversationState = useAppSelector((state) => state.conversation);
  const { user: userData } = useAppSelector((state) => state.auth);
  const [addFriend, { isLoading }] = useAddFriendMutation();

  const dispatch = useAppDispatch();

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const HandleSendFriendRequest = async (friendId: string) => {
    try {
      const response = await addFriend({ identifier: friendId }).unwrap();
      if ("message" in response) {
        if (response.message === "Friend request sent successfully") {
          socket.current.emit("sendFriendRequest", {
            profileImage: userData?.profileImage?.url,
            from: userData?._id,
            to: friendId,
            friendRequest: response.friendRequest,
          });
          dispatch(
            setAuth({
              ...userData,
              friendRequests: [...userData.friendRequests, friendId],
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative overflow-hidden" key={key}>
      {selected && (
        <div
          className={`absolute top-0 left-0 h-full w-2 ${
            isDarkMode ? "bg-white" : "bg-secondary-500"
          } p-1`}
        ></div>
      )}

      <div
        className={`h-full flex items-center py-4 px-4
      ${
        selected
          ? ` ${isDarkMode ? "bg-[#282828] pl-8" : "bg-[#F5F5F5] pl-8"}`
          : "bg-transparent"
      }
      `}
      >
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center"
            style={{
              backgroundImage: `url(${
                user?.profileImage?.url || "/assets/icons/user.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          {getContactName(user.userName, onlineFriends)}
        </div>
        {/* Column 2: Title and Text */}
        <div className="flex-grow px-3 w-full ">
          <div className="flex items-center ">
            <p
              className={`mr-2 font-bold text-base ${
                isDarkMode ? "text-white" : "text-black"
              } line-clamp-1`}
            >
              {user.userName}
            </p>
          </div>
          <div className="relative">
            {user?.conversation?.unread?.includes(userData?._id) &&
              user?._id !== selectedId && (
                <div
                  className={`min-w-5 absolute right-1 top-[-0.5rem] w-5 min-h-5 h-5 rounded-full bg-red-500 flex justify-center items-center text-xs animate-pulse ${
                    isDarkMode ? "text-white" : "text-white "
                  }`}
                />
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
        {search?.length > 0
          ? !userData?.friends
              ?.map((friend: any) => friend._id)
              .includes(user?._id) &&
            (!userData?.friendRequests?.includes(user?._id) ? (
              <FaPlusCircle
                className="absolute right-8 top-[1.2rem] text-[28px] text-selected-friend-dark "
                onClick={() => HandleSendFriendRequest(user?._id)}
              />
            ) : (
              // pending friend request
              <MdPending className="absolute right-8 top-[1.2rem] text-[28px] text-selected-friend-dark " />
            ))
          : null}
      </div>

      {/* Line Divider */}
      <div
        className={`absolute bottom-0 left-4 border-t ${
          isDarkMode
            ? "border-[#979797] border-opacity-20"
            : "border-black opacity-50"
        } w-[90%]`}
      ></div>
    </div>
  );
};

export default Friend;
