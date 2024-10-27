// src/components/ui/alert.tsx
import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default',
  className,
  ...props 
}) => {
  return (
    <div
      role="alert"
      className={`alert ${variant} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertTitle: React.FC<AlertTitleProps> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <h5
      className={`alert-title ${className || ''}`}
      {...props}
    >
      {children}
    </h5>
  );
};

const AlertDescription: React.FC<AlertDescriptionProps> = ({ 
  children,
  className,
  ...props 
}) => {
  return (
    <div
      className={`alert-description ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };