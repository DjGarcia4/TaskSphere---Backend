import express from "express";
import {
  register,
  authenticate,
  confirmAccount,
  forgetPassword,
  checkToken,
  newPassword,
  profile,
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//*Creation, Registration, and confirmation of users
router.post("/", register); //*This create a new user
router.post("/login", authenticate);
router.get("/confirm/:token", confirmAccount);
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(checkToken).post(newPassword);

router.get("/profile", checkAuth, profile);
export default router;
