import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useParams } from "react-router-dom";
import CallUser from "../components/VideoCall/services/CallUser";
import AnswerCall from "../components/VideoCall/services/AnswerCall";
import { Base64 } from "js-base64";
import { Link, useNavigate } from "react-router-dom";

interface Socket {
  current: any;
}

const VideoRoomCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);

  const { roomId, decodedCallData } = useParams();
  const [stream, setStream] = useState(null);
  const [userData, setUserData] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const dispatch = useAppDispatch();

  const [callEnded, setCallEnded] = useState(false);
  const [calleeEnded, setCalleeEnded] = useState(false);
  const navigate = useNavigate();

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const navigateChat = () => {
    navigate("/chat");
  };

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

        setUserData(data.username);

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
            setCallAccepted,
            dispatch
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

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("callUser");
      socket.current.off("answerCall");
      socket.current.off("callEnded");
      socket.current.off("calleeEnded");
      socket.current.off("callAccepted");
      socket.current.off("callRejected");
    };
  }, [socket.current, roomId, decodedCallData]);

  useEffect(() => {
    socket?.current?.on("roomCreated", (data: { message: any }) => {});

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("roomCreated");
    };
  }, [socket.current, roomId]);

  return (
    <>
      <div className="flex flex-col w-full h-full">
        {/* <img
          src="/assets/img/wave.svg"
          alt="shape"
          className="fixed top-[-5rem] right-0 max-lg:w-[350px]"
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
            // leaveCall={leaveCall}
            // callUser={callUser}
          >
            <Notifications calleeEnded={calleeEnded} />
          </Options>
        </div>
      </div>
    </>
  );
};

export default VideoRoomCall;
