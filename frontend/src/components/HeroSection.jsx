import React from "react";
import { Button } from "./ui/button";
import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import herosectionImage from "../assets/herosection.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-col sm:flex-row items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 ">
      <div className="w-full sm:w-1/2 flex flex-col space-y-4 sm:space-y-6 py-8 sm:py-12">
        <div className="bg-gray-100 w-fit px-4 py-2 flex items-center gap-2 text-violet-700 font-semibold text-sm sm:text-base">
          <ThumbsUp size={16} /> Best Job Solution Platform
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
          Find your dream job & companies your work for.
        </h1>
        <p className="text-base sm:text-lg text-gray-700 max-w-xl">
          Make applying for a job easy with Jobseeker. Find Matching vacancies,
          create impresive applications and keep track of your activities. All
          in one Place!
        </p>
        <div className="flex flex-col space-y-4">
          <Button 
            className="bg-blue-500  hover:bg-blue-700 text-white px-8 py-3 text-base sm:text-lg rounded-md transition-colors duration-200 w-fit"
            onClick={() => navigate('/signup')}
          >
            Get started Now
          </Button>
          <p className="text-base sm:text-lg">
            Already have an account?{" "}
            <span 
              className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors duration-200"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      <div className="w-full sm:w-1/2 px-4 sm:px-6 py-8 sm:py-12">
        <img
          src={herosectionImage}
          alt="Hero section"
          className="w-full h-auto object-cover rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
};

export default HeroSection;
