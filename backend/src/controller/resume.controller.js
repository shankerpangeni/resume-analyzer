import { PDFParse } from 'pdf-parse';
import { Resume } from './../models/resume.models.js';
import { Job } from './../models/job.models.js';
import { pipeline } from '@xenova/transformers';
import fs from 'fs';

let embedder = null;
const SKILLS_LIST = ['JavaScript','React','Node.js','Python','Django','MongoDB','HTML','CSS'];

// Cosine similarity function
const cosineSimilarity = (vecA, vecB) => {
  const minLen = Math.min(vecA.length, vecB.length);
  const a = vecA.slice(0, minLen);
  const b = vecB.slice(0, minLen);
  const dot = a.reduce((sum,val,i)=>sum+val*b[i],0);
  const magA = Math.sqrt(a.reduce((sum,val)=>sum+val*val,0));
  const magB = Math.sqrt(b.reduce((sum,val)=>sum+val*val,0));
  return magA && magB ? dot/(magA*magB) : 0;
};

// Flatten embedding
const cleanEmbedding = (embed) => {
  if (!embed) return [];
  if (Array.isArray(embed[0])) return embed.flat();
  if (Array.isArray(embed)) return embed;
  return Array.from(embed);
};

// Initialize embedder
const initEmbedder = async () => {
  if (!embedder) embedder = await pipeline('feature-extraction','Xenova/all-MiniLM-L6-v2');
};

export const uploadResume = async (req,res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'PDF required', success:false });

    // Parse PDF from buffer or file path
    const dataBuffer = req.file.buffer || fs.readFileSync(req.file.path);
    const parser = new PDFParse({ data: dataBuffer });
    const { text } = await parser.getText();

    // Extract skills, experience, education
    const skills = SKILLS_LIST.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));
    const experience = (text.match(/(\d+)\s+years?/i)?.[1]) || 0;
    let education = '';
    if (/bachelor/i.test(text)) education='Bachelors';
    else if (/master/i.test(text)) education='Masters';
    else if (/ph\.d|phd/i.test(text)) education='PhD';

    // Get embedding
    await initEmbedder();
    const embeddingResult = await embedder(text, { pooling:'mean', normalize:true });
    const embedding = cleanEmbedding(embeddingResult);

    // Save resume
    const resume = await Resume.create({
      user: req.id,
      filename: req.file.originalname,
      skills,
      experience,
      education,
      fullText: text,
      embedding
    });

    // Fetch jobs (limit for memory)
    const jobs = await Job.find({ embedding: { $exists:true, $ne:[] } }).limit(100);
    const recommendations = jobs.map(job=>{
      const jobVec = cleanEmbedding(job.embedding);
      const similarity = cosineSimilarity(embedding, jobVec);
      return { jobId: job._id, similarityScore: Math.round(similarity*100) };
    }).sort((a,b)=>b.similarityScore - a.similarityScore).slice(0,6);

    // Save recommendations
    resume.recommendedJobs = recommendations.map(r=>({ job: r.jobId, similarityScore: r.similarityScore }));
    await resume.save();

    // Populate jobs for frontend
    const populated = await Resume.findById(resume._id).populate('recommendedJobs.job');
    const recommendedJobs = populated.recommendedJobs.map(r => ({ ...r.job.toObject(), similarityScore: r.similarityScore }));

    return res.status(201).json({
      success:true,
      message:'Resume processed',
      resume,
      recommendedJobs
    });

  } catch(err){
    console.error('Resume upload error', err);
    return res.status(500).json({ success:false, message:'Server error' });
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

