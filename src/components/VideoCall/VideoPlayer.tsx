import { Avatar } from "@mui/material";
import { useAppSelector } from "../../redux/hooks";

export default function VideoPlayer({
  callAccepted,
  myVideo,
  userVideo,
  callEnded,
  userData,
  video,
}: {
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  callEnded: boolean;
  userData: any;
  video: boolean;
}) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col w-1/2 items-center justify-center m-4">
        <span>{user?.userName}</span>
        {video ? (
          <video
            className="mx-auto rounded"
            playsInline
            muted
            ref={myVideo}
            autoPlay
          ></video>
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
      <div className="flex flex-col w-1/2 items-center justify-center m-4">
        {/* Other User Video */}
        {user?._id === userData?.userId ? (
          <span>{userData.recipient}</span>
        ) : null}

        <video
          className="mx-auto rounded"
          playsInline
          ref={userVideo}
          autoPlay
        ></video>
      </div>
    </div>
  );
}
