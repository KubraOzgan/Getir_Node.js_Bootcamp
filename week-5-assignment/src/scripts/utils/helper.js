const CryptoJS = require('crypto-js');
const JWT = require('jsonwebtoken');

const passwordToHash = (password) => {
    const hashKey = CryptoJS.HmacSHA1(password, process.env.PASSWORD_HASH).toString();
    return CryptoJS.HmacSHA256(password, hashKey).toString();
};

const generateJWTAccessToken = (user) => {
    return JWT.sign({ name: user.email, ...user}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn : "1w"});
};

const generateJWTRefreshToken = (user) => {
    return JWT.sign({ name: user.email, ...user}, process.env.REFRESH_TOKEN_SECRET_KEY);
};

const checkSecureFile = (mimeType) => { //sadece image olanlari al
    // "image/png" ""
    return mimeType.includes("image/"); //mimeType file typelari icerir
};

module.exports = {
    passwordToHash,
    generateJWTAccessToken,
    generateJWTRefreshToken,
    checkSecureFile,
};