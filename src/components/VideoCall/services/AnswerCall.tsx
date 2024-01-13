import Peer from "simple-peer";

const AnswerCall = (
  stream,
  setCallAccepted,
  call,
  socket,
  connectionRef,
  userVideo
) => {
  console.log("answer");

  console.log("stream", stream);

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
    console.log("signal");
    console.log("data", data);
    socket.current.emit("answerCall", { signal: data, call });
  });

  peer.on("stream", (currentStream) => {
    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = currentStream;
    }
  });

  peer.signal(call.signal);

  connectionRef.current = peer;
};

export default AnswerCall;
