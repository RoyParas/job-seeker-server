import express from "express";
import {
  getAllJobs,
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getSingleJob,
} from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/authorization.js";

const router = express.Router();
router.get("/getAllJobs", getAllJobs);
router.get("/getMyJobs",isAuthorized,getMyJobs);
router.get("/:id",isAuthorized,getSingleJob);
router.post("/postJob", isAuthorized, postJob);
router.put("/update/:id", isAuthorized, updateJob);
router.delete("/delete/:id", isAuthorized, deleteJob);

export default router;
