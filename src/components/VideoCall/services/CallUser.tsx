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
  setCallAccepted
) => {
  let peer;

  // Function to initialize the peer connection
  const initializePeer = () => {
    peer = new Peer({
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
      // Attempt to reconnect if an error occurs
      reconnect();
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

    socket?.current?.on("callAccepted", (data) => {
      setCallAccepted(true);
      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  // Function to attempt reconnection
  const reconnect = () => {
    console.log("Attempting to reconnect...");
    initializePeer(); // Reinitialize the peer connection
  };

  // Initialize the peer connection
  initializePeer();
};

export default CallUser;
