import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
const registerUser = asyncHandler(async (req,res)=>{
    //take  user information from frontend
    //validation - not empty
    //check if user is already exist
    //check for images , check for avatar
    //upload them to cloudinary,avatar check
    //create user object - create entry in db
    //remove password and and refresh token field from the response
    //check for user creation
    //return response

    const{fullName,email,password,username}=req.body

    if([fullName,email,password,username].some((fields)=>fields?.trim()==="")){
        throw new apiError(400,"All fields must be filled!")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new apiError(400, "Please enter a valid email address");
    }

    const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new apiError(
            400,
            "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character."
        );
    }

    // const usernameExist = await User.findOne({username});

    // if(usernameExist ){
    //     throw new apiError(409,"username already exists!")
    // }

    // const emailExist = await User.findOne({email});

    // if( emailExist){
    //     throw new apiError(409,"email already exists!")
    // }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    
    if (existingUser) {
        throw new apiError(409, "Username or email already exists!");
    }

   const avatarLoacalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLoacalPath){
    throw new apiError(400,"Avatar file is required!");
   }

   const avatar = await uploadOnCloudinary(avatarLoacalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new apiError(400,"Avatar file is required!");
  }

  const user = await User.create({
    fullName,
    username: username.toLowercase(),
    avatar:avatar.url,
    email,
    password,
    coverImage: coverImage?.url || ""


  });

  const createdUser = await User.findById(user._id).select(
    " -password -refreshToken"
  );

  if(!createdUser){
    throw new apiError(500,"Something went wrong while registering the user!")
  }


  return res.status(201).json(
    new apiResponse(200,createdUser,"User Registered Successfully!!")
  )

    // console.log("email:",email);
})

export   {registerUser};