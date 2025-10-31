import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { Resume } from './../models/resume.models.js';
import { Job } from './../models/job.models.js';
import { pipeline } from '@xenova/transformers';

// Predefined skills
const SKILLS_LIST = ['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'MongoDB', 'HTML', 'CSS'];

// ✅ Cosine similarity with normalization
const cosineSimilarity = (vecA, vecB) => {
  const minLen = Math.min(vecA.length, vecB.length);
  const a = vecA.slice(0, minLen);
  const b = vecB.slice(0, minLen);

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return magA && magB ? dot / (magA * magB) : 0;
};

// Initialize embedder
let embedder;
const initEmbedder = async () => {
  if (!embedder) embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
};

// ✅ Safer embedding flattening
const cleanEmbedding = (embed) => {
  if (!embed) return [];
  if (Array.isArray(embed) && typeof embed[0] === 'number') return embed;
  if (Array.isArray(embed) && Array.isArray(embed[0])) return embed.flat();
  if (embed.data) return Array.from(embed.data);
  return Array.from(embed);
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'PDF file is required.', success: false });

    // 🔹 Read and parse PDF
    const pdfBuffer = fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: pdfBuffer });
    const { text: resumeText } = await parser.getText();

    // 🔹 Extract skills
    const skills = SKILLS_LIST.filter(skill => new RegExp(`\\b${skill}\\b`, 'i').test(resumeText));

    // 🔹 Extract experience
    let experience = 0;
    const expMatch = resumeText.match(/(\d+)\s+years?/i);
    if (expMatch) experience = parseInt(expMatch[1]);

    // 🔹 Extract education
    let education = '';
    if (/bachelor/i.test(resumeText)) education = 'Bachelors';
    else if (/master/i.test(resumeText)) education = 'Masters';
    else if (/ph\.d|phd/i.test(resumeText)) education = 'PhD';

    // 🔹 Generate embeddings
    await initEmbedder();
    const embeddingResult = await embedder(resumeText, { pooling: 'mean', normalize: true });
    const embedding = cleanEmbedding(embeddingResult);

    // 🔹 Save resume
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

    // 🔹 Fetch jobs
    const jobs = await Job.find({ embedding: { $exists: true, $ne: [] } });
    if (!jobs.length)
      return res.status(404).json({ message: 'No jobs available with embeddings.', success: false });

    // 🔹 Compute similarity
    const recommendations = jobs.map(job => {
      const jobVector = cleanEmbedding(job.embedding);
      const similarity = cosineSimilarity(embedding, jobVector);
      const similarityScore = Math.round(similarity * 100);
      return { jobId: job._id, similarityScore };
    });

    console.log("🔍 Similarity scores:", recommendations.map(r => r.similarityScore));

    // 🔹 Sort & pick top 6
    const topRecommendations = recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 6);

    // ✅ New logic for resume validation
    const highest = Math.max(...recommendations.map(r => r.similarityScore));
    const average = topRecommendations.reduce((a, b) => a + b.similarityScore, 0) / topRecommendations.length;
    const THRESHOLD = 5; // relaxed — realistic embeddings are often low (3–20)

    if (highest < THRESHOLD && average < THRESHOLD) {
      await Resume.findByIdAndDelete(resume._id); // cleanup
      return res.status(400).json({
        message: 'Please upload a valid resume — no meaningful matches found.',
        success: false,
      });
    }

    // 🔹 Save recommendations
    resume.recommendedJobs = topRecommendations.map(r => ({
      job: r.jobId,
      similarityScore: r.similarityScore,
    }));
    await resume.save();

    // 🔹 Populate for frontend
    const populatedResume = await Resume.findById(resume._id).populate('recommendedJobs.job');
    const recommendedJobs = populatedResume.recommendedJobs.map(r => ({
      ...r.job.toObject(),
      similarityScore: r.similarityScore,
    }));

    return res.status(201).json({
      message: 'Resume uploaded and job recommendations generated successfully.',
      resume,
      recommendedJobs,
      success: true,
    });

  } catch (error) {
    console.error('Upload + Recommendation Error:', error);
    return res.status(500).json({
      message: 'Server error while uploading resume and generating recommendations.',
      success: false,
    });
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

