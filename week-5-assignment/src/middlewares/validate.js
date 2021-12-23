const httpStatus = require("http-status");

const validate = (schema, source) => (req, res, next) => { //source user bilgisi yani req.body. Source yerine => req.body, req.params, req.query
  const { value, error } = schema.validate(req[source]); 
  if (error) {
    const errorMessage = error?.details
      ?.map((detail) => detail?.message)
      .join(", ");
    //   ["message1", "message2", "m3"] => "message1, message2, m3"
    return res.status(httpStatus.BAD_REQUEST).send({ error: errorMessage });
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
