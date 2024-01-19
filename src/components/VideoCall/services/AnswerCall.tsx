<<<<<<< HEAD
=======

>>>>>>> main
import Peer from "simple-peer";

const AnswerCall = (
  currentStream,
  setCallAccepted,
  callData,
  socket,
  connectionRef,
  userVideo
) => {
<<<<<<< HEAD
  console.log("answer");

=======
  setCallAccepted(true);
>>>>>>> main
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: currentStream,
  });
<<<<<<< HEAD
  setCallAccepted(true);
=======

  console.log(callData)

>>>>>>> main

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
<<<<<<< HEAD
    console.log("Signal data generated:", data);
    socket.current.emit("answerCall", { signal: data, call });
  });

  peer.on("stream", (remoteStream) => {
    console.log("Remote stream received in AnswerCall:", remoteStream);

    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = remoteStream;
=======
    socket.current.emit("answerCall", { signal: data, callData });
  });

  peer.on("stream", (currentStream) => {
    console.log("stream")
    // console.log({"currentStream": currentStream})
    setTimeout(()=>{
    if (userVideo && userVideo.current ) {
      userVideo.current.srcObject = currentStream;
>>>>>>> main
    }
    }, 1000)

  });

  peer.signal(callData.signal);

  connectionRef.current = peer;
};

export default AnswerCall;
