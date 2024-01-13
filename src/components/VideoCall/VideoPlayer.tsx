import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  streamMedia,
  call,
}: {
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  callEnded: boolean;
  streamMedia: any;
  call: any;
}) {
  const { user } = useAppSelector((state) => state.auth);
  
  


  // useEffect(() => {
  //   // if (myVideo.current) {
  //   //   myVideo.current.srcObject = streamMedia;
  //   // }
  //   console.log(myVideo)
  // }, [myVideo]);

  return (
    <div>
      <div>
        {/* My Video  */}

        
            <span>{user.userName}</span>
            <video playsInline muted ref={myVideo} autoPlay></video>
          
        
      </div>
      <div>
        {/* Other User Video */}
        {/* {callAccepted && !callEnded && (
          <>
            <span>{call?.username || "Your"}'s video</span>

            <video playsInline ref={userVideo} autoPlay></video>
          </>
        )} */}
      </div>
    </div>
  );
}
