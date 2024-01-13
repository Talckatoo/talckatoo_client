import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  stream,
  call,
}: {
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  callEnded: boolean;
  stream: any;
  call: any;
}) {
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const { recipient } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo]);

  return (
    <div>
      <div>
        {/* My Video  */}
        {stream && (
          <>
            <span>{user.userName}</span>
            <video playsInline muted ref={myVideo} autoPlay></video>
          </>
        )}
      </div>
      <div>
        {/* Other User Video */}
        {callAccepted && !callEnded && (
          <>
            <span>{call.username || "Your"}'s video</span>

            <video playsInline ref={userVideo} autoPlay></video>
          </>
        )}
      </div>
    </div>
  );
}
