import Token from "../database/models/farmerToken.js";

const checkTokenExpiry = async (req, res, next) => {
    try {
        const allTokens = await Token.find();

        // Check and update expiry status for each token
        for (const token of allTokens) {
            const currentDate = new Date();
            if (currentDate > token.date) {
                token.Expire= true; // Mark token as expired
            } 
            await token.save(); // Save the updated token
        }

        // Call the next middleware
        next();
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};

export default checkTokenExpiry;
