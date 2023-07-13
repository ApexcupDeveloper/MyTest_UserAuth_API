function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(403).json({ message: "Access token expired" });
  }

  if (err.name === "ValidationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Token not valid" });
  }

  if (err.name == "MongoServerError") {
    let resp = JSON.parse(JSON.stringify(err));
    if (resp.code === 11000) {
      if (Object.keys(resp.keyPattern)[0] === "email") {
        return res
          .status(400)
          .json({
            message: `Your email ${resp.keyValue.email} is already exist.`,
          });
      }
      return res.status(502).json({ message: err.message });
    } else {
      return res.status(502).json({ message: err.message });
    }
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}

module.exports = {
  errorHandler,
};
