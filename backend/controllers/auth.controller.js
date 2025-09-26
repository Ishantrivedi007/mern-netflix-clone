import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(request, response) {
   try {
    const {email, password, username}= request.body;
    console.log(request.body,'body');
    

    if(!email || !password || !username){
        return response.status(400).json({
            success: false,
            message: "All Fields are required."
        })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return response.status(400).json({
            success: false,
            message: "Email is not valid."
        })
    }
    if(password.length < 6){
        return response.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long."
        })
    }

    const existingUserByEmail = await User.findOne({email: email});

    if(existingUserByEmail){
        return response.status(400).json({success: false, message: "User with this email already exists."})
    }

    const existingUserByUsername = await User.findOne({username: username});

    if(existingUserByUsername){
        return response.status(400).json({success: false, message: "User with this username already exists."})
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    
    

    const PROFILE_PICS=["https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
        "https://wallpapers.com/images/hd/netflix-profile-pictures-5yup5hd2i60x7ew3.jpg",
        "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg"
    ]

    const image = PROFILE_PICS[Math.floor(Math.random()* PROFILE_PICS.length)]

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword, //password will be hashed by bcryptjs
        image: image
    })

  
        generateTokenAndSetCookie(newUser._id,response)
        await newUser.save();
        return response.status(201).json({success: true, user:{...newUser._doc, password: ""}, message: "User created successfully."})
   

   } catch (error) {
    console.log('Error in signup',error.message);
    
    response.status(500).json({success: false, message: "Internal Server Error"})
   }
}

export async function login(request, response) {
    try {
      const {email, password}= request.body;

      if(!email || !password){
          return response.status(400).json({
              success: false,
              message: "All Fields are required."
          })
      }

      const user = await User.findOne({email: email});
      if(!user){
          return response.status(404).json({success: false, message: "Invalid Credentials."})
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);

      if(!isPasswordCorrect){
          return response.status(400).json({success: false, message: "Invalid Credentials."})
      }

      generateTokenAndSetCookie(user._id,response);
      return response.status(200).json({
          success: true,
          user: {...user._doc, password: ""},
          message: "User logged in successfully."
      })
    } catch (error) {
        console.log('Error in login controller',error.message);
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function logout(request, response) {
   try {
    response.clearCookie("jwt-netflix");
    return response.status(200).json({success: true, message: "User logged out successfully."})
   } catch (error) {
    console.log('Error in logout controller',error.message);
    response.status(500).json({success: false, message: "Internal Server Error"})
   }
}

export async function authCheck(request,response) {
    try {
        console.log("request.user: ",request.user);
        return response.status(200).json({success: true, user: request.user, message: "User authenticated successfully."})
    } catch (error) {
        console.log('Error in authCheck controller: ',error.message);
        return response.status(500).json({success: false, message: "Internal Server Error"})
    }
}