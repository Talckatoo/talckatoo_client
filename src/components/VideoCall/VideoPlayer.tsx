import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  // calleeData
}: {
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  callEnded: boolean;
  // calleeData: any;
}) {
  const { user } = useAppSelector((state) => state.auth);


  // useEffect(()=>{
  //   if (calleeData){

  //     console.log(calleeData)
      
  //   }
  // }, [ calleeData])


  


  return (
    <div>
      <div>
        {/* My Video  */}

        <>
          <span>{user.userName}</span>
          <video playsInline muted ref={myVideo} autoPlay></video>
        </>
      </div>
      <div>
        {/* Other User Video */}

          <>
            {/* <span>{calleeData|| "Your"}'s video</span> */}

            <video playsInline ref={userVideo} autoPlay></video>
          </>
  
      </div>
    </div>
  );
}
