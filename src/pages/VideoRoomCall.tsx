import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CallUser from "../components/VideoCall/services/callUser";
import AnswerCall from "../components/VideoCall/services/AnswerCall";

interface Socket {
  current: any;
}

const VideoRoomCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const { call } = useAppSelector((state) => state.call);

  const { roomId, selectedId, userId, userName } = useParams();
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
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        if (user._id == userId) {
          CallUser(
            currentStream,
            roomId,
            selectedId,
            userId,
            userName,
            socket,
            connectionRef,
            userVideo,
            setCallAccepted,
            dispatch
          );
        } else {
          AnswerCall(
            currentStream,
            setCallAccepted,
            call,
            socket,
            connectionRef,
            userVideo
          );
        }
      });

    return () => {
      // Clean up event listeners on component unmount
      socket.current.off("callAccepted");
    };
  }, [socket.current, roomId]);

  useEffect(() => {
    socket?.current?.on("roomCreated", (data: { message: any }) => {
      console.log(data.message);
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
          stream={stream}
          call={call}
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

// https://www.instagram.com/call/
// ?has_video=true
// &ig_thread_id=340282366841710301244259118731407541646
// &server_info_data=GANmcmMYFVJPT006NzA2NjUwMjI3Njc5Nzc0NRgQVUpOamR1V1ByS2F4SWRjRwA%3D

// https://www.facebook.com/
// groupcall/
// ROOM:7260592670670331/
// ?call_id=536313397&has_video=false&initialize_video=false&is_e2ee_mandated=false&nonce=hz6ddct43j0g&referrer_context=zenon_precall&thread_type=1&users_to_ring[0]=100004132960478&use_joining_context=true&peer_id=100004132960478&av=100023790437452&server_info_data=GANmcmMYFVJPT006NzI2MDU5MjY3MDY3MDMzMRgQUHdWVnRZZlNCendGbEZidwA%3D
