import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  stream,
  call,
}) {
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const { recipient } = useAppSelector((state) => state.user);

  return (
    <>
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
          <span>{call.username || "name"}'s video</span>
          {/* Other User Video */}
          {callAccepted && !callEnded && (
            <>
              <div>
                <video playsInline ref={userVideo} autoPlay></video>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
