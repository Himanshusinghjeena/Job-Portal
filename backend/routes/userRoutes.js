import express from 'express';
import { getUserById, login, logout, register, updateProfile } from '../controllers/userController.js';
import isAuthenticated  from '../middlewares/isAuthenticated.js'
import { singleUpload, multiFileUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/profile/update").put(isAuthenticated,multiFileUpload,updateProfile)
router.route("/profile/:userId").get(isAuthenticated, getUserById);
router.route("/logout").get(logout);
// router.route('/admin/viewprofile/:id').get(isAuthenticated,getUserById);

export default router;
