import React, { useContext, useEffect } from "react";
import TextToSpeech from "../TextToSpeech";
import { getTime } from "../../util/getTime";
import { MdDownload } from "react-icons/md";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import ChatInput from "../ChatInput";
import { toast } from "react-toastify";
import { UserContext } from "../../context/user-context";

const RandomChat = ({
  randomData,
  conversationRandomId,
  socket,
  setIsChatOpen,
}: {
  randomData: any;
  conversationRandomId: string;
  socket: any;
  setIsChatOpen: any;
}): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = React.useState<any>([]);
  const scrollRefBottom = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const { isDarkMode } = useContext(UserContext);

  const [typing, setTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  // get socket id from randomData
  const [socketId, setSocketId] = React.useState("");
  const [UserData, setUserData] = React.useState<any>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (randomData) {
      if (randomData.user2.id === user._id) {
        setSocketId(randomData.user1.socketId);
        setUserData(randomData.user1);
      } else {
        setSocketId(randomData.user2.socketId);
        setUserData(randomData.user2);
      }
    }
  }, [randomData]);

  const handleSendMessage = (message: string) => {
    const data = {
      message,
      conversationRandomId,
      sender: user?._id,
      socketId: socketId,
      language: UserData.language,
    };
    socket.current.emit("sendRandomMessage", data);

    // setMessages((prev: any) => [
    //   ...prev,
    //   {
    //     message,
    //     createdAt: new Date(),
    //     sender: user?._id,
    //   },
    // ]);
  };

  const sendAIMessage = (message: string) => {
    const data = {
      message,
      conversationRandomId,
      sender: import.meta.env.VITE_AI_ASSISTANT_ID,
      socketId: socketId,
    };
    socket.current.emit("sendRandomMessage", data);

    // setMessages((prev: any) => [
    //   ...prev,
    //   {
    //     message,
    //     createdAt: new Date(),
    //     sender: import.meta.env.VITE_AI_ASSISTANT_ID,
    //   },
    // ]);
  };

  const onHandleTranslateText = (text: string, targetLanguage: string) => {
    const data = {
      text,
      targetLanguage,
    };
    socket.current.emit("translateText", data);
  };

  const onHandleSendFile = async (fileId: string, media: any) => {
    try {
      socket.current.emit("sendRandomMessage", {
        createdAt: new Date(),
        sender: user?._id,
        to: randomData?.user2?.id,
        targetLanguage: randomData?.user2?.language,
        media: {
          url: media.url,
          type: media.type,
          altText: media.altText,
        },
        status: false,
        socketId: socketId,
      });

      // setMessages((prev: any) => [
      //   ...prev,
      //   {
      //     media: {
      //       url: media.url,
      //       type: media.type,
      //       altText: media.altText,
      //     },
      //     createdAt: new Date(),
      //     sender: user?._id,
      //   },
      // ]);
    } catch (err) {
      toast.error("Error sending messages, please try again");
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("getRandomMessage", (data: any) => {
        // add the new message to the state
        setMessages((prev: any) => [...prev, data]);
      });
    }
  }, [socket.current]);

  return (
    <div
      className={`w-full h-full flex flex-col ${
        isDarkMode ? "bg-sidebar-dark-500" : "bg-white"
      }`}
    >
      <div className="relative h-full">
        <div className="flex flex-col shadow-sm border-l border-opacity-20 h-full ">
          <div className="w-full flex flex-col h-full">
            <img
              src="/assets/img/Shapes.png"
              alt="shape"
              className="fixed left-24  -bottom-14 w-[40%] z-[1] "
            />
            <img
              src="/assets/img/Shape.png"
              alt="shape"
              className="fixed right-[2rem]  -top-16 w-[23%] z-[1] "
            />
            <div className="relative min-h-[80vh]   z-[5] ">
              <div
                ref={scrollRef}
                className="overflow-y-auto overflow-x-hidden w-full   absolute top-0 left-0 right-0 bottom-0  m-auto"
              >
                <div className="m-2 p-2 ">
                  {messages
                    ? messages.map((msg: any) => (
                        <div
                          className={
                            "" +
                            (msg.sender === user?._id ? " mb-6" : "") +
                            (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID
                              ? "text-center "
                              : "")
                          }
                          key={msg._id}
                        >
                          <div
                            className={
                              "flex items-end" +
                              (msg.sender === user?._id
                                ? " flex text-right w-full justify-end items-end"
                                : "")
                            }
                          >
                            <div
                              className={
                                "w-auto max-w-[50%] inline-block m-2 p-4 " +
                                (msg.sender === user?._id &&
                                msg.sender !==
                                  import.meta.env.VITE_AI_ASSISTANT_ID
                                  ? " bg-[#F5F5F5] h-full text-right text-[#000] rounded-t-[20px] rounded-bl-[20px]"
                                  : msg.sender !==
                                    import.meta.env.VITE_AI_ASSISTANT_ID
                                  ? "bg-[#25282C] text-left text-white  rounded-t-[20px] rounded-br-[20px]"
                                  : "bg-[#FEF3C7] text-center mx-auto rounded-[20px]")
                              }
                            >
                              {msg.sender !==
                                import.meta.env.VITE_AI_ASSISTANT_ID &&
                              msg.message &&
                              msg.message.includes("\n") ? (
                                msg.message
                                  .split("\n")
                                  .map((line, index, lines) => {
                                    const prevLine =
                                      index > 0 ? lines[index - 1] : null;
                                    const isFirstLine =
                                      index === 0 || line !== prevLine;

                                    return (
                                      <React.Fragment key={index}>
                                        {isFirstLine && line}
                                        {isFirstLine &&
                                          index !== lines.length - 1 &&
                                          line !== lines[index + 1] && (
                                            <>
                                              <br className=" mx-auto" />
                                              <div className="h-1 border-b border-gray-600 my-1"></div>
                                            </>
                                          )}
                                      </React.Fragment>
                                    );
                                  })
                              ) : (
                                <>{msg.message}</>
                              )}

                              {msg.voiceNote && (
                                <audio className="w-[150px] h-15" b- controls>
                                  <source
                                    src={msg.voiceNote?.url}
                                    type="audio/mpeg"
                                  />
                                </audio>
                              )}
                              {msg.media &&
                                (msg.media.type === "image" ? (
                                  <div className="relative">
                                    <img
                                      src={msg.media.url}
                                      alt="media"
                                      className="w-60 h-60 object-contain"
                                    />
                                    <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                                      <Link to={msg.media.url} download>
                                        <MdDownload className="text-[24px] text-black" />
                                      </Link>
                                    </div>
                                  </div>
                                ) : msg.media.type === "video" ? (
                                  <div className="relative">
                                    <video
                                      src={msg.media.url}
                                      className="w-60 h-60"
                                      controls
                                    />
                                    <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
                                      <Link to={msg.media.url} download>
                                        <MdDownload className="text-[24px] text-black" />
                                      </Link>
                                    </div>
                                  </div>
                                ) : msg.media.type === "audio" ? (
                                  <audio className="w-60 h-15 " controls>
                                    <source
                                      src={msg.media.url}
                                      type="audio/mpeg"
                                    />
                                  </audio>
                                ) : (
                                  <div className=" flex items-center w-[240px]">
                                    <Link
                                      to={msg.media.url}
                                      download
                                      className="flex w-full items-center justify-between"
                                    >
                                      <div className="flex items-center gap-3 minw-w-[25px]">
                                        <FaFile className="text-[25px]" />
                                        <p className="text-xs">
                                          {msg.media.altText}
                                        </p>
                                      </div>

                                      <MdDownload className="text-[35px] min-w-[35px] text-black bg-white p-2 rounded-full shadow-md" />
                                    </Link>
                                  </div>
                                ))}
                              <div className="flex justify-between items-center relative pt-4">
                                <div
                                  className={
                                    "  items-end" +
                                    (msg.sender === user?._id &&
                                    msg.sender !==
                                      import.meta.env.VITE_AI_ASSISTANT_ID
                                      ? "text-black text-[10px]"
                                      : msg.sender !==
                                        import.meta.env.VITE_AI_ASSISTANT_ID
                                      ? "text-white text-[10px]"
                                      : "text-black text-[10px]")
                                  }
                                >
                                  {getTime(msg.createdAt)}
                                </div>

                                <TextToSpeech
                                  convertedText={msg.message}
                                  me={msg.sender === user?._id}
                                  ai={
                                    msg.sender ===
                                    import.meta.env.VITE_AI_ASSISTANT_ID
                                  }
                                />
                              </div>
                            </div>

                            {/* {msg.voiceNote && (
                <audio className="w-60 h-15" controls>
                  <source
                    src={msg.voiceNote?.url}
                    type="audio/mpeg"
                  />
                </audio>
              )} */}

                            {/* {msg.sender !==
                import.meta.env.VITE_AI_ASSISTANT_ID && (
                <img
                  src={
                    msg.sender === user?._id
                      ? `${user?.profileImage.url}`
                      : `${recipientPi}`
                  }
                  className=" w-[36px] h-[36px] rounded-full border border-[#E9E9EF]"
                />
              )} */}
                            <div ref={scrollRefBottom}></div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full py-2 bg-white relative z-5">
            <ChatInput
              onHandleSendMessage={handleSendMessage}
              onHandleSendAIMessage={sendAIMessage}
              socket={socket}
              typing={typing}
              setTyping={setTyping}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              onHandleTranslateText={onHandleTranslateText}
              onHandleSendFile={onHandleSendFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomChat;
