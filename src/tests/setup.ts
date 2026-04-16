import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// ── Must be set before any import that calls requireEnv() ────────────────────
process.env.JWT_SECRET = "test-jwt-secret";
process.env.MONGO_URI = "mongodb://localhost/test"; // overridden below

import User from "../models/User.Model";
import Employer from "../models/Employer.Model";
import Job from "../models/Job.Model";
import Application from "../models/Application.Model";
import {
  seedUsers,
  seedEmployers,
  buildSeedJobs,
  buildSeedApplications,
  hashPassword,
} from "./seed";

// ── Global type declarations ─────────────────────────────────────────────────
declare global {
  var seededUsers: any[];
  var seededEmployers: any[];
  var seededJobs: any[];
  var seededApplications: any[];
  var userToken: string;
  var adminToken: string;
  var employerToken: string;
}

let mongod: MongoMemoryServer;

beforeAll(async () => {
  jest.setTimeout(120000);
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  // Seed users (pre-hash so the model's pre-save hook doesn't double-hash)
  const users = await User.insertMany(
    await Promise.all(
      seedUsers.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
    )
  );
  global.seededUsers = users;

  // Seed employers
  const employers = await Employer.insertMany(
    await Promise.all(
      seedEmployers.map(async (e) => ({ ...e, password: await hashPassword(e.password) }))
    )
  );
  global.seededEmployers = employers;

  // Seed jobs
  const jobs = await Job.insertMany(
    buildSeedJobs(employers[0]._id as mongoose.Types.ObjectId)
  );
  global.seededJobs = jobs;

  // Seed applications
  global.seededApplications = await Application.insertMany(
    buildSeedApplications(
      jobs[0]._id as mongoose.Types.ObjectId,
      users[0]._id as mongoose.Types.ObjectId,
      employers[0]._id as mongoose.Types.ObjectId
    )
  );

  const secret = process.env.JWT_SECRET!;

  // Candidate token (alice — users[0])
  global.userToken = jwt.sign({ id: users[0]._id, role: "CANDIDATE" }, secret, { expiresIn: "1d" });

  // Admin token
  const admin = users.find((u) => u.role === "ADMIN")!;
  global.adminToken = jwt.sign({ id: admin._id, role: "ADMIN" }, secret, { expiresIn: "1d" });

  // Employer token — userType:"employer" is required by auth.Middleware.ts
  global.employerToken = jwt.sign(
    { id: employers[0]._id, role: "EMPLOYER", userType: "employer" },
    secret,
    { expiresIn: "1d" }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
