import CropPrice from "../database/models/cropPrice.js"


const getCropPriceController={

    async getCropPrice(req,res,next){

        try {
            const allCrops = await CropPrice.find();
            console.log(allCrops); // For debugging purposes
        
            res.json({ crops: allCrops }); // Sending JSON response with crops data
          } catch (err) {
            console.error('Error fetching crops:', err);
            res.status(500).json({ error: 'Internal Server Error' }); // Sending error response
          }
    }

}

export default getCropPriceController