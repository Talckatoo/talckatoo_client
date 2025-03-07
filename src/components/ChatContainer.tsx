import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import elliptic from "elliptic";
import CryptoJS from "crypto-js";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";
import JumpingDotsAnimation from "../UI/animation";
import textToVoiceLanguages from "../util/textToVoiceLanguages";
import TextToSpeech from "../components/TextToSpeech";
import { MdCancel, MdDownload } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { Link } from "react-router-dom";
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
import HandleAnswerCall from "./VideoCall/services/HandleAnswerCall";
import { setConversation } from "../redux/features/conversation/conversationSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";
import { IoSend } from "react-icons/io5";
import { useUploadFileMutation } from "../redux/services/MediaApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import notificationSound from "/notification.wav";
import getTranslation from "../util/translator-api";

interface Socket {
  current: any;
}

interface ReceivedCallState {
  isReceivedCall: boolean;
  caller?: string;
  roomId?: string;
}

interface KeyResponse {
  data: {
    userKeys: {
      userId: string;
      publicKey: string;
      privateKey?: string;
    }[];
  };
}

interface PublicKeys {
  [key: string]: string;
}

interface PrivateKeyResponse {
  data: {
    data: {
      userKeys: {
        privateKey: string;
        userId: string;
      };
    };
  };
}

interface PublicKeyResponse {
  data: {
    data: {
      userKeys: Array<{
        userId: string;
        publicKey: string;
      }>;
    };
  };
}

interface Message {
  _id: string;
  message?: string;
  sender: string;
  createdAt: string;
}


const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      // Request permission for notification
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setNotificationPermission(true);
        }
      });
    }
  }, []);

  const showNotification = (message: any) => {
    if (notificationPermission) {
      const audio = new Audio(notificationSound);
      audio.play();
      new Notification("New Message", {
        body: message,
      });
    }
  };

  const { t } = useTranslation();
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
  // Sending a file...
  const [openSendImageDialog, setOpenSendImageDialog] =
    useState<boolean>(false);
  const [imageToBeSent, setImageToBeSent] = useState<{
    formData: any;
    localImage: any;
  }>({ formData: null, localImage: null });
  const [uploadFile] = useUploadFileMutation();
  const [isFileUploading, setIsFileUploading] = useState(false);

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

  // crypto state
  const [publicKeys, setPublicKeys] = useState<PublicKeys>({});
  const [privateKey, setPrivateKey] = useState("");

  // TEST //  ------------------------------------------------

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
  }, [messages, openSendImageDialog]);

  useEffect(() => {
    if (selectedId || conversationId) {
      // setPage(1);
      // setLimit(30);
      setHasMoreMessages(true);
      scrollToBottom();
      setIsFetchingMore(false);

      if (selectedId && conversationId) {
        dispatch(setMessages([]));
        refetchMessages();
      }
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
      type: "ai",
      createdAt: Date.now(),
    });
    dispatch(
      setConversation({
        conversationId: conversationId,
        selectedId: selectedId,
        language: language,
      })
    );

    dispatch(
      addMessage({
        createdAt: Date.now(),
        message: messageAI,
        sender: user?._id,
        _id: uuidv4(),
      })
    );
  };

  // Fetch public keys
  const handleFetchPubKeys = async () => {
    if (!user?._id || !token) {
      console.warn('User or token not available for fetching public keys');
      return;
    }
  
    try {
      const response = await axios.get<PublicKeyResponse>(
        `${import.meta.env.VITE_BASE_URL}/keys/public`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Log response structure for debugging
      // console.log('Public keys response:', JSON.stringify(response.data, null, 2));
  
      if (!response?.data?.data?.userKeys) {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response format for public keys');
      }
  
      const keys = response.data.data.userKeys.reduce((acc, key) => {
        if (key.userId && key.publicKey) {
          acc[key.userId] = key.publicKey;
        }
        return acc;
      }, {} as Record<string, string>);
  
      setPublicKeys(keys);
    } catch (err) {
      console.error(`Public keys fetch error:`, err);
      if (axios.isAxiosError(err)) {
        toast.error(`Failed to fetch public keys: ${err.response?.data?.message || 'Unknown error'}`);
      } else {
        toast.error("Failed to fetch public keys");
      }
    }
  };

  // Fetch private key
  const handleFetchPrivKey = async () => {
    if (!user?._id || !token) {
      console.warn('User or token not available for fetching private key');
      return;
    }
  
    try {
      const response = await axios.get<PrivateKeyResponse>(
        `${import.meta.env.VITE_BASE_URL}/keys/private/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Log response structure for debugging
      // console.log('Private key response:', JSON.stringify(response.data, null, 2));
  
      // Check if response has the expected structure
      if (!response?.data?.data?.userKeys?.privateKey) {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid response format for private key');
      }
  
      const encryptedPrivateKey = response.data.data.userKeys.privateKey;
  
      // Log encrypted key for debugging (be careful with sensitive data in production)
      // console.log('Encrypted private key exists:', !!encryptedPrivateKey);
  
      // Verify KEK secret exists
      if (!import.meta.env.VITE_KEK_SECRET) {
        throw new Error('KEK secret not found in environment variables');
      }
  
      try {
        const decryptedPrivateKey = CryptoJS.AES.decrypt(
          encryptedPrivateKey,
          import.meta.env.VITE_KEK_SECRET
        ).toString(CryptoJS.enc.Utf8);
  
        if (!decryptedPrivateKey) {
          throw new Error('Decryption resulted in empty private key');
        }
  
        // Verify the decrypted key format (should be a valid hex string)
        if (!/^[0-9a-fA-F]+$/.test(decryptedPrivateKey)) {
          throw new Error('Decrypted key is not in valid hex format');
        }
  
        setPrivateKey(decryptedPrivateKey);
      } catch (decryptError) {
        console.error('Error decrypting private key:', decryptError);
        throw new Error('Failed to decrypt private key');
      }
    } catch (err) {
      console.error(`Private key fetch error:`, err);
      
      // Provide more specific error messages
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (err.response?.status === 404) {
          toast.error("Private key not found. Please generate new keys.");
        } else {
          toast.error(`Failed to fetch private key: ${err.response?.data?.message || 'Unknown error'}`);
        }
      } else {
        toast.error("Failed to fetch private key");
      }
    }
  };

  const EC = elliptic.ec;
  const ec = new EC("secp256k1");

  // function for encrypting a message using ECDH key exchange methodology
  // the encryption and decryption protocol currently being used is AES
  const encryptMessage = (message: string, senderPrivateKey: string, recipientPublicKey: string) => {
    if (!message || !senderPrivateKey || !recipientPublicKey) {
      throw new Error('Missing required parameters for encryption');
    }
  
    try {
      const senderKey = ec.keyFromPrivate(senderPrivateKey, "hex");
      const recipientKey = ec.keyFromPublic(recipientPublicKey, "hex");
      const sharedSecret = senderKey.derive(recipientKey.getPublic()).toString(16);
  
      return CryptoJS.AES.encrypt(message, sharedSecret).toString();
    } catch (err) {
      console.error('Encryption error:', err);
      throw new Error('Failed to encrypt message');
    }
  };

  // function for decrypting a message using ECDH key exchange methodology
  const decryptMessage = (encryptedMessage: string, privateKey: string, publicKey: string) => {
    if (!encryptedMessage || !privateKey || !publicKey) {
      throw new Error('Missing required parameters for decryption');
    }
  
    try {
      const privateKeyObj = ec.keyFromPrivate(privateKey, "hex");
      const publicKeyObj = ec.keyFromPublic(publicKey, "hex");
      const sharedSecret = privateKeyObj.derive(publicKeyObj.getPublic()).toString(16);
  
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, sharedSecret);
      const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  
      if (!decryptedMessage) {
        throw new Error('Decryption resulted in empty message');
      }
  
      return decryptedMessage;
    } catch (err) {
      console.error('Decryption error:', err);
      throw new Error('Failed to decrypt message');
    }
  };

  // Keys fetch useEffect
  useEffect(() => {
    const fetchKeys = async () => {
      if (user) {
        try {
          await Promise.all([
            handleFetchPubKeys(),
            handleFetchPrivKey()
          ]);
        } catch (err) {
          console.error(`Keys fetch error:`, err);
          toast.error("Failed to fetch encryption keys");
        }
      }
    };
  
    fetchKeys();
  }, [user]);

  // const handleSendMessage = async (messageText: any) => {
  //   socket.current.emit("stopTyping", selectedId);

  //   const sealedMessage = encryptMessage(
  //     messageText,
  //     privateKey,
  //     publicKeys[selectedId]
  //   );

  //   if (selectedId && conversationId !== "") {
  //     try {
  //       const response = await sendMessage({
  //         from: user?._id,
  //         to: selectedId,
  //         targetLanguage: language,
  //         message: sealedMessage,
  //         status: false,
  //         unread: selectedId,
  //       }).unwrap();

  //       const { message, conversation } = response;

  //       // setIsFetchingMore(false);

  //       socket.current.emit("sendMessage", {
  //         createdAt: message?.createdAt,
  //         userName: user?.userName,
  //         from: user?._id,
  //         to: selectedId,
  //         targetLanguage: language,
  //         message: sealedMessage,
  //         status: false,
  //         unread: selectedId,
  //         conversationId: conversation?._id,
  //       });

  //       // modify the latest message   in the users redux

  //       dispatch(
  //         addMessage({
  //           createdAt: message?.createdAt,
  //           message: message?.message,
  //           sender: user?._id,
  //           _id: message?._id,
  //           unread: selectedId,
  //         })
  //       );
  //     } catch (err) {
  //       console.log("error from error", err);
  //       toast.error(`${t("Error sending messages, please try again")}`);
  //     }
  //   } else if (selectedId && conversationId === "") {
  //     try {
  //       const response = await sendMessage({
  //         from: user?._id,
  //         to: selectedId,
  //         targetLanguage: language,
  //         message: messageText,
  //         status: false,
  //         unread: selectedId,
  //       }).unwrap();

  //       setIsFetchingMore(false);
  //       const { message, conversation } = response;

  //       socket.current.emit("sendMessage", {
  //         createdAt: message?.createdAt,
  //         from: user?._id,
  //         to: selectedId,
  //         targetLanguage: language,
  //         message: message?.message,
  //         status: false,
  //         unread: selectedId,
  //         conversation: conversation._id,
  //       });

  //       // modify the latest message   in the users redux

  //       dispatch(
  //         addMessage({
  //           createdAt: message?.createdAt,
  //           message: message?.message,
  //           sender: user?._id,
  //           _id: message?._id,
  //           unread: selectedId,
  //         })
  //       );
  //       dispatch(
  //         setConversation({
  //           conversationId: conversation?._id,
  //           selectedId: selectedId,
  //           language: language,
  //         })
  //       );
  //     } catch (err) {
  //       toast.error(`${t("Error sending messages, please try again")}`);
  //     }
  //   }
  // };

  const handleSendMessage = async (messageText: string) => {
    socket.current.emit("stopTyping", selectedId);

    if (!selectedId) return;

    try {
      // Translate the message
      const translatedText = await translateMessage(language, messageText);

      // Encrypt the message
      const sealedMessage = encryptMessage(
        translatedText,
        privateKey,
        publicKeys[selectedId]
      );

      // Send the message based on whether it's a new or existing conversation
      const response = conversationId
        ? await sendExistingMessage(sealedMessage)
        : await sendNewMessage(sealedMessage);

      const { message, conversation } = response;

      // Emit the message through the socket
      emitSocketMessage(sealedMessage, message?.createdAt, conversation?._id);

      // Update Redux state with the new message
      updateReduxState(message, conversation);

      if (!conversationId) {
        dispatchNewConversation(conversation?._id);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const translateMessage = async (language: string, messageText: string) => {
    const result = await getTranslation(
      language,
      messageText,
      import.meta.env.VITE_AZURE_TRANSLATOR_KEY as string,
      import.meta.env.VITE_TRANSLATOR_ENDPOINT as string
    );
    return messageText + result[0]?.text;
  };

  const sendExistingMessage = async (sealedMessage: string) => {
    return await sendMessage({
      from: user?._id,
      to: selectedId,
      targetLanguage: language,
      message: sealedMessage,
      status: false,
      unread: selectedId,
    }).unwrap();
  };

  const sendNewMessage = async (sealedMessage: string) => {
    const response = await sendMessage({
      from: user?._id,
      to: selectedId,
      targetLanguage: language,
      message: sealedMessage,
      status: false,
      unread: selectedId,
    }).unwrap();

    setIsFetchingMore(false); // Set fetching state if necessary
    return response;
  };

  const emitSocketMessage = (
    sealedMessage: string,
    createdAt: string,
    conversationId: string
  ) => {
    socket.current.emit("sendMessage", {
      createdAt,
      userName: user?.userName,
      from: user?._id,
      to: selectedId,
      targetLanguage: language,
      message: sealedMessage,
      status: false,
      unread: selectedId,
      conversationId,
    });
  };

  const updateReduxState = (message: any, conversation: any) => {
    dispatch(
      addMessage({
        createdAt: message?.createdAt,
        message: message?.message,
        sender: user?._id,
        _id: message?._id,
        unread: selectedId,
      })
    );
  };

  const dispatchNewConversation = (conversationId: string) => {
    dispatch(
      setConversation({
        conversationId,
        selectedId,
        language,
      })
    );
  };

  const handleError = (err: any) => {
    console.log("Error:", err);
    toast.error(`${t("Error sending messages, please try again")}`);
  };

  const onSendFile = async () => {
    setIsFileUploading(true);
    const response = await uploadFile(imageToBeSent.formData);
    if ("data" in response) {
      if (response.data && !response.data.error) {
        {
          socket.current.emit("stopTyping", selectedId);
          const fileId = response?.data?.media?._id;
          const media = response?.data?.media;
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
              setIsFileUploading(false);
              setOpenSendImageDialog(false);
            } catch (err) {
              toast.error(`${t("Error sending messages, please try again")}`);
              setIsFileUploading(false);
              setOpenSendImageDialog(false);
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
              setIsFileUploading(false);
              setOpenSendImageDialog(false);
            } catch (err) {
              toast.error(`${t("Error sending messages, please try again")}`);
              setIsFileUploading(false);
              setOpenSendImageDialog(false);
            }
          }
        }
      } else {
        console.log("error", response.data.error);
        setIsFileUploading(false);
        setOpenSendImageDialog(false);
      }
    } else {
      console.log("error", response.error);
      setIsFileUploading(false);
      setOpenSendImageDialog(false);
    }
  };

  const onHandleSendFile = (imageData: {
    file: any;
    type: "string";
    altText: "string";
  }) => {
    setOpenSendImageDialog(true);
    const formData = new FormData();
    formData.append("file", imageData.file);
    formData.append("type", imageData.type);
    formData.append("altText", imageData.altText);
    setImageToBeSent({
      formData,
      localImage: URL.createObjectURL(imageData.file),
    });

    /**/
  };

  useEffect(() => {
    if (socket.current) {
      updateConversation();
      socket.current.on("getMessage", (data: any) => {
        if (data.message) {
          showNotification(`${data.userName}: ${data.message}`);
          setArrivalMessages({
            createdAt: data.createdAt,
            message: data.message,
            sender: data.from,
            _id: uuidv4(),
          });
        } else if (data.voiceNote) {
          showNotification(`${data.from}: ► Voice message`);
          setArrivalMessages({
            createdAt: data.createdAt,
            voiceNote: {
              url: data.voiceNote.url,
            },
            sender: data.from,
            _id: uuidv4(),
          });
        } else if (data.media) {
          showNotification(`${data.from}: Media message`);
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
          showNotification(`${data.from}: Reply message`);
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
            sender: data.from,
            type: "ai",
            _id: uuidv4(),
          });
        }
      });
    }
  }, [socket.current, arrivalMessages]);

  useEffect(() => {
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
        toast.error(`${t("Error sending messages, please try again")}`);
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
      toast.error(`${t("Error updating messages, please try again")}`);
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

  // *************************** DECRYPTED MESSAGES *****************************

  const decryptedMessages = useMemo<Message[]>(() => {
    if (!privateKey || !publicKeys[selectedId] || !messages) {
      return messages;
    }
  
    return messages.map(msg => {
      if (!msg.message) {
        return msg;
      }
  
      try {
        const decryptedMessage = decryptMessage(
          msg.message,
          privateKey,
          publicKeys[selectedId]
        );
        return { ...msg, message: decryptedMessage };
      } catch (err) {
        console.error('Message decryption error:', err);
        // Return original message if decryption fails
        return msg;
      }
    });
  }, [messages, privateKey, publicKeys, selectedId]);

  // *************************** DECRYPTED MESSAGES *****************************

  return (
    <div
      className={`w-full h-full flex flex-col ${
        isDarkMode ? "bg-[#181818]" : "bg-white"
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
        {openSendImageDialog ? (
          <div className="overflow-y-auto overflow-x-hidden w-full h-full flex gap-8 flex-col justify-center items-center bg-secondary-500/75	">
            <div className="relative bg-white w-1/2 h-2/3 rounded-lg flex flex-col justify-center items-center h-1/2">
              <div
                className="absolute top-0 right-0 p-5"
                onClick={() => setOpenSendImageDialog(false)}
              >
                <MdCancel className="text-[32px] text-secondary-500 hover:scale-105 transition ease-in-out duration-300 cursor-pointer"></MdCancel>
              </div>
              <img
                className="w-full object-contain h-full p-5"
                src={imageToBeSent.localImage}
              ></img>
            </div>
            <div className="w-1/2 flex justify-center items-center rounded">
              <div
                className="flex justify-center w-16 h-16 items-center rounded-full bg-secondary-500 border-black hover:scale-105 transition ease-in-out duration-300 cursor-pointer"
                onClick={onSendFile}
              >
                {isFileUploading ? (
                  <FontAwesomeIcon
                    className="text-white text-[24px]"
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  <IoSend className="text-white text-[24px]"></IoSend>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col shadow-blur  h-full ${
              isDarkMode
                ? "border-l border-[#000] border-opacity-20"
                : "border-l border-opacity-20"
            }`}
          >
            <div className="w-full flex flex-col h-full">
              <img
                src={`${
                  isDarkMode
                    ? "/assets/img/Shapesde.png"
                    : "/assets/img/Shapes.png"
                }`}
                alt="shape"
                className="fixed left-24  -bottom-14 w-[40%] z-[1] "
              />
              <img
                src={`${
                  isDarkMode
                    ? "/assets/img/Shapesd.png"
                    : "/assets/img/Shapes.png"
                }`}
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
                      {decryptedMessages
                        ? decryptedMessages.map((msg) => (
                            <div
                              className={
                                "" +
                                (msg.sender === user?._id ? " mb-6" : "") +
                                (msg.sender ==
                                  import.meta.env.VITE_AI_ASSISTANT_ID ||
                                msg.type === "ai"
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
                                      import.meta.env.VITE_AI_ASSISTANT_ID &&
                                    msg.type !== "ai"
                                      ? `h-full text-right text-[#000] rounded-t-[20px] rounded-bl-[20px] ${
                                          isDarkMode
                                            ? "bg-[#D9E3EA]"
                                            : "bg-[#F5F5F5]"
                                        }`
                                      : msg.sender !==
                                          import.meta.env
                                            .VITE_AI_ASSISTANT_ID &&
                                        msg.type !== "ai"
                                      ? "bg-[#25282C] text-left text-white  rounded-t-[20px] rounded-br-[20px]"
                                      : "bg-[#FEF3C7] text-center mx-auto rounded-[20px]")
                                  }
                                >
                                  {msg.sender !==
                                    import.meta.env.VITE_AI_ASSISTANT_ID &&
                                  msg.type !== "ai" &&
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
                                    <audio
                                      className="w-[150px] h-15"
                                      b-
                                      controls
                                    >
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
                                        msg.sender ==
                                          import.meta.env
                                            .VITE_AI_ASSISTANT_ID ||
                                        msg.type === "ai"
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
            <div className="w-full py-2 relative z-5">
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
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
