import Peer from "simple-peer";

const AnswerCall = (
  currentStream,
  setCallAccepted,
  call,
  socket,
  connectionRef,
  userVideo
) => {
  console.log("answer");

  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: currentStream,
  });
  setCallAccepted(true);

  peer.on("connect", () => {
    console.log("Peer connection established.");
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
    console.log("Signal data generated:", data);
    socket.current.emit("answerCall", { signal: data, call });
  });

  peer.on("stream", (remoteStream) => {
    console.log("Remote stream received in AnswerCall:", remoteStream);

    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = remoteStream;
    }
  });

  peer.signal(call.signal);

  connectionRef.current = peer;
};

export default AnswerCall;
