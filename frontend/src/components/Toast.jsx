const toastStyles = {
  success: 'bg-emerald-500 text-slate-950',
  error: 'bg-rose-500 text-white',
};

const Toast = ({ type = 'success', message }) => {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-xs items-center rounded-3xl px-4 py-3 shadow-soft transition-transform duration-300 sm:max-w-sm">
      <div className={`w-full rounded-3xl px-4 py-3 text-sm font-medium shadow-lg ${toastStyles[type]}`}>
        {message}
      </div>
    </div>
  );
};

export default Toast;
