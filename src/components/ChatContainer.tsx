import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";
import JumpingDotsAnimation from "../UI/animation";
import { HiArrowsRightLeft } from "react-icons/hi2";
import languagesArray from "../util/languages";
import textToVoiceLanguages from "../util/textToVoiceLanguages";
import TextToSpeech from "../components/TextToSpeech";
import { MdDownload, MdTranslate } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  addMessage,
  setMessages,
} from "../redux/features/messages/messageSlice";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import userSlice, { setRecipient } from "../redux/features/user/userSlice";
import {
  useFetchMessagesByConversationIdQuery,
  useSendMessageMutation,
} from "../redux/services/MessagesApi";
import { FaFile } from "react-icons/fa";
import { Base64 } from "js-base64";
interface Socket {
  current: any;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null); // Initialize the ref

  const { isDarkMode } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const conversationState = useAppSelector((state) => state.conversation);
  const user = useAppSelector((state) => state.auth.user);
  const call = useAppSelector((state) => state.call.call);
  const messages = useAppSelector((state) => state.messages.messages);
  const { recipient } = useAppSelector((state) => state.user);
  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;
  const language = conversationState?.conversation?.language;
  const { recipientPi } = useAppSelector((state) => state.user);

  // RTK Query
  // fetch all messages by conversation id
  const { data: messagesData, refetch: refetchMessages } =
    useFetchMessagesByConversationIdQuery(
      { userId: user?._id, conversationId: conversationId, page, limit },
      { skip: !conversationId }
    ) as any;

  // Post Message
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // navigate
  const navigateVideoCall = () => {
    navigate("/videoCall");
  };

  useEffect(() => {
    if (selectedId || conversationId) {
      setPage(1);
      setLimit(30);
      setHasMoreMessages(true);
      setIsFetchingMore(false);
      refetchMessages();
    }
  }, [selectedId, conversationId]);

  const [usersArray, setUsersArray] = useState([]);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTyping, setSelectedTyping] = useState();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const idArray = usersArray?.map((obj) => obj._id);

  const fullLanguage = languagesArray.map((l) => {
    if (l.code === language) return l.language;
  });

  const voiceCode = textToVoiceLanguages.find(
    (la) => la.code === language?.toLowerCase()
  )?.voiceCode;

  const token = localStorage.getItem("token");
  const [decodedCallData, setDecodedCallData] = useState("");

  useEffect(() => {
    if (socket.current) {
      socket.current.on("isTyping", (data: any) => {
        setSelectedTyping(data);
        setIsTyping(true);
      });
      socket.current.on("stopTyping", () => setIsTyping(false));

      socket.current.on(
        "callUser",
        ({
          signal,
          from,
          username,
          roomId,
          userToCall,
        }: {
          signal: any;
          from: any;
          username: any;
          roomId: any;
          userToCall: any;
        }) => {
          console.log("callUser", signal, from, username, roomId, userToCall);
          // Encode the call data and set it into the URL
          const encodedCallData = Base64.fromUint8Array(
            new TextEncoder().encode(
              JSON.stringify({
                isReceivedCall: true,
                from,
                username,
                signal,
                roomId,
                userToCall,
              })
            )
          );

          console.log("callUser", encodedCallData);

          setDecodedCallData(encodedCallData);
        }
      );

      // socket.current.on("leaveCall", () => {
      //   // Handle the call ending notification
      //   console.log("Call ended by the caller");
      //   setCallEnded(true);
      //   setCallAccepted(false);
      //   setCall({ isReceivedCall: false });
      //   setCalleeEnded(true);
      //   if (connectionRef.current) {
      //     connectionRef.current.destroy();
      //   }
      //   // You can update the UI or show a notification to inform the callee
      // });

      // **************** call *********************
    }
  }, [socket.current]);

  useEffect(() => {
    const { messages } = messagesData?.conversation || {};
    const { users } = messagesData?.conversation || {};
    if (users) {
      if (users[0]?.userName === user?.userName) {
        dispatch(setRecipient(users[1]?.userName));
      } else {
        dispatch(setRecipient(users[0]?.userName));
      }

      const AIuser = {
        userName: "AI Assistant",
        _id: import.meta.env.VITE_AI_ASSISTANT_ID,
      };
      setUsersArray([...users, AIuser]);
    }
    // setMessages(messages);
    if (messagesData) dispatch(setMessages(messages));
  }, [messagesData]);

  const sendAIMessage = (messageAI: any) => {
    socket.current.emit("sendMessageChatGPT", {
      message: messageAI,
      from: user?._id,
      to: selectedId,
      createdAt: Date.now(),
    });

    dispatch(
      addMessage({
        createdAt: Date.now().toString(),
        message: messageAI,
        sender: user?._id,
        _id: uuidv4(),
      })
    );
  };

  const handleSendMessage = async (messageText: any) => {
    socket.current.emit("stopTyping", selectedId);
    if (selectedId && conversationId) {
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: messageText,
          status: false,
          unread: selectedId,
        }).unwrap();

        const { message } = response;

        setIsFetchingMore(false);

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: message?.message,
          status: false,
          unread: selectedId,
        });

        // modify the latest message   in the users redux

        dispatch(
          addMessage({
            createdAt: message?.createdAt,
            message: message?.message,
            sender: user?._id,
            _id: message?._id,
            unread: selectedId,
          })
        );
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    } else if (selectedId && conversationId === null) {
      // setMessages([]);
      dispatch(setMessages([]));
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: messageText,
          status: false,
          unread: selectedId,
        }).unwrap();

        setIsFetchingMore(false);
        const { message } = response;

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: message?.message,
          status: false,
          unread: selectedId,
        });
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    }
  };

  const onHandleSendFile = async (fileId: string, media: any) => {
    socket.current.emit("stopTyping", selectedId);
    if (selectedId && conversationId) {
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          media: fileId,
          status: false,
          unread: selectedId,
        }).unwrap();

        const { message } = response;

        setIsFetchingMore(false);

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          media: {
            url: media.url,
            type: media.type,
            altText: media.altText,
          },
          status: false,
          unread: selectedId,
        });

        // modify the latest message   in the users redux

        dispatch(
          addMessage({
            createdAt: message?.createdAt,
            media: {
              url: media.url,
              type: media.type,
              altText: media.altText,
            },
            sender: user?._id,
            _id: message?._id,
            unread: selectedId,
          })
        );
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    } else if (selectedId && conversationId === null) {
      // setMessages([]);
      dispatch(setMessages([]));
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          media: fileId,
          status: false,
          unread: selectedId,
        }).unwrap();

        setIsFetchingMore(false);

        const { message } = response;

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          media: {
            url: media.url,
            type: media.type,
            altText: media.altText,
          },
          status: false,
          unread: selectedId,
        });

        // modify the latest message   in the users redux

        dispatch(
          addMessage({
            createdAt: message?.createdAt,
            media: {
              url: media.url,
              type: media.type,
              altText: media.altText,
            },
            sender: user?._id,
            _id: message?._id,
            unread: selectedId,
          })
        );
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    }
  };

  useEffect(() => {
    if (socket.current) {
      updateConversation();
      setIsFetchingMore(false);
      socket.current.on("getMessage", (data: any) => {
        if (data.message) {
          setArrivalMessages({
            createdAt: data.createdAt,
            message: data.message,
            sender: data.from,
            _id: uuidv4(),
          });
        } else if (data.voiceNote) {
          setArrivalMessages({
            createdAt: data.createdAt,
            voiceNote: {
              url: data.voiceNote.url,
            },
            sender: data.from,
            _id: uuidv4(),
          });
        } else if (data.media) {
          setArrivalMessages({
            createdAt: data.createdAt,
            media: {
              type: data.media.type,
              url: data.media.url,
              altText: data.media.altText,
            },
            sender: data.from,
            _id: uuidv4(),
          });
        } else if (data.messageReply) {
          toast.update(2, {
            render: "done",
            type: "success",
            hideProgressBar: true,
            autoClose: 1000,
            isLoading: false,
          });

          setArrivalMessages({
            createdAt: data.messageReply.createdAt,
            message: data.messageReply.message,
            sender: data.messageReply.sender,
            _id: uuidv4(),
          });
        }
      });
    }
  }, [socket.current, arrivalMessages]);

  useEffect(() => {
    arrivalMessages &&
      idArray?.includes(arrivalMessages.sender) &&
      dispatch(setMessages([...messages, arrivalMessages]));
  }, [arrivalMessages]);

  const scrollRefBottom = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (scrollRefBottom.current) {
      scrollRefBottom.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    !isFetchingMore && scrollToBottom();
  }, [messages, isFetchingMore]);

  const fetchNextPage = async () => {
    if (!hasMoreMessages) {
      return;
    }

    try {
      const response = await refetchMessages();

      const newMessages = response.data?.conversation?.messages;

      if (newMessages && newMessages.length > 0) {
        // add the new messages on top of the old ones
        setIsFetchingMore(true);
        setLimit(limit + 20);
      } else {
        // No more messages to fetch
        setHasMoreMessages(false);
        setIsFetchingMore(false);
      }
    } catch (error) {
      console.error("Error fetching next page:", error);
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop } = e.target;
      // almost the top
      const isScrolledToTop = scrollTop < 600;
      if (isScrolledToTop && messages) {
        fetchNextPage();
      }
    };
    const scrollContainer = scrollRef.current;
    scrollContainer?.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, messages]);

  const onHandleTranslateText = async (translateText: string) => {
    socket.current.emit("stopTyping", selectedId);
    setIsFetchingMore(false);
    if (selectedId && conversationId && translateText) {
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: translateText.text,
          voiceTargetLanguage: voiceCode,
          voiceToVoice: true,
        }).unwrap();

        const { message } = response;

        dispatch(
          addMessage({
            createdAt: message?.createdAt,
            voiceNote: {
              url: message?.voiceNote.url,
            },
            sender: user?._id,
            _id: message?._id,
          })
        );

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          voiceNote: {
            url: message?.voiceNote.url,
          },
          from: user?._id,
          to: selectedId,
        });
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    }
  };

  const updateConversation = async () => {
    try {
      if (user && !!conversationId) {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/${
            user._id
          }/conversations/${conversationId}/update`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (err) {
      toast.error("Error updating messages, please try again");
    }
  };

  useEffect(() => {
    updateConversation();
  }, [selectedId]);

  // *************************** VIDEO CALL *****************************

  const handleCall = () => {
    // decode the call data
    const encodedCallData = Base64.fromUint8Array(
      new TextEncoder().encode(
        JSON.stringify({
          selectedId,
          userId: user._id,
          userName: user.userName,
        })
      )
    );

    const videoCallUrl = `/call/${Math.random()
      .toString(36)
      .slice(2)}/${encodedCallData}`;
    window.open(videoCallUrl, "_blank");
  };

  const handleAnswerCall = () => {
    // indecoded decodedCallData
    const decodedUint8Array = decodedCallData
      ? Base64.toUint8Array(decodedCallData)
      : null;

    // Convert the Uint8Array to a string
    const decodedString = new TextDecoder().decode(
      decodedUint8Array as AllowSharedBufferSource
    );

    // Parse the JSON string to get the original data
    const data = JSON.parse(decodedString);

    // Now you can use the decoded data as needed
    console.log("callData from inside", data);
    const videoCallUrl = `/call/${data.roomId}/${decodedCallData}`;
    window.open(videoCallUrl, "_blank");
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${
        isDarkMode ? "bg-sidebar-dark-500" : "bg-white"
      }`}
    >
      {/* <button className="text-white" onClick={handleCall}>
        Call
      </button>
      {call?.isReceivedCall && (
        <div>
          <h2 className="text-black">{call?.username} is calling</h2>
          <button
            className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
            onClick={() => handleAnswerCall()}
          >
            Answer
          </button>
        </div>
      )} */}

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
            <div className="relative h-full z-[5] ">
              <div
                ref={scrollRef}
                className="overflow-y-auto overflow-x-hidden w-full absolute top-0 left-0 right-0 bottom-0  m-auto"
              >
                {!!selectedId && !!conversationId ? (
                  <div className="m-2 p-2 ">
                    {messages
                      ? messages.map((msg) => (
                          <div
                            className={
                              "" +
                              (msg.sender === user?._id ? " mb-6" : "") +
                              (msg.sender ==
                              import.meta.env.VITE_AI_ASSISTANT_ID
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
                ) : (
                  <ChatWelcome />
                )}
              </div>
            </div>
          </div>
          {selectedTyping?.to === user?._id &&
          selectedTyping?.from === selectedId &&
          isTyping ? (
            <JumpingDotsAnimation />
          ) : null}
          <div className="w-full py-2 bg-white relative z-5">
            {selectedId ? (
              <>
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
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
