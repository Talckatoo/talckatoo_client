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
        <div className='fixed top-0 left-0 w-full h-full flex bg-black opacity-[0.9] z-[99999] items-center justify-center'>
          <div className='bg-white opacity-100 fixed w-[400px] h-[400px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 border-l-4 rounded-lg z-50 flex flex-col items-center justify-evenly'>
            <div className={`p-6  w-[50%] h-[50%] flex justify-center items-center ${bgColor} ${borderColor} ${textColor}`}>
              <p className="font-semibold text-wrap">{message}</p>
              <button onClick={handleDismiss} className="absolute top-1 right-2" aria-label="Dismiss">
                &#10005;
              </button>
            </div>
            <h3 className='fixed bottom-0  text-center'>TalckaToo</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
