import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from  'jsonwebtoken';



const newUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    mobile: {
        type: String,
        required: true
    },
    adhar: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['farmer', 'buyer', 'admin'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            require: false
        }
    }],
  
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['farmer', 'buyer', 'admin'],
        required: true
    },
    account: {
        type: String,
        required: true
    },
    ifsc: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            require: false
        }
    }],
    buyerID:{
        type: String, unique: true, sparse: true 
    }
    
   
});

newUserSchema.methods.generateAuthToken = async function(){
    try{
        const token=jwt.sign({_id:this._id.toString()},'iAmSiddharthPatidarAndThisIsTheSignatureKey')
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        console.log('token is generated'+token);
        return token;

    }catch(err){
        // res.send(err) 
        console.log('token not generated'+ err)
    }
}

newUserSchema.pre('save', async function (next) {
    // Since the hashing should only be applied when password is being modified :
    if (this.isModified('password')) {
        // console.log('Current Password: ' + this.password);
        this.password = await bcrypt.hash(this.password, 10);   // hashing with 10 rounds more rounds = more time for algorithm to create hash password and longer it will take
        // console.log('Current Password: ' + this.password);
    }
    next();  //means now save method will be called
})

const User = new mongoose.model('User',newUserSchema);
// module.exports = Learner;
export default User;