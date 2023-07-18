import { useState, ChangeEvent, useEffect, useContext, VoidFunctionComponent } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineClose } from "react-icons/md";
import VoiceMessage from "./VoiceMessage";
import SpeechToText from "./SpeechToText";
import { UserContext } from "../context/user-context";
import { toast } from "react-toastify";

interface ChatInputProps {
  socket: any;
  typing: boolean;
  setTyping: (typing: boolean) => void;
  isTyping: boolean;
  setIsTyping: (isTyping: boolean) => void;
  onHandleSendMessage: (message: string) => void;
  onHandleSendAIMessage: (messageAI: string) => void;
  onHandleTranslateText: (voiceMessage: string) => void
}
const ChatInput = ({
  socket,
  onHandleSendMessage,
  onHandleSendAIMessage,
  typing,
  setTyping,
  onHandleTranslateText,
}: ChatInputProps): JSX.Element => {
  const [showEmoji, setShowEmoji] = useState<boolean>(false);
  const AIcall = import.meta.env.VITE_AI_ASSISTANT_CALL;
  const [messageText, setMessageText] = useState<string>("");
  const { user, selectId, isDarkMode } = useContext(UserContext);


  const handleShowEmoji = () => {
    setShowEmoji(!showEmoji);
  };

  const handleEmojiClick = (event: any) =>
    setMessageText(`${messageText} ${event.emoji}`);

  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.current.emit("isTyping", 
      {
        from: user?._id,
        to: selectId, 
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
          to: selectId, 
        });
        setTyping(false);
      }
    }, timeLength);
  };

  const handleSendMessage = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (messageText.trim() === "") {
      return; 
    }
    if (messageText.substring(0, 7) === AIcall) {
      onHandleSendAIMessage(messageText);
      toast.loading("Please wait",{
        position: toast.POSITION.TOP_CENTER,
        progressClassName: 'success-progress-bar',
        toastId: 2
      });
    } else {
      onHandleSendMessage(messageText);
    }
    setMessageText("");
  };



  return (
    <>
      <div className="flex flex-col">
       <div className="w-full h-1/2">
        <form onSubmit={handleSendMessage} className="flex flex-row">
        <div
              className="m-auto pl-6 relative"
              onClick={handleShowEmoji}
            >
              {showEmoji && (
              <div className="absolute top-0 transform -translate-y-full bg-white rounded shadow-lg p-2">
                <span
                  className="flex items-center justify-end cursor-pointer"
                  onClick={handleShowEmoji}
                >
                  <MdOutlineClose />
                </span>
                <div className="h-full w-full">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              </div>
              )
                }

              <span className="cursor-pointer">
                <BsEmojiSmile
                  style={{
                    width: "30px",
                    height: "30px",
                    color: isDarkMode ? "white" : "black",
                  }}
                />
              </span>
            </div>

            <input
            type="text"
            placeholder="Type your message or type @birdie to call AI Assistant"
            className={`mx-8 mb-2 p-2 flex-grow rounded-xl hover:border-white focus:outline-none shadow-lg 
            ${
              isDarkMode ? "bg-[#161c24]  text-slate-100" :  "bg-slate-200  text-black" 
            } ${
              messageText.startsWith(AIcall) ? "text-yellow-200" : ""
            }`}
            value={messageText}
            onChange={handleTyping}
          />
        
          <button
            type="submit"
            className={`mr-6 my-2 w-10 h-10 rounded-lg flex items-center justify-center ease-in-out duration-300
            ${
              isDarkMode ? "bg-slate-800  text-slate-100" :  "bg-slate-200  text-black" 
            }
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="items-center justify-center w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
        </div>
        <div className="w-full h-1/2">
          <div className="flex flex-row items-center justify-center gap-10">
            <SpeechToText setMessageText={setMessageText} />
            <VoiceMessage socket={socket} onHandleTranslateText={onHandleTranslateText} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
