import Company from "../models/companyModel.js";
import cloudinary from '../utils/cloudinary.js';
import User from '../models/userModel.js';
import transporter from '../utils/nodemailer.js';
import { loadTemplate } from '../utils/emailTemplates.js';
import fs from 'fs';

export const registerCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    let company = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (company) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    let logo;
    if (req.file) {
      const file = req.file;
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'job_portal/company_logos',
        resource_type: 'auto'
      });
      logo = result.secure_url;
      // Delete the temporary file after upload
      fs.unlinkSync(file.path);
    } else {
      return res.status(400).json({
        success: false,
        message: "Logo is mandatory",
      });
    }

    company = await Company.create({
      name,
      description,
      website,
      location,
      logo,
      userId: req.id,
    });

    // Send email to recruiter after successful registration
    try {
      const user = await User.findById(req.id);
      if (user && user.email) {
        const emailHtml = loadTemplate('companyRegistrationSuccess.html', { companyName: name, recruiterName: user.fullName });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Company Registration Successful',
          html: emailHtml,
        });
      }
    } catch (emailError) {
      console.error('Error sending company registration email:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: "Company Registered successfully",
      company,
    });
  } catch (err) {
    console.log(err);
    // Clean up any uploaded files if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};



export const getCompany = async (req, res) => {
    try {
        const userId = req.id; 
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                success: false,
                message: "No companies found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Companies found successfully",
            companies
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}

// get compnay by id 
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Company found",
            company
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}


export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        let logo;
        if (req.file) {
            const file = req.file;
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'job_portal/company_logos',
                resource_type: 'auto'
            });
            logo = result.secure_url;
            // Delete the temporary file after upload
            fs.unlinkSync(file.path);
        }

        const updateData = { name, description, website, location };
        if (logo) {
            updateData.logo = logo;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Company updated",
            company
        })

    } catch (err) {
        // Clean up any uploaded files if there's an error
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
}
