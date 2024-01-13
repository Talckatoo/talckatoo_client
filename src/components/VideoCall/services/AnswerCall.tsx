import Peer from "simple-peer";

const AnswerCall = (
  thisStream,
  setCallAccepted,
  call,
  socket,
  connectionRef,
  userVideo
) => {


  setCallAccepted(true);
  const peer = new Peer({
    initiator: false,
    trickle: false,
    thisStream,
  });

  peer.on("connect", () => {
    console.log("CONNECT");
    peer.send("whatever" + Math.random());
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
    socket.current.emit("answerCall", { signal: data, call });
  });

  peer.on("stream", (currentStream) => {
    console.log("stream")
    try {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    } catch (error) {
      console.error("Error setting stream to video element:", error);
    }
  });

  peer.signal(call.signal);
  peer.on("error", (err) => {
    console.error("Peer error during call:", err);
  });

  connectionRef.current = peer;
};

export default AnswerCall;
