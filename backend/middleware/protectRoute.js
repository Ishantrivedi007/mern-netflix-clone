import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (request,response,next) =>{
    try {
        const token = request.cookies["jwt-netflix"]
        if(!token){
            return response.status(401).json({success: false, message: "Unauthorized Access - Token not found"})
        }
        const decodedToken = jwt.verify(token, ENV_VARS.JWT_SECRET)
        if(!decodedToken){
            return response.status(401).json({success: false, message: "Unauthorized Access - Invalid Token"})
        }
        
        const user = await User.findById(decodedToken.userId).select("-password")

        if(!user){
            return response.status(404).json({success: false, message: "Unauthorized Access - User not found"})
        }
        request.user = user;
        next();
    } catch (error) {
        console.log('Error in protectRoute middleware: ',error.message);
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}