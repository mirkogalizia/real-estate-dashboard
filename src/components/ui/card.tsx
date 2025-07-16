import React, { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return <div className={clsx('bg-white shadow rounded-2xl', className)}>{children}</div>;
}

export function CardContent({ className, children }: CardProps) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}
