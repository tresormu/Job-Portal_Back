import mongoose from "mongoose";
import config from "./config/env.config";
import User from "./models/User.Model";
import Employer from "./models/Employer.Model";
import Job from "./models/Job.Model";
import Application from "./models/Application.Model";
import {
  seedUsers,
  seedEmployers,
  buildSeedJobs,
  buildSeedApplications,
  hashPassword,
} from "./seedData";

const cleanup = async () => {
  await Promise.all([
    User.deleteMany({}),
    Employer.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);
};

const main = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to database:", config.mongoUri);

    await cleanup();
    console.log("Cleared existing seed collections.");

    const users = await User.insertMany(
      await Promise.all(
        seedUsers.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
      )
    );
    console.log(`Seeded ${users.length} users.`);

    const employers = await Employer.insertMany(
      await Promise.all(
        seedEmployers.map(async (e) => ({ ...e, password: await hashPassword(e.password) }))
      )
    );
    console.log(`Seeded ${employers.length} employers.`);

    const jobs = await Job.insertMany(buildSeedJobs(employers[0]._id as mongoose.Types.ObjectId));
    console.log(`Seeded ${jobs.length} jobs.`);

    const applications = await Application.insertMany(
      buildSeedApplications(jobs, users, employers)
    );
    console.log(`Seeded ${applications.length} applications.`);

    console.log("Database seeding complete.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

main();
