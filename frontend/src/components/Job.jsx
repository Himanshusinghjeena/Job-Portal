import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setSavedJobs } from '@/redux/slice/jobSlice'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

const Job = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {savedJobs} = useSelector(store=>store.job);
    const {user } = useSelector(store=> store.auth);

    const [isJobSavedOptimistic, setIsJobSavedOptimistic] = useState(
        user ? savedJobs.some(savedJob => savedJob._id === job._id) : false
    );

    useEffect(() => {
        setIsJobSavedOptimistic(user ? savedJobs.some(savedJob => savedJob._id === job._id) : false);
    }, [savedJobs, user, job._id]);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    const jobSavedHandler = async (job) => {
        if(user) {
            const previousState = isJobSavedOptimistic;
            setIsJobSavedOptimistic(!previousState); // Optimistic update

            try {
                const res = await axios.post(`${JOB_API_END_POINT}/save/${job._id}`, {}, {
                    withCredentials: true
                });
                
                if(res.data.success) {
                    // Fetch updated saved jobs to ensure Redux state is in sync
                    const savedJobsRes = await axios.get(`${JOB_API_END_POINT}/saved`, {
                        withCredentials: true
                    });
                    
                    if(savedJobsRes.data.success) {
                        dispatch(setSavedJobs(savedJobsRes.data.savedJobs));
                        toast.success(res.data.message);
                    }
                }
            } catch (err) {
                setIsJobSavedOptimistic(previousState); // Revert on error
                toast.error(err.response?.data?.message || "Failed to save job");
            }
        } else {
            toast.error('Please login to save jobs');
        }
    }

    return (
        <div className='p-4 sm:p-5 rounded-lg shadow-lg bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full'>
            <div className='flex items-center justify-between mb-3'>
                <p className='text-xs sm:text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button
                  onClick={() => {
                    jobSavedHandler(job);
                  }}
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {isJobSavedOptimistic ? <BookmarkCheck className="h-5 w-5 text-blue-500" /> : <Bookmark className="h-5 w-5 text-gray-400" />}
                </Button>
            </div>

            <div className='flex items-center gap-3 mb-4'>
                <Button className="p-2 sm:p-3 rounded-md border border-gray-200" variant="outline" size="icon">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-semibold text-base sm:text-lg text-gray-800'>{job?.company?.name}</h1>
                    <p className='text-xs sm:text-sm text-gray-500'>{job?.jobLocation}</p>
                </div>
            </div>

            <div className="flex-grow mb-4">
                <h1 className='font-bold text-lg sm:text-xl text-gray-900 mb-2'>{job?.title}</h1>
                <p className='line-clamp-3 text-sm text-gray-600 leading-relaxed'>
                    {job?.aboutRole}
                </p>
            </div>
            <div className='flex flex-wrap gap-2 mt-auto mb-4'>
                <Badge className={'text-blue-700 bg-blue-50 font-medium capitalize px-3 py-1 text-xs sm:text-sm rounded-full'} variant="ghost">{job?.workMode}</Badge>
                <Badge className={'text-orange-600 bg-orange-50 font-medium px-3 py-1 text-xs sm:text-sm rounded-full'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-purple-700 bg-purple-50 font-medium px-3 py-1 text-xs sm:text-sm rounded-full'} variant="ghost">{job?.experience}</Badge>
            </div>
            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-auto'>
                <Button
                  onClick={() => navigate(`/description/${job?._id}`)}
                  variant="outline"
                  className="flex-1 px-4 py-2 sm:py-3 rounded-md bg-gray-100 shadow-sm hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base font-medium text-gray-700"
                >
                  Details
                </Button>
                <Button
                  className={`flex-1 px-4 py-2 sm:py-3 rounded-md transition-colors duration-200 text-sm sm:text-base font-medium ${
                    isJobSavedOptimistic
                      ? "bg-blue-200 text-blue-700 pointer-events-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => {
                    jobSavedHandler(job);
                  }}
                >
                  {isJobSavedOptimistic ? "Saved" : "Save For Later"}
                </Button>
            </div>
        </div>
    )
}

export default Job
