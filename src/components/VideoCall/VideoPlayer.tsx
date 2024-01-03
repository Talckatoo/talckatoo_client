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
  console.log(recipient);

  return (
    <div>
      {/* Our Video  */}
      {stream && (
        <>
          <span>{user.userName}</span>
          <video playsInline muted ref={myVideo} autoPlay></video>
        </>
      )}

      {/* User Video */}
      <span>{recipient.userName}</span>
      <video playsInline muted ref={userVideo} autoPlay></video>
    </div>
  );
}
