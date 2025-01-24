import { Avatar } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { PiMicrophoneSlashLight } from "react-icons/pi";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  userData,
  video,
  userId,
  userMuteStates,
}: {
  callAccepted: boolean;
  myVideo: any; // Consider using React.RefObject<HTMLVideoElement>
  userVideo: any; // Consider using React.RefObject<HTMLVideoElement>
  callEnded: boolean;
  userData: any;
  video: boolean;
  userId: string;
  userMuteStates: any;
}) {
  console.log("userMuteStates", userMuteStates);
  console.log("userData", userData);
  
  const { user } = useAppSelector((state) => state.auth);
  const { handleCall } = useAppSelector((state) => state.call);
  const { audio } = handleCall;
  const isLocalMuted = !audio;

  const isRemoteMuted = userMuteStates?.get(userData?.from) || false;
  console.log("userData?.userId", userData?.userId);
  console.log("isLocalMuted", isLocalMuted);
  console.log("isRemoteMuted", isRemoteMuted);

  return (
    <div className="flex flex-row w-full h-full">
    {/* My Video */}
    <div className="flex flex-col w-1/2 items-center justify-center m-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">{user?.userName}</span>
        {isLocalMuted && (
          <div
            className="bg-red-500 rounded-full p-1.5"
            title="You are muted"
          >
            <PiMicrophoneSlashLight size={16} className="text-white" />
          </div>
        )}
      </div>
      {video ? (
        <div className="relative w-full h-full bg-black bg-opacity-55 rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-cover rounded"
            playsInline
            muted
            ref={myVideo}
            autoPlay
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-black bg-opacity-55 rounded-xl">
          <Avatar
            src={user?.profileImage?.url}
            alt={user?.userName}
            className="mx-auto rounded min-w-[100px] min-h-[100px] object-cover shadow-sm border-2 border-white"
          />
        </div>
      )}
    </div>

    {/* Remote Video */}
    <div className="flex flex-col w-1/2 items-center justify-center m-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-medium">
          {user?._id === userData?.userIToCall
            ? userData.recipient
            : userData?.username}
        </span>
        {isRemoteMuted && (
          <div
            className="bg-red-500 rounded-full p-1.5"
            title="User is muted"
          >
            <PiMicrophoneSlashLight size={16} className="text-white" />
          </div>
        )}
      </div>
      {callAccepted && !callEnded && (
        <div className="relative w-full h-full bg-black bg-opacity-55 rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-cover rounded"
            playsInline
            ref={userVideo}
            autoPlay
          />
          {!video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar
                src={userData?.profileImage?.url}
                alt={userData?.userName || userData?.recipient}
                className="rounded min-w-[100px] min-h-[100px] object-cover shadow-sm border-2 border-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
}
