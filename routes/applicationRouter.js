import express from "express";
import {
  getEmployerAllApplication,
  getJobSeekerAllApplication,
  deleteApplication,
  postApplication
} from "../controllers/applicationController.js";
import { isAuthorized } from "../middlewares/authorization.js";

const router = express.Router();
router.get("/employer/allApplications",isAuthorized, getEmployerAllApplication);
router.get("/jobSeeker/allApplications",isAuthorized, getJobSeekerAllApplication);
router.delete("/delete/:id",isAuthorized, deleteApplication);
router.post("/postApplication",isAuthorized,postApplication);

export default router;
