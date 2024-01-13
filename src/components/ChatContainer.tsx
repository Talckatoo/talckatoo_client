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
import { MdTranslate } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
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

interface Socket {
  current: any;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {
  const { isDarkMode } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const conversationState = useAppSelector((state) => state.conversation);
  const user = useAppSelector((state) => state.auth.user);
  const messages = useAppSelector((state) => state.messages.messages);
  const { recipient } = useAppSelector((state) => state.user);
  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;
  const language = conversationState?.conversation?.language;
  const {recipientPi} = useAppSelector((state) => state.user);

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

  useEffect(() => {
    if (selectedId || conversationId) {
      setPage(1);
      setLimit(10);
      setHasMoreMessages(true);
      setIsFetchingMore(false);
      refetchMessages();
    }
  }, [selectedId, conversationId]);

  // useEffect(() => {
  //   if (messagesData?.conversation?.messages?.length !== 0) {
  //     refetchMessages();
  //   }
  // }, [messagesData]);

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

  useEffect(() => {
    if (socket.current) {
      socket.current.on("isTyping", (data: any) => {
        console.log(data);
        setSelectedTyping(data);
        setIsTyping(true);
      });
      socket.current.on("stopTyping", () => setIsTyping(false));
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
        console.log(message);
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
        if (response?.conversation._id) {
          dispatch(
            setConversation({
              conversationId: response?.conversation._id,
              selectedId: selectedId,
            })
          );
        }

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

  useEffect(() => {
    if (socket.current) {
      updateConversation();
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
        setLimit(limit + 10);
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
      const isScrolledToTop = scrollTop < 400;
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

  return (
    <div className="flex flex-col shadow h-full ">
      <img
        src="/assets/img/Shapes.png"
        alt="shape"
        className="fixed left-[-5rem]  bottom-[5px] w-[40%] z-[1] "
      />
      <div className="w-full flex flex-col h-full">
        <img
          src="/assets/img/Shape.png"
          alt="shape"
          className="fixed right-[1rem]  top-[1px] w-[30%] z-[1] "
        />
        <div className="relative h-full z-[5] ">
          <div
            ref={scrollRef}
            className="overflow-y-auto absolute top-0 left-0 right-0 bottom-0 md:px-[8rem]"
          >
            {!!selectedId && !!conversationId ? (
              <div className="m-2 p-2 ">
                {messages
                  ? messages.map((msg) => (
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
                            "flex items-end mb-6" +
                            (msg.sender === user?._id ? " flex text-right w-full justify-end items-end" : "")
                          }
                        >
                          
                          <div
                            className={
                              "w-auto max-w-[50%] inline-block m-2 p-4 " +
                              (msg.sender === user?._id
                                ? " bg-[#E9E9EF] text-right text-[black] rounded-t-[20px] rounded-br-[20px]"
                                : "") +
                              (msg.sender ==
                              import.meta.env.VITE_AI_ASSISTANT_ID
                                ? "bg-[#FEF3C7] text-center mx-auto rounded-[20px]"
                                : "") +
                                ((msg.sender !== user?.id) &&(msg.sender !== import.meta.env.VITE_AI_ASSISTANT_ID)? "bg-[#25282C] text-left text-white rounded-t-[20px] rounded-bl-[20px]" : "")
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
                                            <br className=" mx-auto"/>
                                            <div className="h-1 border-b border-gray-600 my-1"></div>
                                          </>
                                        )}
                                    </React.Fragment>
                                  );
                                })
                            ) : (
                              <>{msg.message}</>
                            )}

                            <div className="flex justify-between items-center relative top-12">
                              <div className=" text-black items-end text-x-small-regular">
                                {getTime(msg.createdAt)}
                              </div>

                              <TextToSpeech convertedText={msg.message} />
                            </div>
                            {msg.voiceNote && (
                              <audio className="w-full h-15" controls>
                                <source
                                  src={msg.voiceNote?.url}
                                  type="audio/mpeg"
                                />
                              </audio>
                            )}
                          </div>
                          <img
                            src={ msg.sender === user?._id ? `${user?.profileImage.url}` : `${recipientPi}`}
                            alt="profile"
                            className=" w-[36px] h-[36px] rounded-full border border-[#E9E9EF]"
                          />
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
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ChatContainer;
