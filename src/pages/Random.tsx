import { SetStateAction, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { PiChatTextFill } from "react-icons/pi";
import { RiSettings5Fill } from "react-icons/ri";
import Lottie from "lottie-react";
import animationData from "../json/Animation - 1707255253148.json";
import RandomChat from "../components/RandomChat/RandomChat";
import LeftSideBar from "../components/shared/LeftSideBar";
import Button from "../UI/Button";

interface Socket {
  current: any;
}

const Random = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);
  const [isLooking, setIsLooking] = useState(false);
  const [randomData, setRandomData] = useState<any>();
  const [conversationRandomId, setConversationRandomId] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleCancel = async () => {
    setIsLooking(false);

    socket?.current?.emit("leaveRandomChat", {
      conversationId: randomData?._id,
      socketId: socket.current.id,
    });
  };

  const joinRandomChat = () => {
    setIsLooking(true);
    const data = {
      userName: user.userName,
      url: user?.profileImage?.url,
      language: user.language,
      id: user._id,
      email: user.email,
    };
    try {
      socket?.current?.emit("joinRandomChat", data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const join = urlParams.get("join");

    if (join || isLooking) {
      joinRandomChat();
    }
  }, [isLooking]);

  useEffect(() => {
    if (randomData && isLooking) {
      const timeoutId = setTimeout(() => {
        handleCancel();
        alert("No one is available to chat right now");
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [randomData, isLooking]);

  useEffect(() => {
    const handleRandomResult = (data: any) => {
      setRandomData(data);
      console.log(data);
      if (data.user2.id) {
        setIsLooking(false);
        setIsChatOpen(true);
      }
      setConversationRandomId(data._id);
    };

    if (socket.current) {
      socket.current.on("randomResult", handleRandomResult);
    }

    return () => {
      if (socket.current) {
        socket.current.off("randomResult");
      }
    };
  }, [socket.current]);

  const navigateChat = () => {
    navigate("/chat");
  };

  return (
    <div
      className={`flex flex-1 justify-center items-center  w-full h-full ${
        isDarkMode ? "bg-slate-950" : ""
      }`}
    >
      {/*Left sidebar */}
      <LeftSideBar
        showSetting={false}
        showRequest={false}
        setShowRequest={navigateChat}
        showRandom={true}
      />

      {isLooking ? (
        <div className="flex flex-1 h-[100vh] w-full  overflow-hidden flex-grow bg-white">
          <div className="flex flex-col justify-center w-full items-center">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: 500, height: 500 }}
            />
            <p className="text-center text-[35px] font-bold max-md:px-4  max-w-[768px] text-black">
              Looking for a random chat
            </p>
            <Button
              type="button"
              onClick={() => handleCancel()}
              className="bg-secondary-500 hover:bg-primary-600 text-white font-bold py-2 px-8 rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        !isChatOpen && (
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
                <Button
                  type="button"
                  onClick={() => setIsLooking(true)}
                  className="bg-secondary-500 hover:bg-primary-600 text-white font-bold py-2 px-8 rounded-xl"
                >
                  Join Random Chat
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      {isChatOpen && (
        <div className=" w-full h-fullflex flex-col ">
          <RandomChat
            randomData={randomData}
            conversationRandomId={conversationRandomId}
            socket={socket}
            setIsChatOpen={setIsChatOpen}
          />
        </div>
      )}
    </div>
  );
};

export default Random;
