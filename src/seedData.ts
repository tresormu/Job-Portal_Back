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
    title: "Frontend Developer",
    description: "Build responsive web applications using modern JS frameworks.",
    company: "TechCorp",
    requirements: ["React", "CSS", "HTML"],
    responsibilities: ["Develop UI components", "Collaborate with designers"],
    category: "Technology",
    jobType: "Full-time",
    location: "Kigali",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Backend Developer",
    description: "Build scalable REST APIs and microservices.",
    company: "TechCorp",
    requirements: ["Node.js", "Express", "MongoDB"],
    responsibilities: ["Design APIs", "Optimize database queries"],
    category: "Technology",
    jobType: "Full-time",
    location: "Remote",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Data Analyst",
    description: "Analyze business data and generate reports.",
    company: "FinanceHub",
    requirements: ["SQL", "Excel", "Power BI"],
    responsibilities: ["Create dashboards", "Support decision-making"],
    category: "Finance",
    jobType: "Contract",
    location: "Nairobi",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Nurse",
    description: "Provide patient care and medical support in clinical settings.",
    company: "HealthPlus",
    requirements: ["Nursing degree", "Compassion"],
    responsibilities: ["Monitor patients", "Administer medication"],
    category: "Healthcare",
    jobType: "Full-time",
    location: "Kampala",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Marketing Specialist",
    description: "Plan and execute digital marketing campaigns.",
    company: "HealthPlus",
    requirements: ["SEO", "Social media", "Copywriting"],
    responsibilities: ["Run campaigns", "Analyze engagement"],
    category: "Marketing",
    jobType: "Part-time",
    location: "Kigali",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Sales Executive",
    description: "Drive new business and manage client relationships.",
    company: "FinanceHub",
    requirements: ["Communication", "Negotiation"],
    responsibilities: ["Close deals", "Generate leads"],
    category: "Sales",
    jobType: "Full-time",
    location: "Kampala",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Mechanical Engineer",
    description: "Design and improve mechanical systems and products.",
    company: "TechCorp",
    requirements: ["CAD", "Problem solving"],
    responsibilities: ["Prototype components", "Perform tests"],
    category: "Engineering",
    jobType: "Contract",
    location: "Nairobi",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Curriculum Developer",
    description: "Create learning materials and educational programmes.",
    company: "EduWorld",
    requirements: ["Instructional design", "Writing"],
    responsibilities: ["Develop courses", "Review content"],
    category: "Education",
    jobType: "Internship",
    location: "Kigali",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Customer Success Manager",
    description: "Ensure clients achieve value from the product.",
    company: "TechCorp",
    requirements: ["Customer service", "Relationship management"],
    responsibilities: ["Onboard customers", "Handle feedback"],
    category: "Other",
    jobType: "Remote",
    location: "Remote",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
  {
    title: "Product Designer",
    description: "Design user-centered digital products and experiences.",
    company: "TechCorp",
    requirements: ["Figma", "UX research"],
    responsibilities: ["Create wireframes", "Run usability tests"],
    category: "Technology",
    jobType: "Part-time",
    location: "Kigali",
    deadline: new Date(Date.now() + 30 * 86400000),
    employerId,
    isActive: true,
  },
];

// ── Applications (ids injected at seed time) ─────────────────────────────────
export const buildSeedApplications = (
  jobs: any[],
  users: any[],
  employers: any[]
) => [
  { 
    jobId: jobs[0]._id, 
    userId: users[0]._id, 
    employerId: employers[0]._id, 
    name: users[0].name, 
    email: users[0].email, 
    resume: "resume1.pdf", 
    status: "PENDING" 
  },
  { 
    jobId: jobs[1]._id, 
    userId: users[1]._id, 
    employerId: employers[0]._id, 
    name: users[1].name, 
    email: users[1].email, 
    resume: "resume2.pdf", 
    status: "REVIEWED" 
  },
  { 
    jobId: jobs[2]._id, 
    userId: users[2]._id, 
    employerId: employers[1]._id, 
    name: users[2].name, 
    email: users[2].email, 
    resume: "resume3.pdf", 
    status: "SHORTLISTED" 
  },
  { 
    jobId: jobs[0]._id, 
    userId: users[3]._id, 
    employerId: employers[0]._id, 
    name: users[3].name, 
    email: users[3].email, 
    resume: "resume4.pdf", 
    status: "REJECTED" 
  },
  { 
    jobId: jobs[3]._id, 
    userId: users[4]._id, 
    employerId: employers[2]._id, 
    name: users[4].name, 
    email: users[4].email, 
    resume: "resume5.pdf", 
    status: "HIRED" 
  },
];

// ── Hash helper ─────────────────────────────────────────────────────────────
export const hashPassword = async (plain: string) => bcrypt.hash(plain, 10);
