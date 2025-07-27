import { useState, useCallback } from "react";

export const useAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
    onCancel: null,
    showConfirmButton: false,
    showCancelButton: false,
    autoClose: false,
    autoCloseDelay: 3000,
  });

  const showAlert = useCallback((options) => {
    setAlert({
      isOpen: true,
      title: options.title || "Alert",
      message: options.message || "",
      type: options.type || "info",
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
      showConfirmButton: !!options.onConfirm,
      showCancelButton: !!options.onCancel || options.type === "confirm",
      autoClose: options.autoClose || false,
      autoCloseDelay: options.autoCloseDelay || 3000,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (message, title = "Success") => {
      showAlert({
        type: "success",
        title,
        message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message, title = "Error") => {
      showAlert({
        type: "error",
        title,
        message,
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message, title = "Warning") => {
      showAlert({
        type: "warning",
        title,
        message,
      });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message, title = "Information") => {
      showAlert({
        type: "info",
        title,
        message,
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (message, onConfirm, title = "Confirm Action") => {
      showAlert({
        type: "confirm",
        title,
        message,
        onConfirm: () => {
          onConfirm();
          hideAlert();
        },
        onCancel: hideAlert,
      });
    },
    [showAlert, hideAlert]
  );

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};
