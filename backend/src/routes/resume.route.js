import express from 'express';
import { uploadResume, getUserResumes, getResumeById  } from './../controller/resume.controller.js';
import { isAuthenticated } from './../middleware/isAuthenticated.js';
import {upload} from './../middleware/multer.js'

const router = express.Router();

// Upload a new resume (logged-in users only)
router.post('/upload', isAuthenticated, upload.single('resume'), uploadResume);

// Get all resumes of the logged-in user
router.get('/all', isAuthenticated, getUserResumes);

// Get a single resume by ID (only owner can view)
router.get('/:id', isAuthenticated, getResumeById);

//Get recommended jobs for specific resume


export default router;
