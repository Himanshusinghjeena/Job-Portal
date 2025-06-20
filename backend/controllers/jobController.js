import Job from '../models/jobModel.js';
import mongoose from 'mongoose';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import User from '../models/userModel.js';
import transporter from '../utils/nodemailer.js';
import { loadTemplate } from '../utils/emailTemplates.js';

export const postJob = async (req, res) => {
    try {
        const { 
            title, 
            jobType, 
            workMode, 
            jobLocation, 
            experience, 
            company, 
            aboutRole, 
            educationalQualification, 
            skills, 
            responsibility, 
            salary, 
            name,
            email, 
            perks, 
            expiryDate 
        } = req.body;
        
        const userId = req.id;

        // Convert company ID to ObjectId
        const companyId = new mongoose.Types.ObjectId(company);
        // Convert user ID to ObjectId
        const recruiterId = new mongoose.Types.ObjectId(userId);

        // Handle file uploads to Cloudinary
        let attachJD = null;
        let attachCompany = null;

        if (req.files) {
            // Upload job description file
            if (req.files['attachmentsJobDescription']) {
                const file = req.files['attachmentsJobDescription'][0];
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'job_portal/job_descriptions',
                    resource_type: 'auto'
                });
                attachJD = result.secure_url;
                // Delete the temporary file after upload
                fs.unlinkSync(file.path);
            }

            // Upload company description file
            if (req.files['attachmentsAboutCompany']) {
                const file = req.files['attachmentsAboutCompany'][0];
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'job_portal/company_descriptions',
                    resource_type: 'auto'
                });
                attachCompany = result.secure_url;
                // Delete the temporary file after upload
                fs.unlinkSync(file.path);
            }
        }

        // Create job with all fields
        // Fetch recruiter info from User model
        const user = await User.findById(userId);
        const recruiterName = user ? user.fullName : '';
        const recruiterEmail = user ? user.email : '';

        const job = await Job.create({
            title,
            jobType,
            workMode,
            jobLocation,
            experience,
            company: companyId,
            aboutRole,
            educationalQualification,
            skills,
            responsibility,
            attachJD,
            attachCompany,
            salary: Number(salary),
            recruiterId,
            recruiterName: recruiterName,
            email: recruiterEmail,
            perks,
            expiryDate: expiryDate ? new Date(expiryDate) : undefined
        });

        // Send email to recruiter after successful job post
        try {
            const user = await User.findById(req.id);
            if (user && user.email) {
                const emailHtml = loadTemplate('jobPostSuccess.html', { recruiterName: user.fullName, jobTitle: title });
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Job Posted Successfully',
                    html: emailHtml,
                });
            }
        } catch (emailError) {
            console.error('Error sending job post email:', emailError);
        }

        return res.status(201).json({ success: true, message: "Job posted successfully", job });
    } catch (err) {
        console.log(err);
        // Clean up any uploaded files if there's an error
        if (req.files) {
            if (req.files['attachmentsJobDescription']) {
                fs.unlinkSync(req.files['attachmentsJobDescription'][0].path);
            }
            if (req.files['attachmentsAboutCompany']) {
                fs.unlinkSync(req.files['attachmentsAboutCompany'][0].path);
            }
        }
        return res.status(500).json({
            success: false,
            error: err,
            message: err.message,
        });
    }
}


export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company",
        });
        if (!jobs) {
            return res.status(404).json({ success: false, message: "No jobs found" })
        }
        return res.status(200).json({ success: true, jobs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobs = await Job.findById(jobId)
            .populate({
                path: "applications",
            })
            .populate({
                path: "company",
            })
            .populate({
                path: "recruiterName",
                select: "-password" 
            });
        if (!jobs) {
            return res.status(404).json({ success: false, message: "Job not found" });
        };

        return res.status(200).json({
            success: true,
            jobs
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}


// admin kitne job create kra h abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ recruiterId: adminId }).populate({
            path: "company",
        }).populate({
            path: "applications",
            select: 'status'
        });

        if (!jobs) {
            return res.status(404).json({
                success: false,
                message: "No jobs found"
            });
        }

        // Calculate the number of new/pending applications for each job
        const jobsWithNewApplicants = jobs.map(job => {
            const pendingApplicationsCount = job.applications.filter(app => app.status === 'pending').length;
            return {
                ...job.toObject(),
                pendingApplicationsCount: pendingApplicationsCount
            };
        });

        return res.status(200).json({
            success: true,
            jobs: jobsWithNewApplicants
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const saveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Find user and update saved jobs
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if job is already saved
        const isJobSaved = user.savedJobs.includes(jobId);
        if (isJobSaved) {
            // Remove job from saved jobs
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Job removed from saved jobs",
                saved: false
            });
        } else {
            // Add job to saved jobs
            user.savedJobs.push(jobId);
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Job saved successfully",
                saved: true
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;
        
        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: {
                path: 'company'
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            savedJobs: user.savedJobs
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};