import Peer from "simple-peer";
import { setCall } from "../../../redux/features/call/callSlice";

const CallUser = (
  stream,
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
    socket.current.emit("callUser", {
      userToCall: selectedId,
      signalData: data,
      from: userId,
      username: userName,
      roomId: roomId,
    });
  });

  peer.on("stream", (currentStream) => {
    if (userVideo && userVideo.current) {
      userVideo.current.srcObject = currentStream;
    }
  });

  socket?.current?.on("callAccepted", (signal) => {
    console.log({ "signal from CallAccept": signal });

    console.log("accept call");
    dispatch(
      setCall({
        isReceivedCall: true,
        from: "",
        username: "",
        signal,
        roomId: "",
        userToCall: "",
      })
    );

    setCallAccepted(true);
    if (peer.destroyed) {
      console.warn("Peer instance is destroyed.");
      return;
    }

    peer.signal(signal);
  });

  connectionRef.current = peer;
};

export default CallUser;
