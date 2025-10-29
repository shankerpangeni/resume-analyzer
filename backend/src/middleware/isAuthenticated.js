import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export const isAuthenticated = async(req, res , next) => {
    try {
        const token = req.cookies?.token;
        if(!token){
            return res.status(401).json({
                message: 'User not authenticated , NO Token',
                success: false,
            })
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        if(!decoded){
            return res.status(403).json({
                message:'User not authenticated.',
                success: false,
            })
        }

        req.id = decoded.id //attach ID to requst
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Invalid token or failed internal 500 server. ',
            success: false,
        })
    }
}