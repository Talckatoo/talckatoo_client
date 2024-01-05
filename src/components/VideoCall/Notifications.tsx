export default function Notifications({ answerCall, call, callAccepted }) {
  console.log(call);
  console.log(callAccepted);
  return (
    <>
      <span>Notifications</span>

      {call.isReceivedCall && !callAccepted && (
        <div>
          <h2 className="text-black">{call.username} is calling</h2>
          <button
            className="bg-slate-300 hover:bg-red-300 rounded-md h-9 px-2.5"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      )}
    </>
  );
}
