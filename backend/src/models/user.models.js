import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim:true,
    },

    phoneNumber: {
        type: String,
        required: true,
        trim:true,

    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase:true,
        trim:true,
    },

    password: {
        type: String,
        required: true,

    }

},{timestamps: true});

export const User = mongoose.model('User' ,userSchema )