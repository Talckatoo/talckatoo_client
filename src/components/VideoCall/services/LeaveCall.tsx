const LeaveCall = (socket, roomId, connectionRef, setCallEnded) => {
  if (socket.current) {
    socket.current.emit("leaveCall", {
      roomId,
    });
  }
  setCallEnded(true);
  if (connectionRef.current) {
    connectionRef.current.destroy();
  }
};

export default LeaveCall;
