const express = require("express");
const { index, create, login, resetPassword } = require("../controllers/Users");
const schemas = require("../validations/Users");
const validate = require("../middlewares/validate");
//const  authenticate = require("../middlewares/authenticate");
const  authenticateAdmin = require("../middlewares/authenticateAdmin");


const router = express.Router();

router.route("/create-admin-user").post(validate(schemas.createAdminUser, "body"), create); //validate(createAdminUser, "body")
router.route("/login").post(validate(schemas.userLogin, "body"), login); 

//Admin
router.route("/").get(authenticateAdmin, index);
router.route("/").post(authenticateAdmin, validate(schemas.createUser, "body"), create); 
// router.route("/:typeId").post(validate(userQuery, "query"),validate(createUser, "body"), create);

router.route("/reset-password").post(validate(schemas.resetPassword, "body"), resetPassword);

module.exports = router;
