import React, { useEffect } from "react";

function Notification({ message, onClose, color = "#32CD32", duration = 2000 }) {
  // Set text color based on background color
  const textColor = color === "#FFFFFF" ? "#000000" : "#FFFFFF";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    // Clear the timeout if the component unmounts or if message changes
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null; // Do not render if there is no message

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        style={{ backgroundColor: color, color: textColor }}
        className="rounded shadow-lg py-3 px-8 font-semibold text-center"
      >
        {message}
      </div>
    </div>
  );
}

export default Notification;
