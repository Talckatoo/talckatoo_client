import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PiMicrophoneLight } from "react-icons/pi";
import { PiPhoneDisconnectLight } from "react-icons/pi";
import { PiEyeLight } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { setHandleCall } from "../../redux/features/call/callSlice";

export default function Options({
  callAccepted,
  callEnded,
  myVideo,
  userVideo,
  leaveCall,
  userData,
  socket,
  stream, 
  roomId,
}) {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { handleCall } = useAppSelector((state) => state.call);
  const { video, audio } = handleCall;

  const handleAudio = () => {
    // Control local audio track
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audio;
      }
    }

    // Update Redux state
    dispatch(
      setHandleCall({
        audio: !audio,
        video: video,
      })
    );

    // Emit mute status to room
    if (socket && roomId) {
      socket.emit("toggleAudioInRoom", {
        roomId,
        userId: user._id,
        isMuted: !audio
      });
    }
  };

  const handleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !video;
        console.log("Video Track enabled:", !video);
      }
    }

    dispatch(
      setHandleCall({
        video: !video,
        audio: audio,
      })
    );
  };

  return (
    <div className="flex items-center justify-center h-full w-full gap-2">
      <button
        className={`flex flex-col items-center rounded-md px-4 py-3 text-white ${
          !audio ? "bg-red-500" : ""
        }`}
        onClick={handleAudio}
      >
        <PiMicrophoneLight size={20} />
        {audio ? <span>{t("Mute")}</span> : <span>{t("Unmute")}</span>}
      </button>

      <button
        className={`flex flex-col items-center rounded-md px-4 py-3 text-white ${
          !video ? "bg-red-500" : ""
        }`}
        onClick={handleVideo}
      >
        <PiEyeLight size={22} />
        {video ? <span>{t("Stop camera")}</span> : <span>{t("Camera")}</span>}
      </button>

      {callAccepted && !callEnded && (
        <button
          className="ml-2 flex flex-col rounded-md px-6 py-[2px] bg-red-600 text-white items-center justify-center"
          onClick={leaveCall}
        >
          <PiPhoneDisconnectLight size={20} />
          Leave
        </button>
      )}
    </div>
  );
}
