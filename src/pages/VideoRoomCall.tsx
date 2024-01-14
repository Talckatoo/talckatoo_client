import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CallUser from "../components/VideoCall/services/CallUser";
import AnswerCall from "../components/VideoCall/services/AnswerCall";
import { Base64 } from "js-base64";

interface Socket {
  current: any;
}

const VideoRoomCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);

  const { roomId, decodedCallData } = useParams();
  const [stream, setStream] = useState(null);
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

        // setStream(currentStream);

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

        if (user._id === data.userId) {
          CallUser(
            currentStream, // Pass the current stream here
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
      socket.current.off("callAccepted");
    };
  }, [socket.current, roomId, decodedCallData, myVideo.current]);



  useEffect(() => {
    socket?.current?.on("roomCreated", (data: { message: any }) => {
    });

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("roomCreated");
    };
  }, [socket.current, roomId]);

  return (
    <>
      <div>
        <span>Video Call</span>
        <VideoPlayer
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          callEnded={callEnded}
          // call={call}
        />
        {/* <Options
          callAccepted={callAccepted}
          callEnded={callEnded}
          myVideo={myVideo}
          userVideo={userVideo}
          leaveCall={leaveCall}
          callUser={callUser}
        >
          <Notifications
            answerCall={answerCall}
            call={call}
            callAccepted={callAccepted}
            calleeEnded={calleeEnded}
          />
        </Options> */}
      </div>
    </>
  );
};

export default VideoRoomCall;

