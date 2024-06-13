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
import NavBarRandom from "../navbar/NavBarRandom";
import { setRandom } from "../redux/features/socket/socketSlice";
import { useTranslation } from "react-i18next";
import { tab } from "../components/shared/SideBar";

interface Socket {
  current: any;
}

const Random = ({ socket }: { socket: Socket }): JSX.Element => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState("");

  const { random } = useAppSelector((state) => state.socket);
  const handleSetButtonSelected = (buttonSelected: string) => {
    navigate("/chat", { state: { buttonSelected } });
  };

  const navigate = useNavigate();

  const handleCancel = () => {
    dispatch(
      setRandom({
        islooking: false,
      })
    );

    socket?.current?.emit("leaveRandomChat", {
      conversationId: random.randomData?._id,
      socketId: socket.current.id,
    });
  };

  const joinRandomChat = () => {
    dispatch(
      setRandom({
        islooking: true,
      })
    );
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

  const urlParams = new URLSearchParams(window.location.search);
  const join = urlParams.get("join");

  useEffect(() => {
    if (join === "true") {
      dispatch(
        setRandom({
          islooking: true,
        })
      );
    }
  }, [join]);

  useEffect(() => {
    if (random.islooking === true) {
      joinRandomChat();
    }
  }, [random.islooking]);

  useEffect(() => {
    if (random.randomData && random.islooking) {
      const timeoutId = setTimeout(() => {
        handleCancel();
        alert("No one is available to chat right now");
      }, 1000 * 60 * 5);
      return () => clearTimeout(timeoutId);
    }
  }, [random.randomData, random.islooking]);

  useEffect(() => {
    const handleRandomResult = (data: any) => {
      dispatch(
        setRandom({
          randomData: data,
          isChatOpen: false,
          islooking: true,
        })
      );
      if (data?.user2?.id) {
        dispatch(
          setRandom({
            randomData: data,
            conversationRandomId: data._id,
            isChatOpen: true,
            islooking: false,
          })
        );
      }
    };

    if (socket.current) {
      socket.current.on("randomResult", handleRandomResult);
      socket.current.on("leaveRandomChat", () => {
        dispatch(
          setRandom({
            randomData: null,
            conversationRandomId: "",
            isChatOpen: false,
            islooking: false,
          })
        );
      });
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

  const leaveRandomChat = () => {
    dispatch(
      setRandom({
        randomData: null,
        conversationRandomId: "",
        isChatOpen: false,
        islooking: false,
      })
    );
    socket?.current?.emit("leaveRandomChat", {
      randomData: random.randomData,
    });
  };

  const handleJoinRandomChat = () => {
    dispatch(
      setRandom({
        islooking: true,
      })
    );
  };
  return (
    <div
      className={`flex flex-1 flex-grow w-full h-full ${
        isDarkMode ? "bg-[#181818]" : ""
      }`}
    >
      {/*Left sidebar */}
      <LeftSideBar />

      {random.islooking === true ? (
        <div
          className={`flex flex-1 h-full w-full  overflow-hidden flex-grow ${
            isDarkMode ? "bg-[#181818]" : ""
          }`}
        >
          <div className="flex flex-col justify-center w-full items-center">
            <Lottie
              animationData={animationData}
              loop={true}
              style={{ width: 500, height: 500 }}
            />
            <p
              className={`text-center text-[35px] font-bold max-md:px-4  max-w-[768px] ${
                isDarkMode ? "text-white" : "text-black"
              } `}
            >
              {t("Looking for a random chat")}
            </p>
            <Button
              type="button"
              onClick={() => handleCancel()}
              className={`bg-secondary-500 hover:bg-primary-600 ${
                isDarkMode ? "bg-white text-black" : "bg-black text-white"
              } font-bold py-2 px-8 rounded-xl`}
            >
              {t("Cancel")}
            </Button>
          </div>
        </div>
      ) : (
        !random.isChatOpen && (
          <div className="mx-auto flex flex-col">
            <div className="flex justify-center items-center h-full ">
              <div className="flex flex-col justify-center items-center">
                <img
                  src={`${
                    isDarkMode
                      ? "/assets/img/Shapesde.png"
                      : "/assets/img/Shapes.png"
                  }`}
                  alt="shape"
                  className="fixed left-24 bottom-[-9rem] w-[40%] z-[1] "
                />
                <img
                  src={`${
                    isDarkMode
                      ? "/assets/img/Shapesd.png"
                      : "/assets/img/Shapes.png"
                  }`}
                  alt="shape"
                  className="fixed right-[2rem] top-16 w-[23%] z-[1] "
                />
                <img
                  className="m-auto"
                  src="/assets/img/people.svg"
                  alt="People"
                  width="600"
                  height="403"
                />
                <Button
                  type="button"
                  onClick={handleJoinRandomChat}
                  className="bg-secondary-500 hover:bg-primary-600 text-white font-bold py-2 px-8 rounded-xl"
                >
                  {t("Join Random Chat")}
                </Button>
              </div>
            </div>
          </div>
        )
      )}

      {random.isChatOpen && (
        <div className=" w-full h-full flex flex-col ">
          <NavBarRandom leaveRandomChat={leaveRandomChat} />
          <RandomChat
            randomData={random.randomData}
            conversationRandomId={random.conversationRandomId}
            socket={socket}
          />
        </div>
      )}
    </div>
  );
};

export default Random;
