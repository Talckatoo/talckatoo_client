import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  userData,
}: {
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  callEnded: boolean;
  userData: any;
}) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col w-1/2 items-center justify-center m-4">
        <span>{userData?.username}</span>
        <video
          className="mx-auto rounded"
          playsInline
          muted
          ref={myVideo}
          autoPlay
        ></video>
      </div>
      <div className="flex flex-col w-1/2 items-center justify-center m-4">
        {/* Other User Video */}
        {user?._id === userData?.userId ? (
          <span>{userData.recipient}</span>
        ) : null}
        <video
          className="mx-auto rounded"
          playsInline
          ref={userVideo}
          autoPlay
        ></video>
      </div>
    </div>
  );
}
