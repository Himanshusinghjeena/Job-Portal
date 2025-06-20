import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/slice/authSlice";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullName: user?.fullName,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills?.join(", ") || "",
    file: null,
    profilePhotoFile: null,
    linkedinUrl: user?.profile?.linkedinUrl || "",
    githubUrl: user?.profile?.githubUrl || "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    formData.append("linkedinUrl", input.linkedinUrl);
    formData.append("githubUrl", input.githubUrl);
    if (input.file) {
      formData.append("file", input.file);
    }
    if (input.profilePhotoFile) {
      formData.append("profilePhoto", input.profilePhotoFile);
    }
    try {
      setLoading(true);
      const res = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile Updated Successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while updating profile.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[95vw] max-w-md p-6 sm:p-8 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="pb-4 border-b border-gray-100 mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={input.fullName}
                  onChange={changeEventHandler}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={input.bio}
                  onChange={changeEventHandler}
                  placeholder="Tell us a little about yourself..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 h-24 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-700">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  name="skills"
                  type="text"
                  value={input.skills}
                  onChange={changeEventHandler}
                  placeholder="e.g., React, Node.js, JavaScript"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="text"
                  value={input.linkedinUrl}
                  onChange={changeEventHandler}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-sm font-medium text-gray-700">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  type="text"
                  value={input.githubUrl}
                  onChange={changeEventHandler}
                  placeholder="https://github.com/yourprofile"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">Upload Resume (PDF only)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="w-full px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-center file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profilePhoto" className="text-sm font-medium text-gray-700">Upload Profile Photo</Label>
                <Input
                  id="profilePhoto"
                  name="profilePhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={fileChangeHandler}
                  className="w-full px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-center file:py-0 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-gray-100 mt-4">
              {loading ? (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200" disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait
                </Button>
              ) : (
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-md text-lg transition-colors duration-200">
                  Update Profile
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
