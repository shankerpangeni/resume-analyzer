import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Links the resume to the user who uploaded it
        required: true,
    },

    fileUrl: {
        type: String, // URL or path to uploaded resume file
        required: true,
    },

    filename: {
        type: String,
        required: true,
    },

    skills: {
        type: [String], // Extracted skills from resume
        default: [],
    },

    experience: {
        type: Number, // Years of experience
        default: 0,
    },

    education: {
        type: String, // Highest degree or field
        default: '',
    },

    fullText:{
        type: String,
        required:true,
        
    },

    embedding: {
        type: [Number],
        default: [],
    },

    recommendedJobs: [{
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    similarityScore: Number
    }],

    appliedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }],
}, { timestamps: true });

export const Resume = mongoose.model('Resume', resumeSchema);
