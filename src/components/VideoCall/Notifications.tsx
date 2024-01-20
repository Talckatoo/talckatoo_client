export default function Notifications({ calleeEnded }) {
  return (
    <>
      {calleeEnded ? (
        <div>
          <span>Call has been ended</span>
        </div>
      ) : null}
    </>
  );
}
