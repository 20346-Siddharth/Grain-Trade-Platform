import mongoose from 'mongoose';

const  verifyBuyers = new mongoose.Schema({
    buyer:{
        type: String,
        required:true,
    },

    buyerID:{
        type: String,
        required:true,
        unique:true
    },
    account: {
        type: String,
        required: true
    },
    ifsc: {
        type: String,
        required: true
    },
    
})

const verifyBuyer=new mongoose.model("verifiedBuyers",verifyBuyers)
export default verifyBuyer