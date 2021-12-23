const JWT = require("jsonwebtoken");
const httpStatus = require("http-status");

const authenticateToken = (req, res, next) => {
    //const token = req.headers?.authorization?.split(" ")[1] || null;
    const token = req.headers?.token;
    if(!token) res.status(httpStatus.UNAUTHORIZED).send({message: "Login first"})
    
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if(err) return res.status(httpStatus.FORBIDDEN).send(err)
        if(!user?._doc?.isAdmin) res.status(httpStatus.UNAUTHORIZED).send({message: "You are not admin."})
        req.user =  user?._doc; //useri yazdirip user bilgilerinin doc'un icinde oldugunu gorduk.
        next();
    })
};

module.exports = authenticateToken