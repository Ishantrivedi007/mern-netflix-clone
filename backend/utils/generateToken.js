import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, response)=>{
    const token = jwt.sign({userId},ENV_VARS.JWT_SECRET,{expiresIn:"45d"});

    response.cookie("jwt-netflix",token,{
        maxAge: 45*24*60*60*1000, //45 days in milliseconds
        httpOnly: true, //only accessible by the server/browser, prevents XSS attacks
        sameSite: "strict", //prevents CSRF attacks
        secure: ENV_VARS.NODE_ENV !== "development"
    })

    return token;
}