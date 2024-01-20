import { Base64 } from "js-base64";
import { useAppSelector } from "../../../redux/hooks";

const HandleCall = (user, selectedId) => {


    const encodedCallData = Base64.fromUint8Array(
        new TextEncoder().encode(
          JSON.stringify({
            selectedId,
            userId: user._id,
            userName: user.userName,
          })
        )
      );
  
    const videoCallUrl = `/call/${Math.random()
        .toString(36)
        .slice(2)}/${encodedCallData}`;

    window.open(videoCallUrl, "_blank");
};

export default HandleCall;
