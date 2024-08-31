import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Provide Job Title"],
  },
  company:{
    type: String,
    required: [true, "Please Provide Company Name"],
  },
  description: {
    type: String,
    required: [true, "Please Porvied the Description of Job!"],
  },
  category: {
    type: String,
    required: [true, "Please Porvied the Job Category!"],
  },
  country: {
    type: String,
    required: [true, "Please Porvied the Country where the Job is located!"],
  },
  city: {
    type: String,
    required: [true, "Please Porvied the Job City!"],
  },
  location: {
    type: String,
    required: [true, "Please Porvied the Exact Location of Job!"],
  },
  fixedSalary: {
    type: Number,
    min: [5000, "Salary must be atleast 5000"],
    max: [9999999, "Salary cannot exceed 9999999 on this website"],
  },
  salaryFrom: {
    type: Number,
    min: [5000, "Salary From must be atleast 5000"],
    max: [9999999, "Salary From cannot exceed 9999999 on this website"],
  },
  salaryTo: {
    type: Number,
    min: [5000, "Salary To must be atleast 5000"],
    max: [9999999, "Salary To cannot exceed 9999999 on this website"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now(),
  },
  jobPostedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
