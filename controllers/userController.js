import Joi from 'joi';
import User from '../database/models/User.js';
import PurchaseDetailsAdmin from "../database/models/purchaseDatailsAdmin.js";
import CropPrice from '../database/models/cropPrice.js';
const userController={

    async register(req,res,next){
        try{
      const {username,email,mobile,category,account,ifsc,password}=req.body;
     
      
      const registerSchema=Joi.object({
        username: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        mobile: Joi.string().min(10).max(10).pattern(new RegExp('^[0-9]{10}$')).required(),
        category: Joi.string().min(3).max(20).required(),
        account: Joi.string().min(8).max(15).pattern(new RegExp('^[0-9]{10}$')).required(),
        ifsc: Joi.string().min(8).max(15).required(),
        password: Joi.string().min(6).max(20).pattern(new RegExp('^[a-zA-Z-0-9]{3,30}$')).required(),
        // buyerID: Joi.string(),
      })

      const{error}=registerSchema.validate(req.body);
      if (error) {
        console.log('Validation Error'+ error);
        return res.json({invalid:true})
        return next(error);
    }
    const exists = await User.exists({ email: email });
    if (exists) {
        // res.send('The email is already registered to Institute Lab Hub')
        // return next(CustomErrorHandler.alreadyExists('This Email is already taken'));
       return  res.json({'AlreadyExists':true});
        res.end();
      }

        const user=new User({
          username,email,mobile,category,account,ifsc,password
        })
        const token=await user.generateAuthToken();
        user.save();
        res.cookie('jwt', token, {
          expires: new Date(Date.now() + 50000000),   //in milliseconds 
          httpOnly: true,
          // secure: true
      });

      return res.json({'success': true});
   

        }catch(err){

          console.log(err);
          res.json({ success: false });

        }
    },

async newRegister(req,res,next){
  try{
      

    const {username,mobile,aadhar,category,address,password}=req.body;
    const registerSchema=Joi.object({
      username: Joi.string().min(3).max(20).required(),
     
      mobile: Joi.string().min(10).max(10).pattern(new RegExp('^[0-9]{10}$')).required(),
      aadhar: Joi.string().length(12).pattern(new RegExp('^[0-9]{12}$')).required(),
      category: Joi.string().min(3).max(20).required(),
      address: Joi.string().min(3).max(20).required(),
      
      password: Joi.string().min(6).max(20).pattern(new RegExp('^[a-zA-Z-0-9]{3,30}$')).required(),
   
    })

    const{error}=registerSchema.validate(req.body);
    if (error) {
      console.log('Validation Error'+ error);
      return res.json({invalid:true})
      return next(error);
  }

  const exists = await User.exists({ mobile: mobile });
    if (exists) {
        // res.send('The email is already registered to Institute Lab Hub')
        // return next(CustomErrorHandler.alreadyExists('This Email is already taken'));
       return  res.json({'AlreadyExists':true});
        res.end();
      }

      const user=new User({
        username,mobile,category,adhar:aadhar,password,address
      })
      const token=await user.generateAuthToken();
      user.save();
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 50000000),   //in milliseconds 
        httpOnly: true,
        // secure: true
    });

    return res.json({'success': true});
 


  }catch(error){
    console.log(err);
    res.json({ success: false });
  }
},



async getAdminSlip(req,res,next){
    console.log(req.user)
  if(req.user.category  === "buyer"){
    const slips = await PurchaseDetailsAdmin.find({buyer:req.user._id})
    console.log(slips)
    res.json(slips)
  }else{
    const slips = await PurchaseDetailsAdmin.find({farmer:req.user._id})
    res.json(slips)
  }

  

},


async searchCrop(req,res,next){
  const { crop } = req.body;
const substring=crop;
  if (!crop) {
    return res.status(400).json({ error: 'Crop name is required' });
  }
const cropsDatabase = await CropPrice.find({
  $and: [
      { cropname: { $regex: new RegExp(substring, 'i') } }, // search for documents with the substring in the instituteName field, ignoring case sensitivity
       ]
});


  // const matchingCrops = cropsDatabase.filter(c => c.includes(crop.toLowerCase()));


  res.status(200).json({ crops: cropsDatabase });

}
    
}

export default userController;