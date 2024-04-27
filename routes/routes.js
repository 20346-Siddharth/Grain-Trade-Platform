import express from "express"
import adminController from "../controllers/adminController.js"
import buyerController from "../controllers/buyerController.js"
import farmerController from "../controllers/farmerController.js"
import getCropPriceController from "../controllers/getCropPriceController.js"
import loginController from "../controllers/loginController.js"

import userController from "../controllers/userController.js"

import userAuth from "../middleware/auth.js"


const router=express.Router()

router.get("/",(req,res)=>{
    res.send('Hello')
})

router.post("/userRegister",userController.newRegister)
router.post("/login",loginController.login)
router.post("/logout",userAuth,loginController.logout)


router.post('/profile',userAuth,loginController.profile)
router.get('/getAllCrops',getCropPriceController.getCropPrice)
router.get("/getAdminSlip",userAuth,userController.getAdminSlip)
router.post("/searchCrop",userController.searchCrop)



//Admin
router.post('/addcrop',adminController.addcrop)
router.delete('/deletecrop',adminController.deletecrop)
router.post("/updateCropPrice",adminController.updatecropprices) 
router.post("/addTransectionDetails",adminController.addTransection)

router.get('/seeAllTokens',adminController.seeAllTokens)
router.get("/seeAllTransections",adminController.seeAllTransections)
router.get("/allVerifiedBuyers",adminController.allVerifiedBuyers)

//farmer

router.post("/getToken",userAuth,farmerController.getToken)
router.get("/showTokens",userAuth,farmerController.showToken)
router.get("/previousFarmerSells",userAuth,farmerController.previousFarmerSells)



//buyer
router.post("/verifyBuyer",userAuth,buyerController.verifyBuyerDetails)
router.post("/addBuyerPurchase",userAuth,buyerController.addBuyerPurchase)

router.get("/seeMyPurchases",userAuth,buyerController.seeMyPurchase)

router.get("/verificationStatus",userAuth,buyerController.verificationStatus)

 
export default router