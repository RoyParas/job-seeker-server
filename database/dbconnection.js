import mongoose from "mongoose";

export const dbconnection = async () => {
  await mongoose
    .connect(process.env.Mongo_uri, {
      dbName: "job_seeker",
    })
    .then(() => {
      console.log("Database Connected.");
    })
    .catch((err) => {
      console.log(`The error occurred is: ${err}`);
    });
};
