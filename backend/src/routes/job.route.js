import { isAuthenticated } from "./../middleware/isAuthenticated.js";
import { createJob, getAllJobs , getJobById , deleteJob } from "./../controller/job.controller.js";

import express from 'express';

const router = express.Router();

router.route('/create').post(isAuthenticated , createJob );
router.route('/all').get(getAllJobs);
router.route('/:id').get( getJobById);
router.route('/delete/:id').delete(isAuthenticated , deleteJob);


export default router;