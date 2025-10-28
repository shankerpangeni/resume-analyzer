import {User} from './../models/user.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

export const register = async(req , res) => {
    try {

        const {fullname , email , password , phoneNumber} = req.body;

        if(!fullname || !email || !password || !phoneNumber){
            return res.status(400).json({
                message: 'Something is missingg',
                success: false,
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                message: 'User with with email already registered.',
                success: false,
            })
        }

        const hashPassword = await bcrypt.hash(password , 10);

        await User.create({
            email ,
            phoneNumber,
            fullname,
            password: hashPassword,

        })

        const userResponse = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

        return res.status(201).json({
            message: 'User registered Successfully.',
            userResponse,
            success: true,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Registration failed .',
            success: false,
        })
    }
}

export const login = async(req , res) => {
    try {
        const {email , password} = req.body;

        if(!email || !password){
            return res.status(401).json({
                message: 'Something is missing',
                success: false
            })
        }

        let user = await User.findOne({email });
        if(!user){
            return res.status(401).json({
                message: 'User with this email not found.',
                success: false,
            })
        }

        const isPassMatch = await bcrypt.compare(password , user.password)
        if(!isPassMatch){
            return res.status(400).json({
                message: 'Email and Password doesnot matched.',
                success: false,
            })
        }

        const tokenData = {
            id : user._id,
        }

        const token = jwt.sign( tokenData , process.env.JWT_SECRET , {expiresIn : '1d' });

        res.cookie("token" , token , {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        })

        user = {
            id: user._id,
            email: user.email,
            fullname: user.fullname,
            phoneNumber: user.phoneNumber,
        }

        return res.status(200).json({
            message: 'Login Successful',
            user,
            success: true,
        })

        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Login unsuccessful internal server error',
            success: false,
        })
    }
}


export const logout = async(req, res) => {
    try {
        return res.cookie("token" , "" , {
            httpOnly: true,
            sameSite: "None",
            maxAge: 0,
            secure: true,
        }).json({
            message: 'Successfully Logout.',
            success: false,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Logout unsuccessful server err0r',
            success: false,
        })
        
    }
}