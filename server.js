import express from "express"
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from"./routes/routes.js"
import "./database/connection.js"
import checkTokenExpiry from "./middleware/checkTokenExpiry.js";
import twilio from 'twilio';
import dotenv from 'dotenv';
const app=express();

app.use(cors());
 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(checkTokenExpiry)//
app.use('/api',routes)//routes defined here
 
app.listen(4000,()=>{ 
    console.log('listening to server port 4000')
})