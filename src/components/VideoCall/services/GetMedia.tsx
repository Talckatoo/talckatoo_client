import Notifications from "../components/VideoCall/Notifications";
import VideoPlayer from "../components/VideoCall/VideoPlayer";
import Options from "../components/VideoCall/Options";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Peer from "simple-peer";
import { useNavigate } from "react-router-dom";

const GetMedia = () => {
  // const [stream, setStream] = useState(null);
  // const myVideo = useRef(null);
  // navigator.mediaDevices
  //   .getUserMedia({
  //     video: true,
  //     audio: true,
  //   })
  //   .then((currentStream) => {
  //     setStream(currentStream);
  //     if (myVideo.current) {
  //       myVideo.current.srcObject = currentStream;
  //     }
  //   });
};

export default GetMedia;
