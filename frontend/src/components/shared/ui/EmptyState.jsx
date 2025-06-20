import React from 'react';
import { Button } from "@/components/ui/button";

const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon: Icon 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-center p-6">
      {Icon && <Icon className="h-12 w-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState; 