import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const  isAuthenticated  = async (req, res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token ){
            return res.status(401).json({success:false,msg: "No token, authorization denied"});
        }
        const decode = await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({success:false,msg: "Invalid token, authorization denied"})
        }
        const user = await User.findById(decode.id);
        if (!user) {
            return res.status(401).json({ success: false, msg: "User not found" });
        }
        req.user = user;
        req.id= decode.id;
        next();
    }catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: err.message,
        })
    }
}
export default isAuthenticated;