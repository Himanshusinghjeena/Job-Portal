import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Student', "Recruiter"]
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }],
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String },
        resumeOriginalName: { type: String },
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company"
        },
        profilePhoto: {
            type: String,
            default: ""
        },
        linkedinUrl: { type: String, default: "" },
        githubUrl: { type: String, default: "" }
    }
}, { timestamps: true });
export default mongoose.model('User', userSchema);