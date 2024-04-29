import CropPrice from "../database/models/cropPrice.js"
import Token from "../database/models/farmerToken.js";
import PurchaseDetailsAdmin from "../database/models/purchaseDatailsAdmin.js";
import verifyBuyer from "../database/models/verifyBuyers.js";
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
        tokenNumber,cropName,price,estimatedWeight,buyerID,farmer:farmer.user,buyer:buyer.buyer

       })

       await newtransection.save();
       console.log("Done")
       res.json({done:true})

  }, 


  async seeAllTokens(req,res,next){
    try {
        
        const allTokens =  await Token.find();
        const activeTokens = allTokens.filter((token) => token.Expire);
        const expiredTokens = allTokens.filter((token) => !token.Expire);
    
        res.send({ activeTokens, expiredTokens }); 
      } catch (error) {
        next(error); // Pass any errors to the error handler
      }
    
  },


  async seeAllTransections(req,res,next){
      const allTransections=await PurchaseDetailsAdmin.find();
      res.json({allTransections})

  },
  async allVerifiedBuyers(req,res,next){
    const buyers=await verifyBuyer.find();
    res.json({buyers})
  },
  async search_view_all_common_slips(req,res,next){
    const { crop } = req.body;
    const substring=crop;
      if (!crop) {
        return res.status(400).json({ error: 'Crop name is required' });
      }
    const cropsDatabase = await PurchaseDetailsAdmin.find({
      $and: [
          { tokenNumber: { $regex: new RegExp(substring, 'i') } }, 
           ]
    });
    
    
      // const matchingCrops = cropsDatabase.filter(c => c.includes(crop.toLowerCase()));
    
    
      res.status(200).json({ crops: cropsDatabase });
    
  },
  async search_view_all_verified_buyers(req, res, next) {
    try {
      const { crop } = req.body;
      const substring = crop;
  
      if (!crop) {
        return res.status(400).json({ error: 'Crop name is required' });
      }
  
      const cropsDatabase = await verifyBuyer.find({
        $and: [{ buyerID: substring }],
      });
  
      res.status(200).json({ crops: cropsDatabase });
    } catch (error) {
      console.error('Error in search_view_all_tokens:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async search_view_all_tokens(req, res, next) {
    try {
      const { crop } = req.body;
      const substring = crop;
  
      if (!crop) {
        return res.status(400).json({ error: 'Crop name is required' });
      }
  
      const cropsDatabase = await Token.find({
        $and: [{ tokennumber: substring }],
      });
  
      res.status(200).json({ crops: cropsDatabase });
    } catch (error) {
      console.error('Error in search_view_all_tokens:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  
}

export default adminController