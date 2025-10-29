// generateJobs.js
import mongoose from "mongoose";
import { Job } from "./src/models/job.models.js";
import { pipeline } from "@xenova/transformers";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resumeAnalyzer";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB connection error:", err));

// Predefined random data
const jobTitles = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Scientist", "Machine Learning Engineer", "Mobile App Developer", "DevOps Engineer"];
const companies = ["Google", "Facebook", "Amazon", "Microsoft", "Netflix", "Airbnb", "Tesla"];
const locations = ["New York", "San Francisco", "London", "Berlin", "Tokyo", "Remote"];
const skillsList = ["JavaScript", "React", "Node.js", "Python", "Django", "MongoDB", "HTML", "CSS", "TypeScript", "Next.js"];
const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

// Cosine similarity (optional if needed later)
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dot / (magA * magB);
};

// Xenova embedder singleton
let embedder;
const initEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
};

// Helper to generate random job
const generateRandomJob = async () => {
  const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  const company = companies[Math.floor(Math.random() * companies.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const skillsRequired = [];
  const numSkills = Math.floor(Math.random() * 5) + 2; // 2-6 skills
  while (skillsRequired.length < numSkills) {
    const skill = skillsList[Math.floor(Math.random() * skillsList.length)];
    if (!skillsRequired.includes(skill)) skillsRequired.push(skill);
  }
  const description = `We are hiring a ${title} at ${company} in ${location}. Required skills: ${skillsRequired.join(", ")}.`;
  const salaryRange = `$${50_000 + Math.floor(Math.random() * 100_000)} - $${100_000 + Math.floor(Math.random() * 100_000)}`;
  const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];

  // Compute embedding
// Compute embedding
await initEmbedder();
const embeddingResult = await embedder(description);

// Convert Float32Array to regular number array
let embeddingArray;
if (Array.isArray(embeddingResult.data)) {
    embeddingArray = embeddingResult.data.flatMap(e => Array.from(e));
} else {
    embeddingArray = Array.from(embeddingResult.data);
}

return {
    title,
    company,
    location,
    description,
    skillsRequired,
    salaryRange,
    jobType,
    embedding: embeddingArray,
};

};

// Main function
const generateJobs = async (num = 1000) => {
  console.log(`Generating ${num} jobs...`);
  const jobs = [];
  for (let i = 0; i < num; i++) {
    const job = await generateRandomJob();
    jobs.push(job);
    if ((i + 1) % 50 === 0) console.log(`Generated ${i + 1} jobs`);
  }

  // Insert into DB
  await Job.insertMany(jobs);
  console.log(`Inserted ${jobs.length} jobs into MongoDB`);
  mongoose.disconnect();
};

generateJobs(1000);
