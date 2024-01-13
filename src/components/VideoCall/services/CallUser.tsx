import Peer from "simple-peer";
import { setCall } from "../../../redux/features/call/callSlice";

const CallUser = (
  thisStream,
  roomId,
  selectedId,
  userId,
  userName,
  socket,
  connectionRef,
  userVideo,
  setCallAccepted,
  dispatch
) => {


  const peer = new Peer({
    initiator: true,
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
//Byron data
// call: Byron
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
    console.log("stream")

    try {
      if (userVideo && userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    } catch (error) {
      console.error("Error setting stream to video element:", error);
    }
  });

  socket?.current?.on("callAccepted", (data) => {
    console.log({ data});

    console.log("accept call");
    dispatch(
      setCall({
        isReceivedCall: true,
        from: data.call.from,
        username: data.call.username,
        signal: data.signal,
        roomId: data.call.roomId,
        userToCall: data.call.userToCall,
      })
    );

    setCallAccepted(true);
    peer.signal(data.signal);

    peer.on("error", (err) => {
      console.error("Peer error during call:", err);
    });
  });

  connectionRef.current = peer;
};

export default CallUser;
