import { useState, useEffect } from 'react';

interface NotifyProps {
  type: string;
  message: string;
  dismissNotification: () => void; // Function to dismiss notification
}

const Notify = ({ type, message, dismissNotification }: NotifyProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      dismissNotification(); // Dismiss notification after timeout
    }, 5000); // 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [dismissNotification]); // Add dismissNotification to dependencies

  let bgColor, borderColor, textColor;

  switch (type) {
    case 'warning':
      bgColor = 'bg-yellow-200';
      borderColor = 'border-yellow-500';
      textColor = 'text-yellow-800';
      break;
    case 'success':
      bgColor = 'bg-green-200';
      borderColor = 'border-green-500';
      textColor = 'text-green-800';
      break;
    case 'error':
      bgColor = 'bg-red-200';
      borderColor = 'border-red-500';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-200';
      borderColor = 'border-gray-500';
      textColor = 'text-gray-800';
  }

  const handleDismiss = () => {
    setIsVisible(false);
    dismissNotification(); // Dismiss notification manually
  };

  return (
    <>
      {isVisible && (
        <div className={`${bgColor} fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 border-l-4 rounded-lg z-50`}>
          <div className={`p-4 ${bgColor} ${borderColor} ${textColor}`}>
            <p className="font-semibold">{message}</p>
            <button onClick={handleDismiss} className="absolute top-1 right-1" aria-label="Dismiss">
              &#10005; {/* Close symbol */}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
