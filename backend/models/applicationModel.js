import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'viewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    viewedEmailSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);