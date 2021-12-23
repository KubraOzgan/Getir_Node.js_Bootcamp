const JWT = require("jsonwebtoken");
const httpStatus = require("http-status");

const authenticateToken = (req, res, next) => {
    /*Bearer Token S-secildi:
    const token = req.headers?.authorization?.split(" ")[1] || null; //header icinde token:>> { authorization: 'Bearer tokenKismi', } seklinde tutulur.*/
    const token = req.headers?.token; //API Key secildi
    if(!token) res.status(httpStatus.UNAUTHORIZED).send({message: "Login first"})
    
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if(err) return res.status(httpStatus.FORBIDDEN).send(err)
        req.user = user; 
        next();
    });
};

module.exports = authenticateToken;
