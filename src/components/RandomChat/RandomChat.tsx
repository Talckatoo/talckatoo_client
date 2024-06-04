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
  conversationRandomId,
  socket,
}: {
  randomData: any;
  conversationRandomId: string;
  socket: any;
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
  const { random } = useAppSelector((state) => state.socket);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    window.onbeforeunload = () => {
      return "Are you sure you want to leave?";
    };
  }, []);

  useEffect(() => {
    if (random.randomData) {
      if (random.randomData.user2.id === user._id) {
        setSocketId(random.randomData.user1.socketId);
        setUserData(random.randomData.user1);
      } else {
        setSocketId(random.randomData?.user2?.socketId);
        setUserData(random.randomData.user2);
      }
    }
  }, [random.randomData]);

  const handleSendMessage = (message: string) => {
    const data = {
      message,
      conversationRandomId,
      sender: user?._id,
      socketId: socketId,
      language: UserData.language,
    };
    socket.current.emit("sendRandomMessage", data);
  };

  const sendAIMessage = (message: string) => {
    const data = {
      message,
      conversationRandomId,
      sender: import.meta.env.VITE_AI_ASSISTANT_ID,
      socketId: socketId,
    };
    socket.current.emit("sendRandomMessage", data);
  };

  const onHandleTranslateText = (text: string, targetLanguage: string) => {
    const data = {
      text,
      targetLanguage,
    };
    socket.current.emit("translateText", data);
  };

  const onHandleSendFile = async (media: any) => {
    try {
      socket.current.emit("sendRandomMessage", {
        createdAt: new Date(),
        sender: user?._id,
        to: random.randomData?.user2?.id,
        targetLanguage: random.randomData?.user2?.language,
        media: {
          url: media.url,
          type: media.type,
          altText: media.altText,
        },
        status: false,
        socketId: socketId,
      });
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
      className={`w-full  flex flex-col ${
        isDarkMode ? "bg-[#202020]" : "bg-white"
      }`}
    >
      <div className="relative ">
        <div className="flex flex-col h-full ">
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
            <div className="relative min-h-[76vh]   z-[5] ">
              <div
                ref={scrollRef}
                className="overflow-y-auto overflow-x-hidden w-full   absolute top-0 left-0 right-0 bottom-0  m-auto"
              >
                <div className="p-4">
                  {messages
                    ? messages.map((msg: any, index:any) => (
                        <div
                          className={
                            "first:mt-[6rem]" +
                            (msg.sender === user?._id ? " mb-6" : "") +
                            (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID
                              ? "text-center "
                              : "")
                          }
                          key={index}
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
                                  .map((line: any, index: any, lines: any) => {
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
                                    <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-blur">
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
                                    <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-blur">
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

                                      <MdDownload className="text-[35px] min-w-[35px] text-black bg-white p-2 rounded-full shadow-blur" />
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
                            <div ref={scrollRefBottom}></div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className={` ${isDarkMode ? "bg-[#181818]" : "bg-white" }`}>
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
