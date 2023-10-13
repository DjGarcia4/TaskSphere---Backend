import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";
import { emailRegistration, emailForgetPassword } from "../helpers/email.js";

const register = async (req, res) => {
  //* Preventing duplicate users
  const { email } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    const error = new Error("User already register");
    res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = generateId();
    await user.save();
    emailRegistration({
      email: user.email,
      name: user.nameUser,
      token: user.token,
    });
    res.json({
      msg: "User succesfully created. Please check your email to confirm your account",
    });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //*Validating if the user exist
  if (!user) {
    const error = new Error("User is not exist");
    return res.status(400).json({ msg: error.message });
  }
  //*Validating if the user is confirm
  if (!user.confirmUser) {
    const error = new Error("Your account haven't been confirmed");
    return res.status(400).json({ msg: error.message });
  }
  //* Validating his password
  if (await user.validatePassword(password)) {
    res.json({
      _id: user._id,
      nameUser: user.nameUser,
      email: user.email,
      token: generateJWT(user._id),
    });
  } else {
    const error = new Error("Password Incorrect");
    return res.status(400).json({ msg: error.message });
  }
};
const confirmAccount = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error("Invalid Token");
    return res.status(400).json({ msg: error.message });
  }
  try {
    userConfirm.confirmUser = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.json({ msg: "User confirmed successfully" });
  } catch (error) {
    console.log(error);
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  //*Validating if the user exist
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User is not exist");
    return res.status(404).json({ msg: error.message });
  }
  try {
    user.token = generateId();
    await user.save();
    res.json({ msg: "We have seen an email with the instructions" });
    emailForgetPassword({
      email: user.email,
      name: user.nameUser,
      token: user.token,
    });
  } catch (error) {
    console.log(error);
  }
};
const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Valid Token and the user exist" });
  } else {
    const error = new Error("Invalid Token");
    res.status(400).json({ msg: error.message });
  }
};
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({ token });
  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
    } catch (error) {
      console.log(error);
    }
    res.json({ msg: "Password successfully modified" });
  } else {
    const error = new Error("Invalid Token");
    res.status(400).json({ msg: error.message });
  }
};
const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};
export {
  register,
  authenticate,
  confirmAccount,
  forgetPassword,
  checkToken,
  newPassword,
  profile,
};
