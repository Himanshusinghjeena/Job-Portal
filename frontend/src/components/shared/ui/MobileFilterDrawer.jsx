import React from "react";
import { Button } from "../../ui/button";
import { X } from "lucide-react";

const MobileFilterDrawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute right-0 top-0 h-full w-[300px] bg-white p-4 shadow-lg">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MobileFilterDrawer; 