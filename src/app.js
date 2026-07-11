import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}));//It converts the JSON data into a JavaScript object and attaches it to the req.body property.


app.use(express.urlencoded({extended:true,//allows nested objects
    limit:"16kb"
}))//The middleware converts the URL-encoded string into a JavaScript object.

app.use(express.static("public"));
app.use(cookieParser());
//import routes
import userRouter from "./routes/user.routes.js"

//route declaration

app.use("/api/v1/users",userRouter);





export {app};