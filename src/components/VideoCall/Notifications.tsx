export default function Notifications({ answerCall, call, callAccepted }) {
  return (
    <>
      <div>Noti</div>
      {call.isReceivedCall && !callAccepted && (
        <div>
          <h2>{call.username} is calling</h2>
          <button onClick={answerCall}>Answer</button>
        </div>
      )}
    </>
  );
}
