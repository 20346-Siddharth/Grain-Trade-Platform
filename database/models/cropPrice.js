import mongoose from "mongoose";
const croppriceSchema = new mongoose.Schema({
    cropname: {
        type: String,
        required: true,
    },
    startingprice: {
        type: Number,
        required: true,
    },
    closingprice: {
        type: Number,
        required: true,
    },
});

const CropPrice = mongoose.model('CropPrice', croppriceSchema);
export default CropPrice