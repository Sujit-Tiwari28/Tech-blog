import { createContext, useContext, useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const notify = (type, message) => {
    setToast({ id: Date.now(), type, message });
    window.setTimeout(() => setToast(null), 3500);
  };

  const value = useMemo(
    () => ({
      success: (message) => notify('success', message),
      error: (message) => notify('error', message),
    }),
    []
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {toast && <Toast type={toast.type} message={toast.message} />}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
