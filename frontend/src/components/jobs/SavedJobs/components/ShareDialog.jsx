import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { FaFacebook, FaLinkedin, FaTelegram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";

const ShareDialog = ({ job }) => {
  const shareableJob = `https://job-portal-frontend-u1fz.onrender.com/description/${job?._id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableJob);
    toast.success("The job link has been copied to your clipboard!!");
  };

  const handleSocialShare = (platform) => {
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableJob)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableJob)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableJob)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareableJob)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareableJob)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share Job</DialogTitle>
        <DialogDescription>
          Share this job opportunity with your network
        </DialogDescription>
      </DialogHeader>
      <div className="mt-6">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Share to
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-4 sm:gap-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => handleSocialShare('facebook')}
          >
            <FaFacebook className="text-2xl sm:text-3xl text-blue-600" />
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
              Facebook
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => handleSocialShare('twitter')}
          >
            <FaXTwitter className="text-2xl sm:text-3xl text-gray-900" />
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
              Twitter
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => handleSocialShare('linkedin')}
          >
            <FaLinkedin className="text-2xl sm:text-3xl text-blue-700" />
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
              LinkedIn
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => handleSocialShare('whatsapp')}
          >
            <FaWhatsapp className="text-2xl sm:text-3xl text-green-600" />
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
              WhatsApp
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center space-y-1 cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => handleSocialShare('telegram')}
          >
            <FaTelegram className="text-2xl sm:text-3xl text-blue-500" />
            <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
              Telegram
            </span>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          Copy link
        </p>
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
          <input
            type="text"
            value={shareableJob}
            readOnly
            className="flex-1 outline-none bg-transparent"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShareDialog; 
