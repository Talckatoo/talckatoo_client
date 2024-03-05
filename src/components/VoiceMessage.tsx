import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaMicrophone, FaStop, FaPlay, FaPaperPlane } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./VoiceMessage.css";
import RecordRTC from "recordrtc";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addMessage } from "../redux/features/messages/messageSlice";
import { Socket } from "socket.io-client";
import { useSendAudioMutation } from "../redux/services/MessagesApi";
import { useUploadFileMutation } from "../redux/services/MediaApi";
import { HiTranslate } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface VoiceMessageProps {
  socket: Socket;
  onHandleTranslateText: (newMessageText: string) => void;
}

interface voiceCode {
  voiceCode: string | undefined;
}

const VoiceMessage = ({
  socket,
  onHandleTranslateText,
}: VoiceMessageProps) => {
  const WHISPER_TRANSCRIPTION_URL = import.meta.env
    .VITE_WHISPER_TRANSCRIPTION_URL;

  const { user } = useAppSelector((state) => state.auth);
  const { messages } = useAppSelector((state) => state.messages);
  const conversationState = useAppSelector((state) => state.conversation);

  const selectedId = conversationState?.conversation?.selectedId;
  const conversationId = conversationState?.conversation?.conversationId;

  const [sendAudio, { isLoading: isSendingAudio }] = useSendAudioMutation();
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const dispatch = useAppDispatch();

  const [isReadyToSend, setIsReadyToSend] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isTranslationLoading, setIsTranslationLoading] = useState<boolean>(false);
  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const options = {
        type: "audio",
        mimeType: "audio/mp3",
        numberOfAudioChannels: 1,
        recorderType: RecordRTC.StereoAudioRecorder,
        // checkForInactiveTracks: true,
        // timeSlice: 5000,
        // ondataavailable: (blob) => {
        //   socket.emit('audio', { buffer: blob })
        // },
      };

      const recordRTC = new RecordRTC(stream, options);
      setRecorder(recordRTC);
      recordRTC.startRecording();
    });
  };

  const handleUpload = async (file: any) => {
    let response: any = null;
    let formData = new FormData();
    formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type.split("/")[0]);
    formData.append("altText", file.name);

    response = await uploadFile(formData);

    if ("data" in response) {
      if (response.data && !response.data.error) {
        setAudioURL(response.data.media.url);
        return response.data.media.url;
      } else {
        console.log("error", response.data.error);
      }
    } else {
      console.log("error", response.error);
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(async () => {
        let blob = await recorder.getBlob();

        var file = new File([blob], "filename.mp3", {
          type: "audio/mp3",
        });

        setRecordedAudio(file);

        setIsRecording(false);
        setIsReadyToSend(true); // Set the audio ready to be sent
      });
    }
  };

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

  const handleSendAudio = async () => {
    if (recordedAudio) {
      const audioResponse = await handleUpload(recordedAudio);

      const formData = new FormData();

      if (audioResponse) formData.append("url", audioResponse);
      formData.append("from", user?._id);
      if (selectedId) formData.append("to", selectedId);

      try {
        const response = await sendAudio(formData).unwrap();

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
          createdAt: message.createdAt,
          voiceNote: {
            url: message.voiceNote.url,
          },
          from: user?._id,
          to: selectedId,
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
    setIsTranslationLoading(true);
    const formData = new FormData();

    if (recordedAudio) {
      formData.append("file", recordedAudio);
      formData.append("model", "whisper-1");
      formData.append("language", "en");
      if (recordedAudio.size > 25 * 1024 * 1024) {
        toast.error("Please upload an audio file less than 25MB");
        return;
      }
    }

    try {
      const response = await fetch(WHISPER_TRANSCRIPTION_URL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      onHandleTranslateText(data);
      setIsTranslationLoading(false);
      setRecordedAudio(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex flex-row gap-4 relative">
          <button
            title="Voice message"
            onClick={startRecording}
            className=" hover:text-slate-400   px-2.5  items-center justify-center"
          >
            <FaMicrophone className="text-white text-[20px]" />
          </button>
          {recordedAudio && !isRecording ? (
            <>
              <button
                onClick={playAudio}
                disabled={!isReadyToSend}
                className=" hover:text-slate-400   px-2.5  items-center justify-center"
              >
                <FaPlay className="text-white text-[20px]" />
              </button>
              <button
                onClick={removeAudio}
                className=" hover:text-slate-400   px-2.5  items-center justify-center"
                disabled={!isReadyToSend}
              >
                <MdDelete className="text-white text-[20px]" />
              </button>
              <button
                onClick={handleSendAudio}
                disabled={!isReadyToSend}
                className="hover:text-slate-400 mr-3 relative px-2.5 items-center justify-center group"
              >
                {isSendingAudio ? (
                  <FontAwesomeIcon
                    className="text-white"
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  <>
                    <FaPaperPlane className="text-white text-[20px]" />
                    <span className="tooltip">
                      {isSendingAudio ? "Sending..." : "Send Your Audio"}
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={handleTranslateAudio}
                className="hover:text-slate-400 mr-3 relative px-2.5 items-center justify-center group"
                disabled={!isReadyToSend}
              >
                {isTranslationLoading ? (
                  <FontAwesomeIcon
                    className="text-white"
                    icon={faSpinner}
                    spin
                  />
                ) : (
                  <>
                    <HiTranslate className="text-white text-[20px]" />
                    <span className="tooltip">Translate Your Audio</span>
                  </>
                )}
              </button>
            </>
          ) : null}

          {isRecording ? (
            <>
              <div className="w-1/4 h-8">
                <div className="flex items-center justify-center  mx-5">
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
              <button onClick={stopRecording}>
                <FaStop className="text-white text-[20px] ml-3" />
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
