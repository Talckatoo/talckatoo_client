import Peer from "simple-peer";

const AnswerCall = (
  currentStream,
  setCallAccepted,
  callData,
  socket,
  connectionRef,
  userVideo
) => {
  setCallAccepted(true);
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: currentStream,
  });

  console.log(callData)


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
    socket.current.emit("answerCall", { signal: data, callData });
  });

  peer.on("stream", (currentStream) => {
    console.log("stream")
    // console.log({"currentStream": currentStream})
    setTimeout(()=>{
    if (userVideo && userVideo.current ) {
      userVideo.current.srcObject = currentStream;
    }
    }, 1000)

  });

  peer.signal(callData.signal);

  connectionRef.current = peer;
};

export default AnswerCall;
