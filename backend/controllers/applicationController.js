import Application from '../models/applicationModel.js'
import Job from '../models/jobModel.js'
import transporter from '../utils/nodemailer.js';
import { loadTemplate } from '../utils/emailTemplates.js';

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required"
            })
        }
        // check if user already applied for this job 
        const exsisitingApplicantion = await Application.findOne({ job: jobId, applicant: userId });
        if (exsisitingApplicantion) {
            return res.status(400).json({
                message: "You already applied for this job",
                success: false
            })
        }

        // check if the job exsist or not
        const job = await Job.findById(jobId).populate('company');
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }

        // Check if job has expired
        if (job.expiryDate && new Date() > job.expiryDate) {
            return res.status(400).json({
                message: "This job has expired and no longer accepts applications.",
                success: false
            });
        }

        // create a new application
        const newApplication = await  Application.create({
            job: jobId,
            applicant: userId
        });

        job.applications.push(newApplication._id);
        await job.save();

        // Send application success email
        const html = loadTemplate('applicationSuccess.html', { 
            fullName: req.user.fullName, 
            jobTitle: job.title,
            companyName: job.company.name 
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.user.email,
            subject: 'Application Successful - Job Portal',
            html
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending application email:', error);
            } 
        });

        return res.status(201).json({
            message: "Job Applied successfully",
            success: true
        })
    } catch (err) {
      
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No job applied",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            application
        })
    } catch (err) {
        console.log(err)

    }
}

// admin dekhega kitno ne apply kra h 
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant',
                select: 'fullName email phoneNumber profile createdAt',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };

        return res.status(200).json({
            success: true,
            job
        })
    } catch (err) {
        
        return res.status(500).json({ success: false, message: err.message })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" })
        }
        // find application by application Id and populate applicant and job details
        const application = await Application.findById(applicationId)
            .populate('applicant')
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        // Store the old status to check if it changed
        const oldStatus = application.status;

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        // Send email notification if status changed to accepted or rejected
        if (oldStatus !== application.status && (application.status === 'accepted' || application.status === 'rejected')) {
            let subject;
            let templateName;

            if (application.status === 'accepted') {
                subject = 'Congratulations! Your Application Has Been Accepted - HireSmart';
                templateName = 'applicationAccepted.html';
            } else if (application.status === 'rejected') {
                subject = 'Update on Your Application - HireSmart';
                templateName = 'applicationRejected.html';
            }

            const html = loadTemplate(templateName, {
                fullName: application.applicant.fullName,
                jobTitle: application.job.title,
                companyName: application.job.company.name
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: application.applicant.email,
                subject,
                html
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(`Error sending ${application.status} email:`, error);
                } 
            });
        }
         return  res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            application
         });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
}

export const notifyApplicationViewed = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find the application and populate necessary fields
        const application = await Application.findById(applicationId)
            .populate('applicant')
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Check if the application status is 'viewed' and if the email has already been sent
        if (application.status === 'viewed' && application.viewedEmailSent) {
            return res.status(200).json({
                success: true,
                message: "Application already viewed and email already sent. No new notification sent."
            });
        }

        // Update status to 'viewed' if not already viewed or beyond
        if (application.status !== 'viewed' && application.status !== 'accepted' && application.status !== 'rejected') {
            application.status = 'viewed';
        }

        // Send email notification only if it hasn't been sent before for this viewed status
        if (!application.viewedEmailSent) {
            const html = loadTemplate('applicationViewed.html', {
                fullName: application.applicant.fullName,
                jobTitle: application.job.title,
                companyName: application.job.company.name
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: application.applicant.email,
                subject: 'Your Application Has Been Viewed - HireSmart',
                html
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending application viewed email:', error);
                } 
            });
            application.viewedEmailSent = true; // Mark as email sent
        }
        
        await application.save();

        return res.status(200).json({
            success: true,
            message: "Notification sent successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const notifyResumeViewed = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Find the application and populate necessary fields
        const application = await Application.findById(applicationId)
            .populate('applicant')
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        // Send email notification
        const html = loadTemplate('resumeViewed.html', {
            fullName: application.applicant.fullName,
            jobTitle: application.job.title,
            companyName: application.job.company.name
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: application.applicant.email,
            subject: 'Your Resume Has Been Viewed - HireSmart',
            html
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending resume viewed email:', error);
            } 
        });

        return res.status(200).json({
            success: true,
            message: "Resume view notification sent successfully"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

