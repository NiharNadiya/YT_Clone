import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

const port= process.env.PORT || 8000;
connectDB()
.then(()=>{
    app.listen(port ,()=>{
        console.log(`app is listening on http://localhost:${port}`)
    })
})
.catch((err)=>{
    console.log("app is not listening!!!!")
})

// import express from "express"

// const app= express();

// (async ()=>{
//     try {
//       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//       app.on("error",(error)=>{
//         console.log("Error:application is not able to talk to the database!");
//         throw error;
//       }) 

//       app.listen(process.env.PORT,()=>{
//         console.log(`app is listening on http://localhost:${process.env.PORT}`)
//       })
      
//     } catch (error) {
//         console.log("Error:",error);
//         throw error;
//     }
// })()