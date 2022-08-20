// create express controller
// Import here
const Project = require("../models/Project");

// @desc   - Create new project
// @route  - PUT /api/projects/create-project
// @access - Private
exports.createProject = async (req, res) => {
  const { id, projectTitle, projectDescription } = req.body;
  try {
    const existingProject = await Project.findOne({ projectTitle });
    if (existingProject) {
      return res.json({
        success: false,
        message: "Project already exists.",
      });
    } else {
      const project = new Project({
        userId: id,
        projectTitle,
        projectDescription,
      });
      await project.save();
      res.json({
        success: true,
        message: "Project created successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - List all project
// @route  - get /api/projects/all-projects
// @access - Private
exports.listProject = async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await Project.find({ userId: id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      projects,
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - List single project
// @route  - get /api/projects/single-project
// @access - Private
exports.singleProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      return res.json({
        success: true,
        project,
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Delete project
// @route  - post /api/projects/delete-project
// @access - Private
exports.deleteProject = async (req, res) => {
  const { id } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.deleteOne({ _id: id });
      return res.json({
        success: true,
        message: "Project deleted successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Update project
// @route  - post /api/projects/update-project
// @access - Private
exports.updateProject = async (req, res) => {
  const { id, projectTitle, projectDescription } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id },
        {
          projectTitle,
          projectDescription,
        }
      );
      return res.json({
        success: true,
        message: "Project updated successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Add Task
// @route  - post /api/projects/add-task
// @access - Private
exports.addTask = async (req, res) => {
  const { id, taskName } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id },
        {
          $push: {
            projectTask: {
              taskName,
            },
          },
        }
      );
      return res.json({
        success: true,
        message: "Task added successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Delete Task
// @route  - post /api/projects/delete-task
// @access - Private
exports.deleteTask = async (req, res) => {
  const { id, taskId } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id },
        {
          $pull: {
            projectTask: {
              _id: taskId,
            },
          },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Task deleted successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Update Task
// @route  - post /api/projects/update-task
// @access - Private
exports.updateTask = async (req, res) => {
  const { id, taskId, taskName } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id, "projectTask._id": taskId },
        {
          $set: {
            "projectTask.$.taskName": taskName,
          },
        }
      );
      return res.json({
        success: true,
        message: "Task updated successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Update Task status
// @route  - post /api/projects/change-task-status
// @access - Private
exports.changeTaskStatus = async (req, res) => {
  const { id, taskId, taskStatus } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id, "projectTask._id": taskId },
        {
          $set: {
            "projectTask.$.taskStatus": taskStatus,
          },
        }
      );
      return res.json({
        success: true,
        message: "Task status updated successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
