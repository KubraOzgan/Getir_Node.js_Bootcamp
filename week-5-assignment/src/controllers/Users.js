const hs = require("http-status");
const { list, insert, findOne, modify } = require("../services/Users");
const {passwordToHash,  generateJWTAccessToken, generateJWTRefreshToken} = require("../scripts/utils/helper")
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");

const index = (req, res) => {
  list()
    .then((userList) => {
      if (!userList) res.status(hs.INTERNAL_SERVER_ERROR).send({ error: "Not completed." });
      res.status(hs.OK).send(userList);
    })
    .catch((e) => res.status(hs.INTERNAL_SERVER_ERROR).send(e));
};

const create = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  //return false;
  insert(req.body)
    .then((createdUser) => {
      if (!createdUser) res.status(hs.INTERNAL_SERVER_ERROR).send({ error: "Not completed." });
      res.status(hs.OK).send(createdUser);
    })
    .catch((e) => res.status(hs.INTERNAL_SERVER_ERROR).send(e));
};

const login = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  findOne(req.body)
  .then(user => {
    if(!user) return res.status(hs.NOT_FOUND).send({message: "User not found"});
    user = {
      ...user.toObject(), 
      tokens: {
        access_token: generateJWTAccessToken(user),
        refresh_token: generateJWTRefreshToken(user),
      }
    }
    delete user.password;
    res.status(hs.OK).send(user);
  })
  .catch((e) => res.status(hs.INTERNAL_SERVER_ERROR).send(e));
};

const resetPassword = (req, res) => { 
  const new_password = uuid.v4()?.split("-")[0] || `usr-${new Date().getTime()}`           
  modify({email: req.body.email}, {password: passwordToHash(new_password)})
    .then(updatedUser => {
      if(!updatedUser) return res.status(hs.NOT_FOUND).send({message: "User not found"});
      eventEmitter.emit("send-email", {
        to: updatedUser.email, // list of receivers
        subject: "Reset Password", // subject line
        html: `Your password has been reset according to your request. <br/>Don't forget to change your password after logging in! <br/>New password: <b>${new_password}<b>`,
      });
      res.status(hs.OK).send({message: "New password has been sent to your email. "})
    })
    .catch(() => res.status(hs.INTERNAL_SERVER_ERROR).send({error: "Error acquired while resetting the password."}));
};

module.exports = {
  index,
  create,
  login,
  resetPassword
};
