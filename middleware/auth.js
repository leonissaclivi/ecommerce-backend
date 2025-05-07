const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const middleware = async (req,res,next)=>{
    // const {token} = req.headers;
    const token = req.cookies.token; 
    if(!token){
        return res.status(401).json({message:'No token, Authorization revoked'});
    }
    try {
        const decoded = jwt.verify(token,process.env.secret_key);
        if (!decoded.user) {
            return res.status(401).json({ msg: 'Token is not valid' });
          }
        req.user = decoded.user;
        console.log(req.user.id);
        
        next();
    } catch (error) {
        res.status(401).json({message:'Invalid token'});
    }
}

module.exports = middleware;