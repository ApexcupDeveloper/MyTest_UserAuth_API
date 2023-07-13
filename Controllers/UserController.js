const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../Utils/jwt.js");
const userServices = require("../Services/UserServices.js");
const User = require("../Models/UserModels.js");

router.post("/register", (req, res, next) => {
  const { password, email } = req.body;
  const salt = bcrypt.genSaltSync(10);
  req.body.password = bcrypt.hashSync(password, salt);

  userServices
    .register(req.body)
    .then(async () => {
      const user = await User.findOne({ email });
      res.send({
        ...user.toJSON(),
        token: auth.generateAccessToken(email),
      });
    })
    .catch((err) => next(err));
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  userServices
    .login({ email, password })
    .then((response) => {
      if (response.success) {
        res.json(response);
      } else {
        if (response.type === "password") {
          res.status(400).json({ success: false, message: "Invaid password" });
        } else {
          res
            .status(400)
            .json({ success: false, message: "This email is not exist" });
        }
      }
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  userServices
    .getAll()
    .then((vehicles) => res.send(vehicles))
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  userServices
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

router.put("/:id", (req, res, next) => {
  userServices
    .updateById(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch((err) => next(err));
});

module.exports = router;
