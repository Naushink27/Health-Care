const jwt=require("jsonwebtoken")
const User=require("../models/User")
const adminAuth=async(req,res,next)=>{
    try{
        const token=req.cookies?.jwt;
        if(!token){
            return res.status(401).json({ error: "Please login first" }); 
          }
        const decodedData= jwt.verify(token, process.env.JWT_SECRET)
        const {_id}=decodedData;
        const user= await User.findById(_id)
        if(!user){
            return res.status(401).json({ error: "Invalid User!!!!" });
        }
        if(user.role!="admin"){
            return res.status(401).json({ error: "Cant access this page" });
        }
        req.user=user;
        next();
    }catch(err){
        return res.status(401).json({ error: "Invalid or Expired Token" });
      }
}
module.exports={adminAuth};