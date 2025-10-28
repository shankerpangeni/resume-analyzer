import { Resume } from './../models/resume.models.js';
import { Job } from './../models/job.models.js';
import * as pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';
import { pipeline } from '@xenova/transformers';

// Predefined skills list
const SKILLS_LIST = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Django', 'MongoDB', 'HTML', 'CSS'
];

// Cosine similarity function
const cosineSimilarity = (vecA, vecB) => {
    const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dot / (magA * magB);
};

// Initialize Xenova embedder once
let embedder;
const initEmbedder = async () => {
    if (!embedder) {
        embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
};

// 🟢 Upload a resume
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required.', success: false });
        }

        const pdfBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse.default(pdfBuffer);
        const resumeText = data.text;

        // Extract skills
        const skills = SKILLS_LIST.filter(skill =>
            new RegExp(`\\b${skill}\\b`, 'i').test(resumeText)
        );

        // Extract experience
        let experience = 0;
        const expMatch = resumeText.match(/(\d+)\s+years?/i);
        if (expMatch) experience = parseInt(expMatch[1]);

        // Extract education
        let education = '';
        if (/bachelor/i.test(resumeText)) education = 'Bachelors';
        else if (/master/i.test(resumeText)) education = 'Masters';
        else if (/ph\.d|phd/i.test(resumeText)) education = 'PhD';

        // Compute embedding
        await initEmbedder();
        const embeddingResult = await embedder(resumeText);
        const embedding = embeddingResult.flat();

        // Save resume in DB
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
        console.log(error);
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

// 🟠 Get recommended jobs for a resume
export const getRecommendedJobs = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findById(resumeId);
        if (!resume) return res.status(404).json({ message: 'Resume not found.', success: false });

        // Ensure embedder initialized
        await initEmbedder();

        // Compute embedding if not stored
        let resumeVector = resume.embedding;
        if (!resumeVector || resumeVector.length === 0) {
            const embeddingResult = await embedder(resume.fullText);
            resumeVector = embeddingResult.flat();
            resume.embedding = resumeVector;
            await resume.save();
        }

        // Fetch jobs with embeddings
        const jobs = await Job.find({ embedding: { $exists: true, $ne: [] } });

        // Compute similarity scores
        const recommendedJobs = jobs.map(job => {
            const similarityScore = Math.round(cosineSimilarity(resumeVector, job.embedding) * 100);
            return { ...job._doc, similarityScore };
        }).sort((a, b) => b.similarityScore - a.similarityScore);

        return res.status(200).json({
            message: 'Recommended jobs fetched successfully.',
            recommendedJobs,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error fetching recommended jobs.', success: false });
    }
};
