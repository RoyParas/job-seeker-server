import asyncHandler from "express-async-handler";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import mongoose from "mongoose";

export const getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = asyncHandler(async (req, res, next) => {
  const { role } = req.user; //From authorization.js
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not accessed to Post the Job", 400)
    );
  }
  const {
    title,
    description,
    company,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;
  if (
    !title ||
    !description ||
    !company ||
    !category ||
    !country ||
    !city ||
    !location
  ) {
    return next(new ErrorHandler("Please Enter the Mandatory Fields!", 400));
  }
  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please Enter either ranged Salary or Fixed Salary!",
        400
      )
    );
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler(
        "Cannot Enter ranged Salary and Fixed Salary Together!",
        400
      )
    );
  }
  if ((salaryFrom || salaryTo) && fixedSalary) {
    return next(
      new ErrorHandler(
        "Please Enter either ranged Salary or Fixed Salary!",
        400
      )
    );
  }
  const jobPostedBy = req.user._id;
  const job = await Job.create({
    title,
    company,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    jobPostedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully",
    job,
  });
});

export const getMyJobs = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker is not accessed to this Feature", 400)
    );
  }

  const jobs = await Job.find({ jobPostedBy: req.user._id });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not accessed to Post or Update the Job",
        400
      )
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job Not Found!", 404));
  }

  const isFixedSalaryInJob = "fixedSalary" in job;
  const isSalaryFromInJob = "salaryFrom" in job;
  const isSalaryToInJob = "salaryTo" in job;

  const isFixedSalaryInRequest = "fixedSalary" in req.body;
  const isSalaryFromInRequest = "salaryFrom" in req.body;
  const isSalaryToInRequest = "salaryTo" in req.body;

  let update;

  if (
    !isFixedSalaryInRequest &&
    !isSalaryFromInRequest &&
    !isSalaryToInRequest
  ) {
    update = {
      ...req.body,
    };
  } else if (
    isFixedSalaryInJob &&
    isSalaryFromInRequest &&
    isSalaryToInRequest
  ) {
    update = {
      $unset: { fixedSalary: 1 },
      salaryFrom: req.body.salaryFrom,
      salaryTo: req.body.salaryTo,
      ...req.body,
    };
  } else if (isSalaryFromInJob && isSalaryToInJob && isFixedSalaryInRequest) {
    update = {
      $unset: { salaryFrom: 1, salaryTo: 1 },
      fixedSalary: req.body.fixedSalary,
      ...req.body,
    };
  } else if (
    !(isFixedSalaryInJob && !(isSalaryFromInRequest || isSalaryToInRequest))
  ) {
    return next(new ErrorHandler("Invalid Salary Structure", 400));
  }

  const result = await Job.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    succes: true,
    message: "Job Updated Successfully!",
    job: result,
  });
});

export const deleteJob = asyncHandler(async (req, res, next) => {
  const { role } = req.user;

  if (role === "Job Seeker") {
    return next(
      new ErrorHandler(
        "Job Seeker is not accessed to Post or Delete the Job",
        400
      )
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job Not Found!", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    succes: true,
    message: "Job Deleted Successfully!",
    job,
  });
});

export const getSingleJob = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job Not Found!", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
