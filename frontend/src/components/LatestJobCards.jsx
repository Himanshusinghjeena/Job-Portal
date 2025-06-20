import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import React from "react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/description/${job._id}`);
      }}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
    >
      <div className="flex items-center justify-between">

      <div>
      <div className=" w-[60px] h-[60px] rounded-md overflow-hidden ">
        <img className="object-cover" src={job?.company?.logo} alt="" />
      </div>
      

        <h1 className="font-medium text-lg mt-2 capitalize">{job?.company?.name}</h1>
        <p className="text-sm  text-gray-500">{job?.jobLocation}, India</p>
      </div>
      <div className=" w-[60px] rounded-full overflow-hidden">
       
      </div>
      </div>
      <div>
        <h1 className="font-semibold text-lg my-2 capitalize">{job?.title}</h1>
        <p className="text-sm line-clamp-3 text-gray-600 ">{job?.aboutRole}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className="text-blue-700 font-bold " variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#F83002] font-bold " variant="ghost">
          {job?.workMode}
        </Badge>
        <Badge className="text-[#7209B7] font-bold " variant="ghost">
          {job?.experience}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
