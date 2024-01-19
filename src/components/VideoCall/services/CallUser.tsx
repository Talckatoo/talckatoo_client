<<<<<<< HEAD

=======
>>>>>>> main
import Peer from "simple-peer";


const CallUser = (
  currentStream,
  roomId,
  selectedId,
  userId,
  userName,
  socket,
  connectionRef,
  userVideo,
  setCallAccepted,

) => {
  // CALL USER //

<<<<<<< HEAD
  console.log("call other");
=======
>>>>>>> main
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: currentStream,
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
    socket.current.emit("callUser", {
      userToCall: selectedId,
      signalData: data,
      from: userId,
      username: userName,
      roomId: roomId,
    });
  });

  peer.on("stream", (currentStream) => {
<<<<<<< HEAD
    console.log("stream");
    console.log({ currentStream: currentStream });
    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = currentStream;
    }
    console.log({ "userVideo in callUser": userVideo });
=======
    // console.log("stream")
    // console.log({"currentStream": currentStream})

      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
   

>>>>>>> main
  });


<<<<<<< HEAD
  socket?.current?.on("callAccepted", (signal: string | Peer.SignalData) => {
    console.log({ "signal from CallAccept": signal });
    console.log("accept call");

=======
  socket?.current?.on("callAccepted", (data) => {
 console.log(data)
>>>>>>> main
    setCallAccepted(true);

    peer.signal(data.signal);
  });

  connectionRef.current = peer;
};

export default CallUser;
