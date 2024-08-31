import AsyncHandler from "express-async-handler";
import ErrorHandler from "../middlewares/errorHandler.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../models/jobSchema.js";

export const getEmployerAllApplication = AsyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler(
          "You are not authorized to access all the applications!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const getJobSeekerAllApplication = AsyncHandler(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "You are not authorized to access all the applications!",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const deleteApplication = AsyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("You are not accessed to delete the Application")
    );
  }
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return next(new ErrorHandler("Application Not Found!", 404));
  }
  await Application.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: "Application Deleted Successfully",
    application,
  });
});

export const postApplication = AsyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("You are not accessed to post the Application", 400)
    );
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("Resume File required to post the Application", 400)
    );
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler(
        "Invalid file type. Please upload your resume in .png/.jpg/.jpeg/.webp format",
        400
      )
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error: ",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
  }

  const { name, email, coverLetter, jobId } = req.body;
  const applicantId = {
    user: req.user._id,
    role: "Job Seeker",
  };

  if (!jobId) {
    return next(new ErrorHandler("JobId not Found!", 404));
  }
  
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("JobId not Found!", 404));
  }

  const employerId = {
    user: jobDetails.jobPostedBy,
    role: "Employer",
  };

  if ((!name || !email || !coverLetter || !resume || !applicantId || !employerId)) {
    return next(new ErrorHandler("Please fill all the fields"));
  }

  const application = await Application.create({
    name,
    email,
    coverLetter,
    applicantId,
    employerId,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  res.status(200).json({
    success: true,
    message: "Application Posted Successfully",
    application,
  });
});