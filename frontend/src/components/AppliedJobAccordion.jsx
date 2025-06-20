import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import { useSelector } from "react-redux";
import Loader from "./shared/Loader";

const stageDescriptions = {
  applied: "The user has submitted the application.",
  viewed: "The recruiter has opened or seen the application.",
  accepted: "The recruiter has taken final action.",
  rejected: "The recruiter has taken final action.",
};

const AppliedJobAccordion = () => {
  const { loading, allAppliedJobs } = useSelector((store) => store.job);

  const getCurrentJobStatusIndex = (status) => {
    switch (status) {
      case "pending":
        return 0; // Applied
      case "viewed":
        return 1; // Viewed
      case "accepted":
      case "rejected":
        return 2; // Final stage
      default:
        return 0;
    }
  };

  const renderCircleIcon = (index, currentStage, status) => {
    const isActive = index === currentStage;
    const isCompleted = index < currentStage;

    let circleClass = "border-2 rounded-full w-6 h-6 flex items-center justify-center ";

    if (isCompleted) {
      circleClass += "bg-green-500 border-green-500";
    } else if (isActive) {
      circleClass += "bg-blue-500 border-blue-500 animate-pulse";
    } else {
      circleClass += "bg-gray-300 border-gray-300";
    }

    // For final stage, change circle color based on accepted/rejected
    if (index === 2) {
      if (status === "accepted") {
        circleClass = "bg-green-500 border-green-500 rounded-full w-6 h-6 flex items-center justify-center";
      } else if (status === "rejected") {
        circleClass = "bg-red-500 border-red-500 rounded-full w-6 h-6 flex items-center justify-center";
      } else {
        circleClass = "bg-gray-300 border-gray-300 rounded-full w-6 h-6 flex items-center justify-center";
      }
    }

    return (
      <div className={circleClass}>
        {isCompleted || isActive ? (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
          </svg>
        ) : null}
      </div>
    );
  };

  const renderStageText = (stage, index, status) => {
    return (
      <div className="flex flex-col items-center text-center flex-1">
        <div className={`font-semibold ${index === 2 && status === "rejected" ? "text-red-600" : index === 2 && status === "accepted" ? "text-green-600" : "text-gray-700"}`}>
          {index === 2
            ? (status === "accepted" || status === "rejected"
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : "Recruiter Action")
            : stage.charAt(0).toUpperCase() + stage.slice(1)}
        </div>
        <div className="text-xs text-gray-500 max-w-xs min-h-[30px] flex items-center justify-center">{stageDescriptions[stage]}</div>
      </div>
    );
  };

  return (
    <>
      {loading ? (
        <Loader/>
      ) : !allAppliedJobs || allAppliedJobs.length === 0 ? (
        <div className="text-center py-10">You Haven't Applied for any Job Till Now.</div>
      ) : (
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full px-4 sm:px-0 space-y-4">
            {allAppliedJobs.map((job) => {
              const currentStage = getCurrentJobStatusIndex(job.status);
              return (
                <AccordionItem key={job._id} value={job._id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full">
                      <div>
                        <div className="font-semibold">{job.job?.company?.name}</div>
                        <div className="text-sm text-gray-600">{job.job?.title}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.createdAt.split("T")[0]}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col w-full">
                      {/* Top Row: Circles and Lines */}
                      <div className="flex items-center justify-between w-full">
                        {["applied", "viewed", "accepted"].flatMap((stage, index, array) => {
                          const elements = [
                            <div key={`circle-${stage}`} className="flex flex-col items-center">
                              {renderCircleIcon(index, currentStage, job.status)}
                            </div>
                          ];

                          if (index < array.length - 1) {
                            const isLineCompleted = index < currentStage;
                            let lineClass = "flex-1 h-1";
                            if (isLineCompleted) {
                              lineClass += " bg-green-500";
                            } else {
                              lineClass += " bg-gray-300";
                            }
                            elements.push(
                              <div key={`line-${stage}`} className="flex items-center flex-1">
                                <div className={lineClass}></div>
                              </div>
                            );
                          }
                          return elements;
                        })}
                      </div>

                      {/* Bottom Row: Text Descriptions */}
                      <div className="flex justify-between w-full mt-2">
                        {["applied", "viewed", "accepted"].map((stage, index) => (
                          <React.Fragment key={`text-${stage}`}>
                            {renderStageText(stage, index, job.status)}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
    </>
  );
};

export default AppliedJobAccordion;
