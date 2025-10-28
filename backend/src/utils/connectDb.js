import mongoose from "mongoose";

export const connectDb = async(req, res) => {
    try {
       const connection = await mongoose.connect(process.env.MONGO_URI);
       if(connection){
       console.log("Database connect successfully")
       }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Database connection failed.',
            success: false,

        })
    }
}