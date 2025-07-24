import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  name?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  name,
  ...props
}, ref) => {
  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          className={clsx(
            'block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
            'transition-colors duration-200',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-400">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };