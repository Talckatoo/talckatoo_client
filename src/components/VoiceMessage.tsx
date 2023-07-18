import { useState, useContext, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../context/user-context";
import { FaMicrophone, FaStop, FaPlay, FaPaperPlane } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./VoiceMessage.css";
import RecordRTC from "recordrtc";
import DOMAIN from "../util/url";


interface VoiceMessageProps {
  socket: Socket,
  onHandleTranslateText: (newMessageText: string) => void;
}

interface voiceCode {
  voiceCode: string | undefined
}

const VoiceMessage = ({ socket, onHandleTranslateText }: VoiceMessageProps) => {
  

  const WHISPER_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/translations"
  const { user, selectId, setMessages, language,  } = useContext(UserContext);
  const [isReadyToSend, setIsReadyToSend] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioData, setAudioData] = useState(null);
  const audioRef = useRef(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  // const fullLanguage = languagesArray.map((l) => {
  //   if (l.code === language) return l.language
  // })



  const startRecording = () => {
    setIsRecording(true)
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = {
        type: 'audio',
        mimeType: 'audio/mp3',
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        // checkForInactiveTracks: true,
        // timeSlice: 5000,
        // ondataavailable: (blob) => {
        //   socket.emit('audio', { buffer: blob })
        // },
      }

      const recordRTC = new RecordRTC(stream, options)
      setRecorder(recordRTC)
      recordRTC.startRecording()
    })
  }



  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(async () => {
        let blob = await recorder.getBlob();

        
        var file = new File([blob], 'filename.mp3', {
          type: 'audio/mp3'
      }
      );
  
        setRecordedAudio(file);
        setIsRecording(false);
        setIsReadyToSend(true); // Set the audio ready to be sent
    }
    );
    }
}



  //   if (mediaRecorder && mediaStream) {
  //     mediaRecorder.stop();
  //     mediaRecorder.addEventListener("dataavailable", (event) => {
  //       setRecordedAudio(event.data);
  //     });
  //     setIsRecording(false);
  //     setIsReadyToSend(true); // Set the audio ready to be sent
  //     mediaStream.getTracks().forEach((track) => track.stop());
  //   }
  // };



  const sendAudio = async () => {
    if (recordedAudio) {
      const formData = new FormData();

      formData.append("audio", recordedAudio);
      formData.append("from", user?._id);
      formData.append("to", selectId);

      try {
        const { data } = await axios.post(
          `${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/messages/voice-note`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { message } = data;
        setMessages((prev) => [
          ...prev,
          {
            createdAt: message.createdAt,
            voiceNote: {
              url: message.voiceNote.url,
            },
            sender: user?._id,
            _id: message._id,
          },
        ]);

        socket.current.emit("sendMessage", {
          createdAt: message.createdAt,
          voiceNote: {
            url: message.voiceNote.url,
          },
          from: user?._id,
          to: selectId,
        });
        setRecordedAudio(null);
      } catch (err) {
        toast.error("Error sending messages, please try again");
      }
    }
  };

  const playAudio = () => {
    if (recordedAudio) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audioElement = new Audio(audioUrl);
      audioElement.play();
    }
  };

  const removeAudio = () => {
    setRecordedAudio(null);
  };

  const handleTranslateAudio = async () => {

    const formData = new FormData()

    if(recordedAudio) {
      formData.append("file", recordedAudio)
      formData.append("model", "whisper-1")
      formData.append("language", "en")
      if(recordedAudio.size > 25 * 1024 * 1024) {
        toast.error("Please upload an audio file less than 25MB")
        return
    }
    }

    try {
      const response = await fetch(WHISPER_TRANSCRIPTION_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
          method: "POST",
          body: formData
      })
      const data = await response.json()
      onHandleTranslateText(data)

     
  } catch (err) {
      console.log(err);
  } 
  }

  // URL.revokeObjectURL(audioURL);

  return (
    <>
      <div className="">
        <div className="flex flex-row gap-10">
          <button
          title="Voice message"
            onClick={startRecording}
            className="bg-slate-300 hover:bg-slate-400  rounded-full px-2.5 h-9 w-9 items-center justify-center"
          >
            <FaMicrophone />
          </button>
          {recordedAudio ? (
            <>
              <button
                onClick={playAudio}
                className="bg-slate-300 hover:bg-slate-400 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <FaPlay />
              </button>
              <button
                onClick={removeAudio}
                className="bg-slate-300 hover:bg-red-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <MdDelete />
              </button>
              <button
                onClick={sendAudio}
                className="bg-slate-300 hover:bg-green-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                <FaPaperPlane />
              </button>
              <button
                onClick={handleTranslateAudio}
                className="bg-slate-300 hover:bg-green-300 rounded-full h-9 px-2.5"
                disabled={!isReadyToSend}
              >
                Translate
              </button>
            </>
          ) : null}

          {isRecording ? (
            <>
              <div className="w-1/5">
                <div className="flex items-center justify-center">
                  <div id="bars">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                </div>
              </div>
              <button
                onClick={stopRecording}
                className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
              >
                <FaStop />
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div>
      {/* {audioURL && (
        <audio ref={audioRef} controls>
          <source src={audioURL} type="audio/mp3" />
        </audio>
      )} */}
    </div>

    </>
  );
};

export default VoiceMessage;