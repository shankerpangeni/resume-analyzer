import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { Resume } from './../models/resume.models.js';
import { Job } from './../models/job.models.js';
import { pipeline } from '@xenova/transformers';

// Predefined skills
const SKILLS_LIST = ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'MongoDB', 'HTML', 'CSS'];

// Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
return dot / (magA * magB);
};

// Initialize embedder
let embedder;
const initEmbedder = async () => {
if (!embedder) embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
};

// 🟢 Upload Resume
export const uploadResume = async (req, res) => {
try {
if (!req.file)
return res.status(400).json({ message: 'PDF file is required.', success: false });

const pdfBuffer = fs.readFileSync(req.file.path);

// Parse resume text
const parser = new PDFParse({ data: pdfBuffer });
const { text: resumeText } = await parser.getText();

// Extract skills
const skills = SKILLS_LIST.filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(resumeText));

// Extract experience
let experience = 0;
const expMatch = resumeText.match(/(\d+)\s+years?/i);
if (expMatch) experience = parseInt(expMatch[1]);

// Extract education
let education = '';
if (/bachelor/i.test(resumeText)) education = 'Bachelors';
else if (/master/i.test(resumeText)) education = 'Masters';
else if (/ph\.d|phd/i.test(resumeText)) education = 'PhD';

// Generate embeddings
await initEmbedder();
const embeddingResult = await embedder(resumeText, { pooling: 'mean', normalize: true });

// Handle various data formats from Transformers pipeline
let embedding;
if (embeddingResult.data) {
  embedding = Array.from(embeddingResult.data);
} else if (Array.isArray(embeddingResult)) {
  embedding = embeddingResult.flat();
} else {
  throw new Error('Unexpected embedding format');
}

// Save to DB
const resume = await Resume.create({
  user: req.id,
  fileUrl: req.file.path,
  filename: req.file.originalname,
  skills,
  experience,
  education,
  fullText: resumeText,
  embedding,
});

return res.status(201).json({
  message: 'Resume uploaded and parsed successfully.',
  resume,
  success: true,
});


} catch (error) {
console.error('Upload Error:', error);
return res.status(500).json({ message: 'Server error while uploading resume.', success: false });
}
};

// 🟡 Get all resumes for logged-in user
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.id }).populate('appliedJobs', 'title company location');

        return res.status(200).json({
            message: 'Resumes fetched successfully.',
            resumes,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to fetch resumes.', success: false });
    }
};

// 🔵 Get a single resume by ID
export const getResumeById = async (req, res) => {
    try {
        const { id } = req.params;
        const resume = await Resume.findById(id).populate('appliedJobs', 'title company location');

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found.', success: false });
        }

        if (resume.user.toString() !== req.id) {
            return res.status(403).json({ message: 'Not authorized to view this resume.', success: false });
        }

        return res.status(200).json({ message: 'Resume fetched successfully.', resume, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching resume.', success: false });
    }
};

// 🔹 Helper to convert embeddings to plain Number[] for MongoDB and similarity calculations
const cleanEmbedding = (embed) => {
  if (!embed) return [];
  // If it’s already a flat array of numbers
  if (Array.isArray(embed) && typeof embed[0] === 'number') return embed;
  // If embed is nested arrays (from transformer output)
  if (Array.isArray(embed) && Array.isArray(embed[0])) return embed.flatMap(x => Array.from(x));
  // If embed is a typed array like Float32Array
  if (embed.data) return Array.from(embed.data.flat());
  // fallback
  return Array.from(embed);
};

// 🟠 Get recommended jobs for a resume
export const getRecommendedJobs = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found.', success: false });

    // Initialize embedder
    await initEmbedder();

    // Compute resume embedding if missing
    let resumeVector = cleanEmbedding(resume.embedding);
    if (resumeVector.length === 0) {
      const embeddingResult = await embedder(resume.fullText);
      resumeVector = cleanEmbedding(embeddingResult);
      resume.embedding = resumeVector;
      await resume.save();
    }

    // Fetch jobs
    const jobs = await Job.find({ embedding: { $exists: true, $ne: [] } });

    // Compute similarity
    const recommendations = jobs.map((job) => {
      const jobVector = cleanEmbedding(job.embedding);
      const similarityScore = Math.round(cosineSimilarity(resumeVector, jobVector) * 100);
      return { jobId: job._id, similarityScore };
    });

    // Sort descending by similarity and get top 5–10
    const topRecommendations = recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 6);

    // Save recommended jobs in resume
    resume.recommendedJobs = topRecommendations.map(r => r.jobId);
    await resume.save();

    // Populate job details
    const recommendedJobs = await Job.find({ _id: { $in: resume.recommendedJobs } });

    return res.status(200).json({
      message: 'Recommended jobs fetched successfully.',
      recommendedJobs,
      success: true,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    return res.status(500).json({ message: 'Error fetching recommended jobs.', success: false });
  }
};