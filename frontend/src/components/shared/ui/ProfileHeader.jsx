import React from 'react';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";

const ProfileHeader = ({ 
  profilePhoto, 
  fullName, 
  bio, 
  onEdit, 
  showEditButton = true 
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-gray-100">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-blue-500 shadow-md">
          <AvatarImage
            src={profilePhoto || "https://github.com/shadcn.png"}
            alt="User Profile"
          />
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
            {fullName}
          </h1>
          <p className="text-base text-gray-700 mt-1 line-clamp-2">
            {bio || "No bio available."}
          </p>
        </div>
      </div>
      {showEditButton && (
        <Button
          onClick={onEdit}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
        >
          <Pen className="h-4 w-4" />
          Edit Profile
        </Button>
      )}
    </div>
  );
};

export default ProfileHeader; 