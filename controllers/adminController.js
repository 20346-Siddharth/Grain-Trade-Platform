import CropPrice from "../database/models/cropPrice.js"
import Token from "../database/models/farmerToken.js";
import PurchaseDetailsAdmin from "../database/models/purchaseDatailsAdmin.js";
import verifybuyer from "../database/models/verifyBuyers.js"
const adminController= {
    async addcrop(req,res){
      try{  const { cropname, startingprice, closingprice } = req.body;
        const existingCrop = await CropPrice.findOne({ cropname });
        if(existingCrop){
            res.json("Crop with this name already exist")
            return;
        }
        const newCrop = new CropPrice({
            cropname,
            startingprice,
            closingprice
        });
        await newCrop.save();
        console.log('New crop price added:', newCrop);

        res.json({ success: true });
    } catch (err) {
        console.error("Error adding or updating the crop:", err);
        res.status(500).json({ error: "Error adding or updating the crop" });
    }

    },

    async deletecrop(req,res){
    try{
        const { cropId } = req.body;

        const existingCrop = await CropPrice.findOne({ _id :cropId});
        if (existingCrop) {
            // Crop with the same name found, delete it
            await CropPrice.deleteOne({ _id:cropId });
            console.log(`Deleted existing crop: ${existingCrop}`);
            res.json({deleted:true})
            return;
        }
        else{
            res.json({deleted:false})
        }

    }catch(err){
        console.log(err);
    }
    },
   async updatecropprices(req, res, next) {
    try {

        console.log(req.body)
        const { _id,cropname, startingprice, closingprice } = req.body;

        // Check if a crop with the same name exists
        const existingCrop = await CropPrice.findOne({ _id });

        if (existingCrop) {
            // Crop with the same name found, delete it
            await CropPrice.deleteOne({ _id });
            console.log(`Deleted existing crop: ${existingCrop}`);
        }

        // Create a new crop price entry
        const newCropPrice = new CropPrice({
            cropname,
            startingprice,
            closingprice
        });

        await newCropPrice.save();
        console.log('New crop price added:', newCropPrice);

        res.json({ success: true });
    } catch (err) {
        console.error("Error adding or updating the crop:", err);
        res.status(500).json({ error: "Error adding or updating the crop" });
    }
},

  async addTransection(req,res,next){
       console.log(req.body)
       const{tokenNumber,cropName,price,estimatedWeight,buyerID}=req.body

       const used = await PurchaseDetailsAdmin.findOne({tokenNumber:tokenNumber})
 

       if(used){
        res.json({used:"yes"})
        return ;
       }
       const farmer=await Token.findOne({tokennumber:tokenNumber})

       if(!farmer){
        res.json({farmer:"no"})
        return;
       }

       const buyer = await verifybuyer.findOne({buyerID:buyerID})
       if(!buyer){
        res.json({buyer:"no"})
        return;
       }

       console.log(farmer)
       console.log(buyer)

       const newtransection = new PurchaseDetailsAdmin({
        tokenNumber,cropName,price,estimatedWeight,buyerID,farmer:farmer._id,buyer:buyer.buyer

       })

       await newtransection.save();
       console.log("Done")
       res.json({done:true})

  }, 


  async seeAllTokens(req,res,next){
    try {
        
        const allTokens =  await Token.find();
        const activeTokens = allTokens.filter((token) => !token.Expire);
        const expiredTokens = allTokens.filter((token) => token.Expire);
    
        res.send({ activeTokens, expiredTokens });
      } catch (error) {
        next(error); // Pass any errors to the error handler
      }
    
  },


  async seeAllTransections(req,res,next){
      const allTransections=await PurchaseDetailsAdmin.find();
      res.json({allTransections})

  }
}

export default adminController