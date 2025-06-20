import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary.js';
import Application from '../models/applicationModel.js';
import transporter from '../utils/nodemailer.js';
import { loadTemplate } from '../utils/emailTemplates.js';
import fs from 'fs';


export const register = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, role } = req.body;
        if (!fullName || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }
        let profilePhotoUrl = "";
        if (req.file) {
            const file = req.file;
            const cloudResponse = await cloudinary.uploader.upload(file.path, {
                folder: 'job_portal/profile_photos',
                resource_type: 'auto'
            });
            profilePhotoUrl = cloudResponse.secure_url;
            // Delete the temporary file after upload
            fs.unlinkSync(file.path);
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        })

        // Send signup success email
        const html = loadTemplate('signupSuccess.html', { fullName });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Signup Successful - Job Portal',
            html
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending signup email:', error);
            } 
        });

        res.status(200).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: "Cannot register user",
            error: err.message
        })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No User Found Associated with this Email"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            })
        }
        // check role is correct or not 
        if (role !== user.role) {
            return res.status(400).json({
                success: false,
                message: "Account doesn't exsist with this role"
            })
        }

        const tokenData = {
            id: user._id,
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: '1d'
        })

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profile: user.profile
        }

        // store token in cookie 
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullName}`,
            success: true,
            user,
        })
    } catch (err) {
        console.log( err);
        return res.status(500).json({
            success: false,
            message: "Some Issue when try to login",
            error: err.message,
        })
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie("token").json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: err.message,
        })
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, bio, skills, linkedinUrl, githubUrl } = req.body;

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Process file uploads only if user exists
        if (req.files) {
            // Process resume file
            if (req.files['file'] && req.files['file'][0]) {
                const file = req.files['file'][0];
                const cloudResponse = await cloudinary.uploader.upload(file.path, {
                    folder: 'job_portal/resumes',
                    resource_type: 'auto'
                });
                if (cloudResponse) {
                    user.profile.resume = cloudResponse.secure_url; // save the cloudinary url
                    user.profile.resumeOriginalName = file.originalname; // Save the original file name
                }
                // Delete the temporary file after upload
                fs.unlinkSync(file.path);
            }
            // Process profile photo file
            if (req.files['profilePhoto'] && req.files['profilePhoto'][0]) {
                const file = req.files['profilePhoto'][0];
                const cloudResponse = await cloudinary.uploader.upload(file.path, {
                    folder: 'job_portal/profile_photos',
                    resource_type: 'auto'
                });
                if (cloudResponse) {
                    user.profile.profilePhoto = cloudResponse.secure_url; // save profile photo url
                }
                // Delete the temporary file after upload
                fs.unlinkSync(file.path);
            }
        }

        let skillsArray;
        if (skills !== undefined) {
            skillsArray = skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill.length > 0);
        }

        // Update user fields if they exist in request body
        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.profile.bio = bio;
        if (skills !== undefined) user.profile.skills = skillsArray;
        if (linkedinUrl !== undefined) user.profile.linkedinUrl = linkedinUrl;
        if (githubUrl !== undefined) user.profile.githubUrl = githubUrl;

        await user.save();

        // Use updated user object directly or fetch again if needed
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
                linkedin: user.linkedinUrl,
                github: user.githubUrl
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};



export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId || req.params.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // If the requesting user is a recruiter, include application data
        let application = null;
        if (req.user.role === "Recruiter" && req.query.jobId) {
            application = await Application.findOne({
                applicant: userId,
                job: req.query.jobId
            });
           
        }

        return res.status(200).json({
            message: "User found",
            success: true,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            },
            application: application
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error while finding user by Id",
            success: false,
            error: err.message
        });
    }
};