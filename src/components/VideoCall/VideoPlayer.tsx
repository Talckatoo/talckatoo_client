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
      <div className="flex w-1/2 items-center justify-center m-4">
        {/* My Video  */}
        {/* <span className=" items-center justify-center">{user.userName}</span> */}
        <video
          className="mx-auto rounded"
          playsInline
          muted
          ref={myVideo}
          autoPlay
        ></video>
      </div>
      <div className="flex w-1/2 items-center justify-center m-4">
        {/* Other User Video */}
        {/* <span>{userData || "Your"}'s video</span> */}
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
