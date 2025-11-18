import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MessageComponent = ({ error, success, errorId, message_id }) => {
  const [showError, setShowError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);
  const time = Date.now();

  useEffect(() => {
    if (error) {
      setShowError(`${error}-${Date.now()}`); // Force re-trigger
      const timer = setTimeout(() => setShowError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, errorId]);

  useEffect(() => {
    if (success) {
      setShowSuccess(`${success}-${Date.now()}`); // Force re-trigger
      const timer = setTimeout(() => setShowSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, message_id]);

  const messageVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <AnimatePresence>
        {showError && (
          <motion.div
            key="error"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="alert alert-danger shadow rounded"
            role="alert"
          >
            {showError.split("-")[0]}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowError(null)}
            ></button>
          </motion.div>
        )}
        {showSuccess && (
          <motion.div
            key="success"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="alert alert-success shadow rounded"
            role="alert"
          >
            {showSuccess.split("-")[0]}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowSuccess(null)}
            ></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageComponent;
