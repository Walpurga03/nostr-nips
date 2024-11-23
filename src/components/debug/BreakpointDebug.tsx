import React from 'react';

interface BreakpointDebugProps {
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showPixels?: boolean;
  className?: string;
}

export const BreakpointDebug: React.FC<BreakpointDebugProps> = ({ 
  position = 'center',
  showPixels = true,
  className = ''
}) => {
  return (
    <div className={`breakpoint-debug ${className}`}>
      Debug
    </div>
  );
};

export default BreakpointDebug;
