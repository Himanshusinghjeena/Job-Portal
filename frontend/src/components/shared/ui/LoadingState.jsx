import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState; 