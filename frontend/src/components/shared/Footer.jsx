import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">JobPortal</h2>
            <p className="text-sm leading-relaxed">
              Find your dream job or the perfect candidate with JobPortal. We connect talented professionals with amazing opportunities.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm">123 Business Street, New York, USA</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm">contact@jobportal.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Find Jobs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Resume Database
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Career Advice
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors duration-200">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect With Us</h3>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-blue-500 hover:text-white transition-colors duration-200">
                <FacebookIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-400 hover:text-white transition-colors duration-200">
                <TwitterIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-blue-600 hover:text-white transition-colors duration-200">
                <LinkedinIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-pink-500 hover:text-white transition-colors duration-200">
                <InstagramIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Subscribe to our newsletter</h4>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded-md transition-colors duration-200">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
