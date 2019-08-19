const jwt = require("jsonwebtoken");

const secreteKey = "somesupersecretkey";

exports.generateToken = payload =>
  jwt.sign(payload, secreteKey, { expiresIn: "1h" });

exports.decodeToken = token => {
  try {
    const payload = jwt.verify(token, secreteKey);
    return payload;
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
};

exports.checkUserIsAuthenticated = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Please provide authorization headers");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  const user = this.decodeToken(token);
  req.user = user;
  next();
};
