// NotificationPermission.tsx

function NotificationPermission() {
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  return (
    <div>
      <button onClick={requestPermission}>
        Request Notification Permission
      </button>
    </div>
  );
}

export default NotificationPermission;
