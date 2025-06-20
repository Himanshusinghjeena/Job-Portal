import express from 'express';
import isAuthnticated from '../middlewares/isAuthenticated.js'
import { applyJob, getApplicants, getAppliedJobs, updateStatus, notifyApplicationViewed, notifyResumeViewed } from '../controllers/applicationController.js';

const Router = express.Router();

Router.route("/apply/:id").get(isAuthnticated,applyJob);
Router.route("/get").get(isAuthnticated,getAppliedJobs);
Router.route('/:id/applicants').get(isAuthnticated,getApplicants);
Router.route('/status/:id/update').post(isAuthnticated,updateStatus);
Router.route('/notify-viewed/:applicationId').post(isAuthnticated, notifyApplicationViewed);
Router.route('/notify-resume-viewed/:applicationId').post(isAuthnticated, notifyResumeViewed);

export default Router;


