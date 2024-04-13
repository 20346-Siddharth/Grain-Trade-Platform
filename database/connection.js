import mongoose from "mongoose";
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/GrainTradePlatform').then(()=>{
    console.log('Connected to mongoDB');
}).catch((error)=>{
    console.log(error);
});