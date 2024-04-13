import mongoose from 'mongoose';
const purchaseDetailsAdminSchema = new mongoose.Schema({
    tokenNumber: {
      type: String,
      required: true,
    },
    farmer:{
      type: String,
      required: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedWeight: {
      type: Number,
      required: true,
    },
    buyerID: {
      type: String,
      required: true ,
    },
    buyer:{
      type: String,
      required: true ,
    }

  });
  
  const PurchaseDetailsAdmin = mongoose.model('PurchaseDetailsAdmin', purchaseDetailsAdminSchema);

  export default PurchaseDetailsAdmin