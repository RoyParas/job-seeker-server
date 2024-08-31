import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CloudName,
    api_key: process.env.CloudApiKey,
    api_secret: process.env.CloudApiSecretKey,
})

app.listen(process.env.PORT, ()=>{
    console.log(`server started on port ${process.env.PORT}`);
})