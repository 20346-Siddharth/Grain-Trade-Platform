import mongoose from "mongoose";
const buyerpurchaseSchema = new mongoose.Schema({
    user:{
      type: String,
      required: true,
    },
    TokenNumber: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    estimatedWeight: {
      type: Number,
      required: true,
    },
    actualWeight: {
      type: Number,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalAmount:{
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    farmerId:{
      type: String,
      required: true,
    },
  });
  
  const Purchase = mongoose.model('Purchase', buyerpurchaseSchema);
export default Purchase  