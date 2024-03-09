import End from "../components/VideoCall/End";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../redux/hooks";
import { useParams } from "react-router-dom";
import CallUser from "../components/VideoCall/services/CallUser";
import AnswerCall from "../components/VideoCall/services/AnswerCall";
import LeaveCall from "../components/VideoCall/services/LeaveCall";
import { Base64 } from "js-base64";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Socket {
  current: any;
}

const VideoRoomCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const { roomId, decodedCallData } = useParams();
  const [stream, setStream] = useState(null);
  const [userData, setUserData] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [media, setMedia] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const initializeMediaStream = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(currentStream);

        if (!stream) return;

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }

        // Call CallUser or AnswerCall here
        const decodedUint8Array = decodedCallData
          ? Base64.toUint8Array(decodedCallData)
          : null;

        const decodedString = new TextDecoder().decode(
          decodedUint8Array as AllowSharedBufferSource
        );

        const data = JSON.parse(decodedString);

        const callData = {
          roomId: roomId,
          signal: data.signal,
          selectedId: data.userToCall,
          from: data.from,
          userName: data.username,
          recipient: data.recipient,
        };

        setUserData(data);

        if (user._id === data.userId) {
          CallUser(
            currentStream,
            roomId,
            data.selectedId,
            data.userId,
            data.userName,
            socket,
            connectionRef,
            userVideo,
            setCallAccepted
          );
        } else {
          AnswerCall(
            currentStream, // Pass the current stream here
            setCallAccepted,
            callData,
            socket,
            connectionRef,
            userVideo
          );
        }
      } catch (error) {
        console.log(error);
        // if (error instanceof DOMException && error.name === 'NotFoundError') {
        // setMedia(false);
        // if (socket.current) {
        //   socket.current.emit("leaveCall", {
        //     roomId,
        //   });
        // }
        // if (connectionRef.current) {
        //   connectionRef.current.destroy();
        // }
        // }       
      }
    };

    initializeMediaStream();

    socket?.current?.on("leaveCall", () => {
      setCallEnded(true);
      setCallAccepted(false);

      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    });

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("callUser");
      socket.current.off("answerCall");
      socket.current.off("callEnded");
      socket.current.off("calleeEnded");
      socket.current.off("callAccepted");
      socket.current.off("leaveCall");
    };
  }, [socket.current, roomId, decodedCallData]);

  useEffect(() => {
    socket?.current?.on("roomCreated", (data: { message: any }) => { });

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("roomCreated");
    };
  }, [socket.current, roomId]);

  const leaveCall = () => {
    LeaveCall(socket, roomId, connectionRef, setCallEnded);
  };

  return (
    <>
      {!callEnded ? (
        <div className="flex flex-col w-full h-full">
          <div className="flex h-1/6">
            <div className="w-full flex items-center justify-between max-w-[95%] m-auto">
              <Link to="/" className="font-jakarta text-[20px] font-bold">
                <span>TALCKATOO</span>
              </Link>
            </div>
          </div>
          {media ? ( // Check if media access error occurred
            <>
              <div className="flex w-full h-full">
                <VideoPlayer
                  callAccepted={callAccepted}
                  myVideo={myVideo}
                  userVideo={userVideo}
                  callEnded={callEnded}
                  userData={userData}
                />
              </div>
              <div className="flex h-1/6 bg-[#25282C]">
                <Options
                  callAccepted={callAccepted}
                  callEnded={callEnded}
                  myVideo={myVideo}
                  userVideo={userVideo}
                  leaveCall={leaveCall}
                  userData={userData}
                ></Options>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 font-bold">Failed to access camera or microphone. Please check your settings and try again.</p>
            </div>
          )}
        </div>
      ) : (
        <End callEnded={callEnded} />
      )}
    </>
  );
};

export default VideoRoomCall;
