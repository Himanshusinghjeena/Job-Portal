import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/slice/authSlice";
import { resetSavedJobs } from "@/redux/slice/jobSlice";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(resetSavedJobs());
        navigate("/");
        toast.success("Logged out successfully");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="bg-white sticky top-0 z-50 shadow">
      <div className="px-5 flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold">
            Hire <span className="text-blue-700">Smart</span>
          </h1>
        </div>
        {/* Desktop Menu */}
        <div className="flex items-center sm:gap-12">
          <ul className="hidden sm:flex font-medium items-center gap-5">
            {user && user.role === "Recruiter" ? (
              <>
                <Link to="/admin/companies">
                  <li>Companies</li>
                </Link>
                <Link to="/admin/jobs">
                  <li>Jobs</li>
                </Link>
              </>
            ) : (
              <>
                <Link to="/">
                  <li>Home</li>
                </Link>
                <Link to="/jobs">
                  <li>Jobs</li>
                </Link>
                <Link to="/savedJobs">
                  <li>Saved Jobs</li>
                </Link>
              </>
            )}
          </ul>
          {!user ? (
            <div className="hidden sm:flex items-center sm:gap-2">
              <Link to="/login">
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="cursor-pointer bg-blue-500 hover:bg-blue-700">
                  SignUp
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto &&
                      user.profile.profilePhoto !== ""
                        ? user.profile.profilePhoto
                        : "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className=" hidden sm:block w-60 mr-1 sm:mr-0 sm:w-80">
                <div className="flex gap-4 items-center">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto &&
                        user.profile.profilePhoto !== ""
                          ? user.profile.profilePhoto
                          : "https://github.com/shadcn.png"
                      }
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-sm sm:font-medium capitalize">
                      {user?.fullName}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:my-2 text-gray-600">
                  {user && user?.role === "Student" && (
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {/* Mobile Menu Icon */}
          <div className="sm:hidden relative ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative z-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            />
            {/* Slide-out Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed top-0 right-0 h-full w-fit bg-gradient-to-b from-white to-gray-50 shadow-2xl z-50 sm:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileMenu}
                      className="text-white hover:bg-blue-600/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ul className="py-4">
                    {user && user.role === "Recruiter" ? (
                      <>
                        <Link
                          to="/admin/companies"
                          onClick={toggleMobileMenu}
                          className="block"
                        >
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            Companies
                          </motion.li>
                        </Link>
                        <Link
                          to="/admin/jobs"
                          onClick={toggleMobileMenu}
                          className="block"
                        >
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            Jobs
                          </motion.li>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/" onClick={toggleMobileMenu} className="block">
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            Home
                          </motion.li>
                        </Link>
                        <Link to="/jobs" onClick={toggleMobileMenu} className="block">
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            Jobs
                          </motion.li>
                        </Link>
                        <Link
                          to="/savedJobs"
                          onClick={toggleMobileMenu}
                          className="block"
                        >
                          {user && (
                            <motion.li 
                              whileHover={{ x: 5 }}
                              className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                            >
                              Saved Jobs
                            </motion.li>
                          )}
                        </Link>
                        {user && user?.role === "Student" && (
                          <Link
                            to="/profile"
                            onClick={toggleMobileMenu}
                            className="block"
                          >
                            <motion.li 
                              whileHover={{ x: 5 }}
                              className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                            >
                              View Profile
                            </motion.li>
                          </Link>
                        )}
                      </>
                    )}
                    {!user && (
                      <>
                        <Link
                          to="/login"
                          onClick={toggleMobileMenu}
                          className="block"
                        >
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            Login
                          </motion.li>
                        </Link>
                        <Link
                          to="/signup"
                          onClick={toggleMobileMenu}
                          className="block"
                        >
                          <motion.li 
                            whileHover={{ x: 5 }}
                            className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500"
                          >
                            SignUp
                          </motion.li>
                        </Link>
                      </>
                    )}
                    {user && (
                      <motion.li
                        whileHover={{ x: 5 }}
                        className="px-6 py-4 hover:bg-blue-50 transition-colors border-l-4 border-transparent hover:border-blue-500 cursor-pointer"
                        onClick={() => {
                          logoutHandler();
                          toggleMobileMenu();
                        }}
                      >
                        Logout
                      </motion.li>
                    )}
                  </ul>
                </div>
                {user && (
                  <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 ring-2 ring-blue-500">
                        <AvatarImage
                          src={
                            user?.profile?.profilePhoto &&
                            user.profile.profilePhoto !== ""
                              ? user.profile.profilePhoto
                              : "https://github.com/shadcn.png"
                          }
                          alt="@shadcn"
                        />
                      </Avatar>
                      <div>
                        <h4 className="font-semibold capitalize text-gray-800">
                          {user?.fullName?.length > 14 ? user.fullName.slice(0, 16) + "..." : user?.fullName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {user?.email?.length > 14 ? user.email.slice(0, 16) + "..." : user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
