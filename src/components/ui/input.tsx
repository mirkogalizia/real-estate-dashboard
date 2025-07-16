import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full px-3 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400',
        className
      )}
      {...props}
    />
  );
}
