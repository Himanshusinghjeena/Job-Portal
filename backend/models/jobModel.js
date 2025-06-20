import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ["Full Time", "Part Time", "Internship"],
    },
    workMode: {
        type: String,
        enum: ["Remote", "Hybrid", "On-Site"]
    },
    jobLocation: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    aboutRole: {
        type: String,
        required: true
    },
    educationalQualification: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    responsibility: {
        type: String,
        required: true
    },
    attachJD: {
        type: String
    },
    attachCompany: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recruiterName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    perks: {
        type: String,
        required: true
    },
    applications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application"
        }
    ],
    applicants: [
        {
            applicant: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "rejected"],
                default: "pending",
            },
            viewedEmailSent: {
                type: Boolean,
                default: false,
            },
        },
    ],
    expiryDate: {
        type: Date,
        required: false,
    },
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);