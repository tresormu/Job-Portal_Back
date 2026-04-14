import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Users ────────────────────────────────────────────────────────────────────
export const seedUsers = [
  { name: "Alice Johnson",   email: "alice@test.com",   contactPhone: "0700000001", password: "Password1!", role: "CANDIDATE" },
  { name: "Bob Smith",       email: "bob@test.com",     contactPhone: "0700000002", password: "Password2!", role: "CANDIDATE" },
  { name: "Carol White",     email: "carol@test.com",   contactPhone: "0700000003", password: "Password3!", role: "CANDIDATE" },
  { name: "David Brown",     email: "david@test.com",   contactPhone: "0700000004", password: "Password4!", role: "CANDIDATE" },
  { name: "Admin User",      email: "admin@test.com",   contactPhone: "0700000005", password: "AdminPass1!", role: "ADMIN" },
];

// ── Employers ────────────────────────────────────────────────────────────────
export const seedEmployers = [
  { companyName: "TechCorp",    email: "techcorp@test.com",    password: "Employer1!", phone: "0711000001", isVerified: true,  isActive: true },
  { companyName: "HealthPlus",  email: "healthplus@test.com",  password: "Employer2!", phone: "0711000002", isVerified: true,  isActive: true },
  { companyName: "EduWorld",    email: "eduworld@test.com",    password: "Employer3!", phone: "0711000003", isVerified: false, isActive: true },
  { companyName: "FinanceHub",  email: "financehub@test.com",  password: "Employer4!", phone: "0711000004", isVerified: true,  isActive: true },
  { companyName: "SuspendedCo", email: "suspended@test.com",   password: "Employer5!", phone: "0711000005", isVerified: false, isActive: false },
];

// ── Jobs (employerId injected at seed time) ──────────────────────────────────
export const buildSeedJobs = (employerId: mongoose.Types.ObjectId) => [
  {
    title: "Frontend Developer",   description: "Build UIs",          company: "TechCorp",
    requirements: ["React"],       responsibilities: ["Code"],         category: "Technology",
    jobType: "Full-time",          location: "Kigali",                 deadline: new Date(Date.now() + 30 * 86400000),
    employerId,                    isActive: true,
  },
  {
    title: "Backend Developer",    description: "Build APIs",          company: "TechCorp",
    requirements: ["Node.js"],     responsibilities: ["API design"],   category: "Technology",
    jobType: "Full-time",          location: "Remote",                 deadline: new Date(Date.now() + 30 * 86400000),
    employerId,                    isActive: true,
  },
  {
    title: "Data Analyst",         description: "Analyse data",        company: "FinanceHub",
    requirements: ["SQL"],         responsibilities: ["Reporting"],    category: "Finance",
    jobType: "Contract",           location: "Nairobi",                deadline: new Date(Date.now() + 30 * 86400000),
    employerId,                    isActive: true,
  },
  {
    title: "Nurse",                description: "Patient care",        company: "HealthPlus",
    requirements: ["Nursing degree"], responsibilities: ["Care"],      category: "Healthcare",
    jobType: "Full-time",          location: "Kampala",                deadline: new Date(Date.now() + 30 * 86400000),
    employerId,                    isActive: true,
  },
  {
    title: "Expired Job",          description: "Old listing",         company: "TechCorp",
    requirements: ["Any"],         responsibilities: ["Any"],          category: "Other",
    jobType: "Part-time",          location: "Remote",                 deadline: new Date(Date.now() - 86400000),
    employerId,                    isActive: false,
  },
];

// ── Applications (ids injected at seed time) ─────────────────────────────────
export const buildSeedApplications = (
  jobId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  employerId: mongoose.Types.ObjectId
) => [
  { jobId, userId, employerId, name: "Alice Johnson", email: "alice@test.com", resume: "resume1.pdf", status: "PENDING" },
  { jobId, userId, employerId, name: "Bob Smith",     email: "bob@test.com",   resume: "resume2.pdf", status: "REVIEWED" },
  { jobId, userId, employerId, name: "Carol White",   email: "carol@test.com", resume: "resume3.pdf", status: "SHORTLISTED" },
  { jobId, userId, employerId, name: "David Brown",   email: "david@test.com", resume: "resume4.pdf", status: "REJECTED" },
  { jobId, userId, employerId, name: "Admin User",    email: "admin@test.com", resume: "resume5.pdf", status: "HIRED" },
];

// ── Hash helper ───────────────────────────────────────────────────────────────
export const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);
