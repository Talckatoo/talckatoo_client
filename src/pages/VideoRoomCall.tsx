import End from "../components/VideoCall/End";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useParams, useRouteLoaderData } from "react-router-dom";
import CallUser from "../components/VideoCall/services/CallUser";
import AnswerCall from "../components/VideoCall/services/AnswerCall";
import LeaveCall from "../components/VideoCall/services/LeaveCall";
import { Base64 } from "js-base64";
import { Link, useNavigate } from "react-router-dom";

interface Socket {
  current: any;
}

const VideoRoomCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { roomId, decodedCallData } = useParams();

  const [stream, setStream] = useState(null);
  const [userData, setUserData] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

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
        console.error("Error accessing media stream:", error);
      }
    };

    initializeMediaStream();

    socket?.current?.on("leaveCall", () => {
      // Handle the call ending notification
      console.log("Call ended");
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
    socket?.current?.on("roomCreated", (data: { message: any }) => {});

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("roomCreated");
    };
  }, [socket.current, roomId]);

  const leaveCall = () => {
    LeaveCall(socket, roomId, connectionRef, setCallEnded);
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return (
    <>
      {!callEnded ? (
        <div className="flex flex-col w-full h-full">
          {/* <img
      src="/assets/img/Shapes.png"
      alt="shape"
      className="fixed left-6  -bottom-8 w-[30%] z-[1] "
    />
    <img
      src="/assets/img/Shape.png"
      alt="shape"
      className="fixed right-[2rem]  -top-16 w-[23%] z-[1] "
    /> */}
          <div className="flex h-1/6">
            <div className="w-full flex items-center justify-between max-w-[95%] m-auto">
              <Link to="/" className="font-jakarta text-[20px] font-bold">
                <span>TALCKATOO</span>
              </Link>
            </div>
          </div>
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
        </div>
      ) : (
        <End callEnded={callEnded} />
      )}
    </>
  );
};

export default VideoRoomCall;
