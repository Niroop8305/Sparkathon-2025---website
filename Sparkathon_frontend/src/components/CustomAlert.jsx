import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const CustomAlert = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info', 'confirm'
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  showConfirmButton = false,
  showCancelButton = false,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, autoCloseDelay, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "confirm":
        return <AlertCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          title: "text-green-900",
          message: "text-green-700",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          title: "text-red-900",
          message: "text-red-700",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          title: "text-yellow-900",
          message: "text-yellow-700",
        };
      case "confirm":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-900",
          message: "text-blue-700",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          title: "text-blue-900",
          message: "text-blue-700",
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Alert Box */}
          <motion.div
            className={`relative bg-white rounded-2xl shadow-2xl border-2 ${colors.border} max-w-md w-full mx-4 overflow-hidden`}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className={`${colors.bg} px-6 py-4 border-b ${colors.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getIcon()}
                  <h3 className={`text-lg font-semibold ${colors.title}`}>
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <div
                className={`text-sm ${colors.message} leading-relaxed whitespace-pre-line`}
              >
                {message}
              </div>
            </div>

            {/* Actions */}
            {(showConfirmButton || showCancelButton) && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                {showCancelButton && (
                  <motion.button
                    onClick={onCancel || onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cancelText}
                  </motion.button>
                )}
                {showConfirmButton && (
                  <motion.button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {confirmText}
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomAlert;
