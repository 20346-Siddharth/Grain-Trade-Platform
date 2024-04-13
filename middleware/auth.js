import jwt from 'jsonwebtoken';
import User from '../database/models/User.js';


const userAuth = async (req,res,next)=>{ 
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        // const token = req.body.token;  //getting the token from the cookies of the user's browser

        if (!token) { 
            res.json({token:false})
            throw new Error('Token not provided');
        }
        const verifyUser = jwt.verify(token,"iAmSiddharthPatidarAndThisIsTheSignatureKey");
        console.log(verifyUser);
        const user = await User.findOne({_id:verifyUser._id});  //getting all the information of user from the database
        // console.log(user)
        req.user = user;
        req.token = token; 
        // console.log(req.user)
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send("User authentication failed\n"+error);
    }
}
export default userAuth;