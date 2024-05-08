import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { PiMicrophoneLight } from "react-icons/pi";
import { PiPhoneDisconnectLight } from "react-icons/pi";
import { PiEyeLight } from "react-icons/pi";
import { useTranslation } from 'react-i18next';

export default function Options({
  callAccepted,
  callEnded,
  myVideo,
  userVideo,
  leaveCall,
  userData,
}) {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-full w-full gap-2">
      <button className="flex flex-col items-center rounded-md px-4 py-3 text-white">
        <PiMicrophoneLight size={20} />
        <span>{t("Microphone")}</span>
      </button>

      {/* Button 3 */}
      <button className="flex flex-col items-center rounded-md px-4 py-3 text-white">
        <PiEyeLight size={22} />
        <span>{t("Camera")}</span>
      </button>

      {/* Button 4 */}
      {/* <button className="flex rounded-md px-4 py-3 text-white items-center justify-center">
        Share screen
      </button> */}

      {callAccepted && !callEnded ? (
        <button
          className="ml-2 flex flex-col rounded-md px-6 py-[2px] bg-red-600 text-white items-center justify-center"
          onClick={leaveCall}
        >
          <PiPhoneDisconnectLight size={20} />
          Leave
        </button>
      ) : null}
    </div>
  );
}
