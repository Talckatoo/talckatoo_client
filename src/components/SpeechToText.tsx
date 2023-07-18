import { useEffect, useState } from "react";
import Wave from "./../assests/transcriber-svgrepo-com.svg";
import "./SpeechtoText.css";
import { toast } from "react-toastify";
declare var window: any;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";


interface SpeechTextProps {
  setMessageText: (newMessageText: string) => void;
}

export default function SpeechToText({ setMessageText }: SpeechTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleClickListen = () => {
    setIsListening((prevState) => !prevState);
    setIsClick((prevState) => !prevState);

  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {};
    }
    mic.onstart = () => {
    };

    mic.onresult = (event: any) => {
      const transcript = Array.from(
        event.results as Array<{ [key: string]: any }>
      )
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setMessageText(transcript);
      mic.onerror = (event: any) => {
        toast.error("Error, please try again");
      };
    };
  };

  const Transcribe = (
    <img
      src={Wave}
      alt="Transcribe"
      width="50"
      height="50"
      className="p-1"
    />
  );
  return (
    <>
      <button
      title="Speech to Text"
        className={`bg-slate-300 hover:bg-slate-400 rounded-full m-2 h-9 w-9 ${
          isListening ? "hover:bg-red-300" : ""
        }`}
        onClick={handleClickListen}
      >
        {isClick && isListening ? (
          <div className="">
            <div className="flex items-center justify-center">
              <div className="base">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.5096 9.19531C12.5096 10.5736 11.3879 11.6953 10.0096 11.6953C8.63125 11.6953 7.50959 10.5736 7.50959 9.19531V4.19531C7.50959 2.81698 8.63125 1.69531 10.0096 1.69531C11.3879 1.69531 12.5096 2.81698 12.5096 4.19531V9.19531ZM14.9998 8.36273C15.4607 8.36273 15.8332 8.73606 15.8332 9.19606C15.8332 12.1294 13.6557 14.5561 10.8332 14.9627V16.6661C10.8332 17.1269 10.4607 17.4994 9.99984 17.4994C9.539 17.4994 9.1665 17.1269 9.1665 16.6661V14.9627C6.344 14.5561 4.1665 12.1294 4.1665 9.19606C4.1665 8.73606 4.539 8.36273 4.99984 8.36273C5.46067 8.36273 5.83317 8.73606 5.83317 9.19606C5.83317 11.4936 7.70234 13.3627 9.99984 13.3627C12.2973 13.3627 14.1665 11.4936 14.1665 9.19606C14.1665 8.73606 14.539 8.36273 14.9998 8.36273Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          Transcribe
        )}
      </button>
    </>
  );
}
