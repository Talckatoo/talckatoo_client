export default function Notifications({
  answerCall,
  call,
  callAccepted,
  calleeEnded,
}) {
  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div>
          <h2 className="text-black">{call.username} is calling</h2>
          <button
            className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
            onClick={() => answerCall()}
          >
            Answer
          </button>
        </div>
      )}
      {calleeEnded ? (
        <div>
          <span>Call has been ended</span>
        </div>
      ) : null}
    </>
  );
}
