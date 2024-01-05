import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import Button from "../../UI/Button";

export default function Options({
  callAccepted,
  callEnded,
  myVideo,
  userVideo,
  leaveCall,
  callUser,
  children,
}) {
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const { recipient } = useAppSelector((state) => state.user);
  console.log(selectedId);
  return (
    <div>
      {callAccepted && !callEnded ? (
        <button
          className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
          onClick={leaveCall}
        >
          Hang up
        </button>
      ) : (
        <button
          className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
          onClick={() => callUser(selectedId)}
        >
          Call
        </button>
      )}
      {children}
    </div>
  );
}
