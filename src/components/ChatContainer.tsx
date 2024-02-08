import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";
import JumpingDotsAnimation from "../UI/animation";
import languagesArray from "../util/languages";
import textToVoiceLanguages from "../util/textToVoiceLanguages";
import TextToSpeech from "../components/TextToSpeech";
import { MdDownload } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import {
  addMessage,
  setMessages,
} from "../redux/features/messages/messageSlice";

import { setRecipient } from "../redux/features/user/userSlice";
import {
  useFetchMessagesByConversationIdQuery,
  useSendMessageMutation,
} from "../redux/services/MessagesApi";
import { FaFile } from "react-icons/fa";
import { Base64 } from "js-base64";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Button,
// } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import HandleAnswerCall from "./VideoCall/services/HandleAnswerCall";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { skipToken } from "@reduxjs/toolkit/query";

interface Socket {
  current: any;
}

interface ReceivedCallState {
  isReceivedCall: boolean;
  caller?: string;
  roomId?: string;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {
  // const ColoredDialog = withStyles({
  //   root: {
  //     "& .MuiDialog-paper": {
  //       border: "2px solid black", // Set your desired border color
  //     },
  //   },
  // })(Dialog);

  const { isDarkMode } = useContext(UserContext);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const user = useAppSelector((state) => state.auth.user);
  const messages = useAppSelector((state) => state.messages.messages);
  const { recipient } = useAppSelector((state) => state.user);
  const conversationId = conversationState?.conversation?.conversationId;
  const language = conversationState?.conversation?.language;

  const [receivedCall, setReceivedCall] = useState<ReceivedCallState>({
    isReceivedCall: false,
    caller: "",
    roomId: "",
  });

  // *******************CALL******************
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (socket.current && receivedCall && receivedCall.roomId) {
      let roomId = receivedCall.roomId;
      socket.current.emit("leaveCall", {
        roomId,
      });
    }
  };

  // RTK Query
  // fetch all messages by conversation id
  const { data: messagesData, refetch: refetchMessages } =
    useFetchMessagesByConversationIdQuery(
      conversationId
        ? { userId: user?._id, conversationId: conversationId, page, limit }
        : skipToken
    ) as any;

  // Post Message
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [usersArray, setUsersArray] = useState([]);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTyping, setSelectedTyping] = useState();
  const [decodedCallData, setDecodedCallData] = useState("");
  const idArray = usersArray?.map((obj) => obj._id);
  const voiceCode = textToVoiceLanguages.find(
    (la) => la.code === language?.toLowerCase()
  )?.voiceCode;
  const token = localStorage.getItem("token");

  // TEST //  ------------------------------------------------
  // useEffect(() => {
  //   console.log("messages", messages);
  //   console.log("messagesData", messagesData);
  //   console.log("arrivalMessages", arrivalMessages);
  // }, [messages]);

  // TEST //  ------------------------------------------------

  // ----------------------- SCROLLING --------------------------------

  const scrollRef = useRef<HTMLDivElement | null>(null);
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
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedId || conversationId) {
      // setPage(1);
      // setLimit(30);
      setHasMoreMessages(true);
      scrollToBottom();
      setIsFetchingMore(false);
      if (selectedId && conversationId) refetchMessages();
    }

    if (selectedId && conversationId === "") {
      dispatch(setMessages([]));
    }
  }, [conversationId, selectedId]);

  // useEffect(() => {
  //   !isFetchingMore && scrollToBottom();
  // }, [messages, isFetchingMore]);

  // ----------------------- SCROLLING --------------------------------

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
          recipient,
        }: {
          signal: any;
          from: any;
          username: any;
          roomId: any;
          userToCall: any;
          recipient: any;
        }) => {
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
                recipient,
              })
            )
          );
          setDecodedCallData(encodedCallData);
          setReceivedCall({
            isReceivedCall: true,
            caller: username,
            roomId,
          });
        }
      );

      socket?.current?.on("leaveCall", () => {
        setReceivedCall({ isReceivedCall: false, caller: "", roomId: "" });
      });

      // **************** call *********************
    }
  }, [socket.current]);

  useEffect(() => {
    dispatch(setMessages([]));

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

    if (messagesData) {
      dispatch(setMessages(messages));
    }
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
    if (selectedId && conversationId !== "") {
      try {
        const response = await sendMessage({
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: messageText,
          status: false,
          unread: selectedId,
        }).unwrap();
        console.log(response);

        const { message, conversation } = response;

        // setIsFetchingMore(false);

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: message?.message,
          status: false,
          unread: selectedId,
          conversationId: conversation?._id,
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

        dispatch(
          setConversation({
            conversationId: conversation?._id,
            selectedId: selectedId,
            language: language,
          })
        );
      } catch (err) {
        console.log("error from error", err);
        toast.error(
          "Error sending messages, please try again form handleSendMessage1"
        );
      }
    } else if (selectedId && conversationId === "") {
      // setMessages([]);
      // dispatch(setMessages([]));
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
        console.log({ "response in uncontacted": response });
        const { message, conversation } = response;

        socket.current.emit("sendMessage", {
          createdAt: message?.createdAt,
          from: user?._id,
          to: selectedId,
          targetLanguage: language,
          message: message?.message,
          status: false,
          unread: selectedId,
          conversation: conversation._id,
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

        dispatch(
          setConversation({
            conversationId: conversation?._id,
            selectedId: selectedId,
            language: language,
          })
        );
      } catch (err) {
        toast.error(
          "Error sending messages, please try again form handleSendMessage2"
        );
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

        const { message, conversation } = response;

        // setIsFetchingMore(false);

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
          conversationId: conversation?._id,
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
        dispatch(
          setConversation({
            conversationId: conversation?._id,
            selectedId: selectedId,
            language: language,
          })
        );
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    } else if (selectedId && conversationId === "") {
      // // setMessages([]);
      // dispatch(setMessages([]));
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
        dispatch(
          setConversation({
            conversationId: conversation?._id,
            selectedId: selectedId,
            language: language,
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
    console.log("ARRIVAL MESS");
    arrivalMessages &&
      idArray?.includes(arrivalMessages?.sender) &&
      dispatch(setMessages([...messages, arrivalMessages]));
  }, [arrivalMessages]);

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

  const handleAnswerCall = () => {
    HandleAnswerCall(setOpen, setReceivedCall, decodedCallData);
  };

  useEffect(() => {
    if (receivedCall.isReceivedCall) {
      handleClickOpen();
    }
  }, [receivedCall]);

  // *************************** VIDEO CALL *****************************

  return (
    <div
      className={`w-full h-full flex flex-col ${
        isDarkMode ? "bg-sidebar-dark-500" : "bg-white"
      }`}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {receivedCall?.caller} is calling
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => handleAnswerCall()}>Answer</Button>
        </DialogActions>
      </Dialog>

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
                {selectedId ? (
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
