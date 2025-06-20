import express from 'express';
import {getAdminJobs, getAllJobs, getJobById, postJob, saveJob, getSavedJobs} from '../controllers/jobController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { uploadFiles } from '../middlewares/multer.js';

const Router = express.Router();

Router.route('/post').post(isAuthenticated, uploadFiles, postJob);
Router.route('/get').get(getAllJobs);
Router.route('/get/:id').get(getJobById);
Router.route('/getAdminjobs').get(isAuthenticated,getAdminJobs);
Router.route('/save/:id').post(isAuthenticated, saveJob);
Router.route('/saved').get(isAuthenticated, getSavedJobs);

export default Router;
