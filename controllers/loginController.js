import bcrypt from 'bcryptjs';
import User from '../database/models/User.js';

const loginController = {
    async login(req, res, next) {
        try {
            const mobile = req.body.mobile;
            const password = req.body.password;
            const exists = await User.exists({ mobile: mobile });
            if (!exists) {
                return res.json({ exists: "User does not exist" });
            }
            const user = await User.findOne({ mobile: mobile  });
            const isMatch = await bcrypt.compare(password, user.password); // fixed variable name
            if (isMatch) {
                const token = await user.generateAuthToken();
                return res.json({
                    success: true,
                    token: token,
                    user:user
                });
            } else { 
                return res.json({
                    success: false
                });
            }
        } catch (error) {
            return res.json(error);
        }





        
    },
    async logout(req, res, next) {
        req.user.tokens = []; 
        res.clearCookie("token");
        await req.user.save();
        console.log('logged out successfully');
        return res.json({logout:true});
    },



    async profile(req,res,next){

        //   console.log(req.user)
            res.json(req.user)
    }
}

export default loginController;
