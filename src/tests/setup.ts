import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.Model";
import Employer from "../models/Employer.Model";
import Job from "../models/Job.Model";
import Application from "../models/Application.Model";
import { seedUsers, seedEmployers, buildSeedJobs, buildSeedApplications, hashPassword } from "./seed";

dotenv.config();

const TEST_DB = process.env.MONGO_URI!.replace(/\/[^/?]+(\?|$)/, "/job_portal_test$1");

// Globals exposed to all test files
declare global {
  var seededUsers: any[];
  var seededEmployers: any[];
  var seededJobs: any[];
  var seededApplications: any[];
  var userToken: string;
  var adminToken: string;
  var employerToken: string;
}

beforeAll(async () => {
  await mongoose.connect(TEST_DB);

  // Clean slate
  await Promise.all([
    User.deleteMany({}),
    Employer.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);

  // Seed Users (hash passwords manually — pre-save hook runs on .save(), not .insertMany())
  const usersWithHashed = await Promise.all(
    seedUsers.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
  );
  const users = await User.insertMany(usersWithHashed);
  global.seededUsers = users;

  // Seed Employers
  const employersWithHashed = await Promise.all(
    seedEmployers.map(async (e) => ({ ...e, password: await hashPassword(e.password) }))
  );
  const employers = await Employer.insertMany(employersWithHashed);
  global.seededEmployers = employers;

  // Seed Jobs (use first verified employer)
  const jobs = await Job.insertMany(buildSeedJobs(employers[0]._id));
  global.seededJobs = jobs;

  // Seed Applications (active job + first user + first employer)
  const activeJob = jobs.find((j) => j.isActive)!;
  const applications = await Application.insertMany(
    buildSeedApplications(activeJob._id, users[0]._id, employers[0]._id)
  );
  global.seededApplications = applications;

  // JWT tokens
  const secret = process.env.JWT_SECRET!;
  global.userToken     = jwt.sign({ id: String(users[0]._id),     userType: "user"     }, secret, { expiresIn: "1d" });
  global.adminToken    = jwt.sign({ id: String(users[4]._id),     userType: "user"     }, secret, { expiresIn: "1d" });
  global.employerToken = jwt.sign({ id: String(employers[0]._id), userType: "employer" }, secret, { expiresIn: "1d" });
});

afterAll(async () => {
  await Promise.all([
    User.deleteMany({}),
    Employer.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);
  await mongoose.disconnect();
});
