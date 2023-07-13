const User = require("../Models/UserModels");
const bcrypt = require("bcryptjs");
const auth = require("../Utils/jwt.js");

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(email);
      return { ...user.toJSON(), success: true, token: token };
    }

    return { success: false, type: "password", data: null };
  } else {
    return { success: false, type: "email", data: null };
  }
}

async function register(params) {
  const user = new User(params);
  await user.save();
}

async function getById(id) {
  const user = await User.findById(id);
  return user.toJSON();
}

async function getByEmail(email) {
  const user = await User.findOne({ email });
  return user.toJSON();
}

async function updateById(id, params) {
  const result = await User.updateOne({ id: id }, { $set: params });
  if (result.modifiedCount) {
    const user = await User.findById(id);
    return user.toJSON();
  } else {
    return "updated failed";
  }
}

async function updateByParam(key, keyValue, updateKey, updateValue) {
  const result = await User.updateOne(
    { [key]: keyValue },
    { $set: { [updateKey]: updateValue } }
  );
  const user = await User.findOne({ [key]: keyValue });
  return user.toJSON();
}

async function getAll() {
  const users = await User.find();
  return users;
}

module.exports = {
  login,
  register,
  getById,
  getByEmail,
  updateById,
  updateByParam,
  getAll,
};
