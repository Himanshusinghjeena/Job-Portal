import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy } from 'lucide-react';
import { FaFacebook, FaLinkedin, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { toast } from 'sonner';

const ShareDialog = ({ job }) => {
  const shareableJob = `http://localhost:5173/description/${job?._id}`;

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
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle className="text-2xl font-bold mt-4">
          Share with Friends
        </DialogTitle>
        <DialogDescription className="text-gray-500 text-center">
          A single share can open a door for someone.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-6">
        <p className="text-lg font-medium mb-2">
          Share your link
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

      <div className="mt-6">
        <p className="text-lg font-medium mb-4">
          Share on social media
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => handleSocialShare('facebook')}
          >
            <FaFacebook className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black text-white hover:bg-gray-800"
            onClick={() => handleSocialShare('twitter')}
          >
            <FaXTwitter className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-blue-700 text-white hover:bg-blue-800"
            onClick={() => handleSocialShare('linkedin')}
          >
            <FaLinkedin className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-green-600 text-white hover:bg-green-700"
            onClick={() => handleSocialShare('whatsapp')}
          >
            <FaWhatsapp className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleSocialShare('telegram')}
          >
            <FaTelegram className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShareDialog; 