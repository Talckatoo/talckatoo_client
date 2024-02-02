import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { PiChatTextFill } from "react-icons/pi";
import { RiSettings5Fill } from "react-icons/ri";

interface Socket {
  current: any;
}

const Random = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);
  const [isLooking, setIsLooking] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navigateChat = () => {
    navigate("/chat");
  };

  const handleJoinChat = () => {
    setIsLooking(true);
    const data = {
      userName: user.userName,
      url: user?.profileImage?.url,
      language: user.language,
    };
    try {
      socket?.current?.emit("joinRandomChat", data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket?.current?.on("randomResult", (data) => {
      console.log(data);
    });
    return () => {
      socket?.current?.disconnect();
    };
  }, [socket.current]);

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

      <div className="mx-auto flex flex-col">
        <div className="flex justify-center items-center h-full ">
          <div className="flex flex-col justify-center items-center">
            <img
              className="m-auto"
              src="/assets/img/people.svg"
              alt="People"
              width="600"
              height="403"
            />
            <button
              onClick={handleJoinChat}
              className="text-center max-md:px-4  max-w-[768px] text-black"
            >
              Join Random Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Random;
