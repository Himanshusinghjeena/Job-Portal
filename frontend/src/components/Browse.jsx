import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/slice/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";

// const randomJobs = [1, 2,45];

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs.length})
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {allJobs.length > 0 ? (
            allJobs.map((job) => {
              return <Job key={job._id} job={job} />;
            })
          ) : (
            <div className="col-span-3 flex justify-center items-center ">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/unemployment-holding-no-job-found-illustration-download-in-svg-png-gif-file-formats--business-unemployed-empty-state-pack-people-illustrations-10922141.png?f=webp" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
