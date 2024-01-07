import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Peer from "simple-peer";

interface Socket {
  current: any;
}

const VideoCall = ({ socket }: { socket: Socket }): JSX.Element => {
  const { user } = useAppSelector((state) => state.auth);
  const conversationState = useAppSelector((state) => state.conversation);
  const selectedId = conversationState?.conversation?.selectedId;
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

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
      });
    if (socket.current) {
      socket.current.on(
        "callUser",
        ({ signal, from, username: callerName }) => {
          console.log(signal, from, callerName);
          setCall({ isReceivedCall: true, from, username: callerName, signal });
        }
      );
    }
  }, [socket.current]);

  // CALL USER //

  const callUser = () => {
    console.log("call other");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("connect", () => {
      console.log("CONNECT");
      peer.send("whatever" + Math.random());
    });

    peer.on("error", (err) => {
      console.error("Peer error during call:", err);
    });

    peer.on("iceStateChange", (event) => {
      console.log("ICE state change:", event);
    });

    peer.on("icecandidate", (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      }
    });

    peer.on("signal", (data) => {
      console.log({
        "get data in signal from the recipient": JSON.stringify(data),
      });
      socket.current.emit("callUser", {
        userToCall: selectedId,
        signalData: data,
        from: user._id,
        username: user.userName,
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    // Listen to the signal from the other user

    socket.current.on("callAccepted", (signal) => {
      console.log({ "signal from CallAccept": signal });

      console.log("accept call");
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  // ANSWER CALL //   // ANSWER CALL //   // ANSWER CALL //   // ANSWER CALL //   // ANSWER CALL //

  const answerCall = () => {
    console.log("answer call");
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("connect", () => {
      console.log("CONNECT");
      peer.send("whatever" + Math.random());
    });

    peer.on("error", (err) => {
      console.error("Peer error during call:", err);
    });

    peer.on("close", () => {
      console.log("Peer connection closed.");
    });

    peer.on("iceStateChange", (event) => {
      console.log("ICE state change:", event);
    });

    peer.on("icecandidate", (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      }
    });

    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };
  console.log({ callAccepted: callAccepted });
  console.log({ call: call });

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
        <Options
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
          />
        </Options>
      </div>
    </>
  );
};

export default VideoCall;

// https://www.instagram.com/call/
// ?has_video=true
// &ig_thread_id=340282366841710301244259118731407541646
// &server_info_data=GANmcmMYFVJPT006NzA2NjUwMjI3Njc5Nzc0NRgQVUpOamR1V1ByS2F4SWRjRwA%3D
