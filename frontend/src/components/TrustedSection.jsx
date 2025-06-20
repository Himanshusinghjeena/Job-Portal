import React from "react";
import amazon from "../assets/amazon.svg";
import IBM from "../assets/ibm.svg";
import cisco from "../assets/cisco.svg";
import google from "../assets/google.svg";
import infosys from "../assets/infosys.svg";
import walmart from "../assets/walmart.svg";
import wipro from "../assets/wipro.svg";
import { Button } from "./ui/button";

const TrustedSection = () => {
  return (
    <div className="w-full bg-gray-50 py-8 sm:py-12">
      {/* Trusted Companies Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-lg sm:text-xl md:text-2xl text-gray-700 font-semibold mb-6 sm:mb-8 text-center sm:text-left">
            Trusted by <sup className="text-[6px]">TM</sup>
          </h1>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 sm:gap-6 items-center justify-items-center">
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={amazon}
              alt="Amazon"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={cisco}
              alt="Cisco"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={IBM}
              alt="IBM"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={google}
              alt="Google"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={infosys}
              alt="Infosys"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={walmart}
              alt="Walmart"
            />
            <img
              className="w-12 sm:w-16 md:w-20 h-auto object-contain"
              src={wipro}
              alt="Wipro"
            />
          </div>
        </div>
      </div>

      {/* Recommended Jobs Section */}
      <div className="mt-12 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
            <div className="w-full sm:w-1/2 space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
                Recommended Jobs
              </h1>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                10000+ Jobs Available for you
              </h2>
              <p className="text-base sm:text-lg text-gray-700 max-w-xl">
                Explain your skill, roll & talent with us by this recommended
                jobs.
              </p>
            </div>

            <div className="w-full sm:w-1/2 flex justify-start sm:justify-end flex-wrap gap-3 sm:gap-4">
              <Button className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-6 py-2 text-sm sm:text-base rounded-full transition-colors duration-200">
                Full Time
              </Button>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-2 text-sm sm:text-base rounded-full transition-colors duration-200">
                Part Time
              </Button>
              <Button className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-6 py-2 text-sm sm:text-base rounded-full transition-colors duration-200">
                Internship
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedSection;
