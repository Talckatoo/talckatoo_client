import {
  useState,
  ChangeEvent,
  useEffect,
  useContext,
  useRef,
  VoidFunctionComponent,
} from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineAttachFile, MdOutlineClose } from "react-icons/md";
import VoiceMessage from "./VoiceMessage";
import SpeechToText from "./SpeechToText";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hooks";
import { useUploadFileMutation } from "../redux/services/MediaApi";
import { FaCloudUploadAlt } from "react-icons/fa";
import Input from "../UI/Input";
import TextArea from "../UI/TextArea";
import { IoSend } from "react-icons/io5";
import { FaFaceSmile } from "react-icons/fa6";
import { useTranslation } from 'react-i18next';


interface ChatInputProps {
  socket: any;
  typing: boolean;
  setTyping: (typing: boolean) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  onHandleSendMessage: (message: string) => void;
  onHandleSendAIMessage: (messageAI: string) => void;
  onHandleTranslateText: (voiceMessage: string) => void;
  onHandleSendFile: (imageData:{file:any,type:"string",altText:"string"}) => void;
}
const ChatInput = ({
  socket,
  onHandleSendMessage,
  onHandleSendAIMessage,
  typing,
  setTyping,
  onHandleTranslateText,
  onHandleSendFile,
}: ChatInputProps): JSX.Element => {
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const AIcall = import.meta.env.VITE_AI_ASSISTANT_CALL;
  const [messageText, setMessageText] = useState<string>("");
  const { isDarkMode } = useContext(UserContext);
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;

  const [uploadFile] = useUploadFileMutation();
  const refToggleBox = useRef(null);
  useEffect(() => {
    const handleClickOutisde = (event: MouseEvent) => {
      if (
        refToggleBox.current &&
        !refToggleBox.current.contains(event.target as Node)
      ) {
        // Clicked outside of the toggle box, so close
        setShowEmoji(false);
      }
    };
    // Attach event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutisde);
    //clean up yhe event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutisde);
    };
  }, []);

  const handleShowEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const handleEmojiClick = (event: any) =>
    setMessageText(`${messageText} ${event.emoji}`);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.current.emit("isTyping", {
        from: user?._id,
        to: selectedId,
      });
    }
    let lastTypingTime = new Date().getTime();
    let timeLength = 3000; // 3 second
    setTimeout(() => {
      let currentTime = new Date().getTime();
      let timeDiff = currentTime - lastTypingTime;
      if (timeDiff > timeLength && typing) {
        socket.current.emit("stopTyping", {
          from: user?._id,
          to: selectedId,
        });
        setTyping(false);
      }
    }, timeLength);
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const imageData = {
      file: e.target.files[0],
      type: e.target.files[0].type.split("/")[0],
      altText: e.target.files[0].name
    };
    onHandleSendFile(imageData);
  };

  const handleSendMessageKeyDown = (e: ChangeEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (messageText.trim() === "") {
        return;
      }
      e.preventDefault();

      if (messageText.substring(0, 7) === AIcall) {
        onHandleSendAIMessage(messageText);
        toast.loading(`${t("Please wait")}`, {
          position: toast.POSITION.TOP_CENTER,
          progressClassName: "success-progress-bar",
          toastId: 2,
        });
      } else {
        onHandleSendMessage(messageText);
      }
      setMessageText("");
    }
  };

  const handleSendMessage = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageText.trim() === "") {
      return;
    }

    if (messageText.substring(0, 7) === AIcall) {
      onHandleSendAIMessage(messageText);
      toast.loading("Please wait", {
        position: toast.POSITION.TOP_CENTER,
        progressClassName: "success-progress-bar",
        toastId: 2,
      });
    } else {
      onHandleSendMessage(messageText);
    }
    setMessageText("");
  };
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full  relative z-10 pt-2" ref={refToggleBox}>
        {showEmoji && (
          <div
            className={`cursor-pointer emoji-container relative top-2  ${
              showEmoji ? "open" : ""
            }`}
          >
            <EmojiPicker width="100%" onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <div className=" flex flex-col max-md:w-[80%] md:w-[80%] mx-auto  ">
          <TextArea
            label=""
            name="name"
            type="text"
            value={messageText}
            onChange={handleTyping as any}
            onKeyDown={handleSendMessageKeyDown as any}
            id=""
            placeholder={t("Type your message or type @birdie to call AI Assistant")}
            className={`mb-0 rounded-t-[20px]   border  
            ${isDarkMode ? "bg-[#282828] border-[#141414] text-white" : "bg-white border-[#0E131D]"}
            ${
              messageText.startsWith(AIcall)
                ? "text-gray-700 italic font-semibold"
                : ""
            }`}
          />

          <div
          className={`flex justify-between items-center relative bottom-[2rem] py-3 border rounded-b-[20px] px-2 ${
            isDarkMode ? "bg-[#181818] border-[#141414]" : "bg-[#25282C] "
          }`}
          >
            <form onSubmit={handleSendMessage} className="absolute right-4 ">
              <button type="submit">
                <IoSend className="text-white text-[20px]" />
              </button>
            </form>
            <div className="w-[200px] flex items-center ">
              <div className="flex">
                <VoiceMessage
                  socket={socket}
                  onHandleTranslateText={onHandleTranslateText}
                />

              </div>
                <SpeechToText setMessageText={(newMessageText: string) => setMessageText(newMessageText)} />

              <div className="flex items-center gap-2">
                <img src="./assets/img/line.png" className="i" />
                <FaFaceSmile
                  className="text-white text-[20px]"
                  onClick={handleShowEmoji}
                />

                <label className="cursor-pointer">
                  <MdOutlineAttachFile className="text-white text-[20px]" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleUpload(e)}
                  />
                </label>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
