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
  // console.log(user?._id);
  // console.log(userData?.userId);
  // console.log(userData?.selectedId);

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
        {/* {user?._id === userData?.userId ? (
          <span>{userData.selectedId}</span>
        ) : (
          <span>{userData?.username}'s video</span>
        )} */}
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
