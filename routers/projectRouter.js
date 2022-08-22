// create express route
const express = require("express");
const {
  createProject,
  listProject,
  singleProject,
  deleteProject,
  updateProject,
  addTask,
  deleteTask,
  updateTask,
  changeTaskStatus,
  addCollaborator,
  deleteCollaborator,
  listCollaborators,
  getReport,
} = require("../controllers/projectController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-project", checkUser, createProject);
router.post("/add-collaborator", checkUser, addCollaborator);
router.post("/delete-collaborator", checkUser, deleteCollaborator);
router.get("/list-collaborators/:id", checkUser, listCollaborators);
router.get("/all-projects/:id", checkUser, listProject);
router.get("/single-project/:id", checkUser, singleProject);
router.post("/delete-project", checkUser, deleteProject);
router.post("/update-project", checkUser, updateProject);
router.post("/add-task", checkUser, addTask);
router.post("/delete-task", checkUser, deleteTask);
router.post("/update-task", checkUser, updateTask);
router.post("/change-task-status", checkUser, changeTaskStatus);
router.get("/report/:id", checkUser, getReport);

module.exports = router;
