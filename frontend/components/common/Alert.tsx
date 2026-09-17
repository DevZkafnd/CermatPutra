import clsx from 'clsx';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
}

export default function Alert({
  type = 'info',
  message,
  className,
}: AlertProps) {
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border',
        variants[type],
        className
      )}
    >
      <p className="text-sm">{message}</p>
    </div>
  );
}
