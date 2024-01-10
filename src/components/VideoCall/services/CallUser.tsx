import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";

const CallUser = (stream, roomId, selectedId, userId, userName, socket) => {
  // CALL USER //
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
      from: userId,
      username: userName,
      roomId: roomId,
    });
  });

  // peer.on("stream", (currentStream) => {
  //   if (userVideo && userVideo.current) {
  //     userVideo.current.srcObject = currentStream;
  //   }
  // });

  // Listen to the signal from the other user

  //   socket.current.on("callAccepted", (signal) => {
  //     console.log({ "signal from CallAccept": signal });

  //     console.log("accept call");
  //     setCallAccepted(true);
  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
};

export default CallUser;
