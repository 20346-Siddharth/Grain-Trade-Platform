import dotenv from 'dotenv';
dotenv.config(); 
import verifyBuyer from "../database/models/verifyBuyers.js"
import buyerpurchase from "../database/models/buyerpurchase.js"
import Token from "../database/models/farmerToken.js"
import twilio from 'twilio';
import PurchaseDetailsAdmin from '../database/models/purchaseDatailsAdmin.js';
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const buyerController={

      
    async verifyBuyerDetails(req,res,next){


        const{buyerID,account,ifsc} = req.body.data
console.log(req.body.data)
        // const verified = await verifyBuyer.findOne({buyerID:buyerID})
        const exists = await verifyBuyer.findOne({buyerID:buyerID})

        if(exists){
            res.json({"exist":true})
            return ;
        }

        const buyer = new verifyBuyer({buyerID,account,ifsc,buyer:req.user._id})

        try{
            await buyer.save();
            client.messages
            .create({
                        from: '+14125438493',
                to: "+91"+req.user.mobile,
                body:`Thank You ${req.user.username} for Verifying With Us ! Your Buyer ID is ${buyer.buyerID}`
            })
            .then(message => console.log(message.sid))
            
             .catch(error => console.error('Error sending SMS:', error));;
            res.json({buyer:buyer})
        }catch(error){ 
            console.log(error) 
        }

    },
    
    async verificationStatus(req,res,next){

        const buyer = await verifyBuyer.findOne({buyer:req.user._id})
        console.log(buyer)
        if(buyer == null){
            res.json({Found:false})
            return ;
        }
        return res.json({buyer:buyer,Found:true})

    },
   async addBuyerPurchase(req,res,next){
       console.log(req.body)

       const{tokenNumber,mobileNumber,cropName,estimatedWeight,price,actualWeight} = req.body.data;

       const totalAmount= price * actualWeight;
       const farmer=await Token.findOne({tokennumber:tokenNumber})
    //    console.log(farmer)
       const newPurchase= new buyerpurchase({tokenNumber,mobileNumber,cropName,estimatedWeight,price,actualWeight,totalAmount,user:req.user._id,farmerId:farmer.user})

       try{
        await newPurchase.save();
        client.messages
        .create({
                    from: '+14125438493',
            to: "+91"+farmer.mobile,
            body:`${farmer.username},Your bill for Token Number ${newPurchase.tokenNumber} is 
                  Crop Name: ${newPurchase.cropName}
                  Actual Weight :${newPurchase.actualWeight}
                  Price:${newPurchase.price}
                  Amount : ${newPurchase.totalAmount}`
        })
        .then(message => console.log(message.sid))
        
        
        res.json(newPurchase)
        res.json({done:true})
    }catch(error){
        console.log(error)
    }



   },
   async seeMyPurchase(req,res){

    const seeMyPurchase = await buyerpurchase.find({user:req.user._id})
    res.json({seeMyPurchase})

   },
   async search_see_purchase(req, res) {
    try {
      const { crop } = req.body;
      const substring = crop;
  
      if (!crop) {
        return res.status(400).json({ error: 'Crop name is required' });
      }
  
      const userId = req.user._id; // Assuming req.user contains the logged-in user's details
  
      const cropsDatabase = await buyerpurchase.find({
        $and: [{ user: userId }, { tokenNumber: substring }],
      });
      console.log("Purchased crops:", cropsDatabase);
      res.status(200).json({ crops: cropsDatabase });
    } catch (error) {
      console.error('Error in search_see_purchase:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  async search_View_Common_Slip(req,res){
    try {
        const { crop } = req.body;
        const substring = crop;
    
        if (!crop) {
          return res.status(400).json({ error: 'Crop name is required' });
        }
    
        const userId = req.user._id; // Assuming req.user contains the logged-in user's details
    
        const cropsDatabase = await PurchaseDetailsAdmin.find({
          $and: [{ buyer: userId }, { tokenNumber: substring }],
        });
        console.log("Admin Slips for trader crops:", cropsDatabase);
        res.status(200).json({ crops: cropsDatabase });
      } catch (error) {
        console.error('Error in search_see_purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  }
  

}

export default buyerController