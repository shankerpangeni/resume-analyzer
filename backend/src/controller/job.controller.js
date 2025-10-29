import { pipeline } from '@xenova/transformers';
import { Job } from './../models/job.models.js';

// ✅ Safe singleton for Xenova embedder
let embedder;
const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
};

// 🟢 Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, skillsRequired, experience, education, salaryRange, jobType ,location, company} = req.body;

    const job = new Job({
      title,
      location,
      description,
      skillsRequired,
      experience,
      education,
      salaryRange,
      company,
      jobType,
      postedBy: req.id, // from isAuthenticated middleware
    });

    // Compute embedding
    const embed = await getEmbedder();
    const jobText = [title, description, skillsRequired.join(' '), experience, education].join(' ');
    const embeddingResult = await embed(jobText);

    // Convert to flat array safely
    let vector;
    if (Array.isArray(embeddingResult) && Array.isArray(embeddingResult[0])) {
      vector = embeddingResult.flat();
    } else if (Array.isArray(embeddingResult)) {
      vector = embeddingResult;
    } else if (embeddingResult.data) { // tensor-like object
      vector = Array.from(embeddingResult.data);
    } else {
      throw new Error('Unexpected embedding format');
    }

    job.embedding = vector;

    await job.save();

    return res.status(201).json({ message: 'Job created with embedding', job });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error creating job', success: false });
  }
};

// 🟡 Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'fullname email');

    return res.status(200).json({
      message: 'Jobs fetched successfully.',
      jobs,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to fetch jobs.',
      success: false,
    });
  }
};

// 🔵 Get single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate('postedBy', 'fullname email');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found.',
        success: false,
      });
    }

    return res.status(200).json({
      message: 'Job fetched successfully.',
      job,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Error fetching job.',
      success: false,
    });
  }
};

// 🟠 Delete job (only by the creator)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found.',
        success: false,
      });
    }

    if (job.postedBy.toString() !== req.id) {
      return res.status(403).json({
        message: 'You are not authorized to delete this job.',
        success: false,
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      message: 'Job deleted successfully.',
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Server error while deleting job.',
      success: false,
    });
  }
};
