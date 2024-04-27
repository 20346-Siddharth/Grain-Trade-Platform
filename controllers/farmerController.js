import User from "../database/models/User.js";
import Token from "../database/models/farmerToken.js";
import buyerpurchase from "../database/models/buyerpurchase.js"

const farmerController = {
  async getToken(req, res, next) {
    let currentDate="";
    const allToken = await Token.find();
    const userBookedSlots = await Token.find({ user: req.user._id });

    console.log("Slots = " + userBookedSlots);
    if (userBookedSlots.length >= 5) {
      res.json("You can only book up to Five slots at a time.");
    } 
    
    else { 
     
      let count=0;
          console.log(req.body)
           if(req.body.Date){
            // const dt=+'T'
        const reqDate = new Date(req.body.Date).toISOString().split('T')[0]; // Get the date part from req.body.Date


        allToken.forEach((ele) => {
          const eleDate = new Date(ele.date).toISOString().split('T')[0]; // Get the date part from ele.date
         
      
          if ((eleDate === reqDate) && !ele.Expire) {
            count++;
          }
        });

        if (count < 3) {
     
          currentDate = new Date(req.body.Date);
        } else {
          
          res.json("Book for another Day")
          return;
          
        }


      }
      else{
         const today=new Date();
         today.setDate(today.getDate() + 1);
         let randomDate = new Date(today).toISOString().split('T')[0];

        while(true){
          count=0;
          allToken.forEach((ele) => {
            const eleDate = new Date(ele.date).toISOString().split('T')[0]; // Get the date part from ele.date
           
        
            if ((eleDate === randomDate) && !ele.Expire) {
              count++;
            }
          });
          if (count < 2) {
            // currentDate = new Date(maxDate);
            currentDate = new Date(randomDate);
            break;
          }else{
            const nextDate=new Date(randomDate);
            nextDate.setDate(nextDate.getDate() + 1);
            // randomDate.setDate(randomDate.getDate()+ 1);
            if(nextDate.getDay() == 0){
              nextDate.setDate(nextDate.getDate() + 1);
            }
            randomDate = new Date(nextDate).toISOString().split('T')[0];
          }
        }
      
        console.log("Radom Date")
      }
          
          
      const { username, mobile, adhar,category, password, address } =
        req.user;
      const user = new User({
        username,
        adhar,
        mobile,
        category,
        password,
       address
      });

      if (!user) {
        return res.status(401).send("Unauthorized");
      }

      let tok;
      let maxToken = 0;

      allToken.forEach((ele) => {
        if (ele.tokennumber > maxToken) {
          maxToken = ele.tokennumber;
        }
      });

      tok = maxToken + 1;

      console.log(user.account, user.ifsc, user.username);
      const bookedSlot = new Token({
        user: req.user._id,
        tokennumber: tok,
        date: currentDate,
        Expire: false,
        username: user.username,
        mobile: user.mobile,

      });

      try {
        await bookedSlot.save();
        res.send(bookedSlot);
      } catch (error) {
        console.error("Error saving booked slot:", error.message);
        res.status(500).send("Error booking slot");
      }
    }
  },

  async showToken(req, res, next) {
    try {
      const userTokens = await Token.find({ user: req.user._id });
  
      const activeTokens = userTokens.filter((token) => !token.Expire);
      const expiredTokens = userTokens.filter((token) => token.Expire);
  
      res.send({ activeTokens, expiredTokens });
    } catch (error) {
      next(error); // Pass any errors to the error handler
    }
  },

 
  async previousFarmerSells(req,res,next){

    const previousFarmerSells = await buyerpurchase.find({farmerId:req.user._id})
    res.json({previousFarmerSells})
  }
 
};

export default farmerController;
