const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const validateToken = asyncHandler(async (req, res, next) => {
let token;
let authHeader = req.headers.Authorization || req.headers.authorization;
if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(401);
            throw new Error("User is not authorized");
         }
     req.user = user;
     next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    }

});

const verifyUser = (req,res,next)=>{
        if(req.user.id===req.params.id||req.user.role === 'admin'){
            next()
        }
        else{
            return res.status(401).json({
                success:false,
                message:"you're not authenticated"
            })
        }
}

const verifyAdmin = (req,res,next)=>{
        if(req.user.role === 'admin'){
            next()
        }
        else{
            return res.status(401).json({
                success:false,
                message:"you're not authorized"
            }) 
        }
}

module.exports = {validateToken,verifyAdmin,verifyUser}