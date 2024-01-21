import { Base64 } from "js-base64";

const HandleAnswerCall = (setOpen, setReceivedCall, decodedCallData) => {
  setReceivedCall({ isReceivedCall: false });
  setOpen(false);

  const decodedUint8Array = decodedCallData
    ? Base64.toUint8Array(decodedCallData)
    : null;

  // Convert the Uint8Array to a string
  const decodedString = new TextDecoder().decode(
    decodedUint8Array as AllowSharedBufferSource
  );

  // Parse the JSON string to get the original data
  const data = JSON.parse(decodedString);

  // Now you can use the decoded data as needed

  const videoCallUrl = `/call/${data.roomId}/${decodedCallData}`;
  window.open(videoCallUrl, "_blank");
};

export default HandleAnswerCall;
