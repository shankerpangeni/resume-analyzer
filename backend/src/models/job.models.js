import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    company: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true,
    },

    skillsRequired: {
        type: [String], //["js" , "react" , "next.js"]
        required: true,
    },

    salaryRange:{
        type: String,
    },

    jobType:{
        type: String, //['full-time' , 'part-time']
        default: 'Full-time'

    },

     embedding:{
         type: [Number] 
}, 
    
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

} , {timestamps: true});

export const Job = mongoose.model('Job' , jobSchema);