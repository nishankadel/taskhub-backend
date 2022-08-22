// create express controller
// Import here
const Project = require("../models/Project");
const ProjectLog = require("../models/ProjectLog");
const User = require("../models/User");

// @desc   - Create new project
// @route  - PUT /api/projects/create-project
// @access - Private
exports.createProject = async (req, res) => {
  const { id, projectTitle, projectDescription } = req.body;
  try {
    const project = new Project({
      userId: id,
      projectTitle,
      projectDescription,
    });

    const user = await User.findOne({ _id: id });

    const createProjectLog = new ProjectLog({
      projectId: project._id,
      logs: [
        {
          log: `${user.fullName} created a new project ${project.projectTitle}`,
        },
      ],
    });

    await project.save();
    await createProjectLog.save();
    res.json({
      success: true,
      message: "Project created successfully.",
    });
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
    const projects = await Project.find({
      $or: [
        { userId: id },
        {
          collaborator: { $elemMatch: { userId: id } },
        },
      ],
    }).sort({ createdAt: -1 });
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
      await ProjectLog.deleteOne({ projectId: id });
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
      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} update the project ${project.projectTitle}: project title to ${projectTitle} and project description to ${projectDescription}`,
            },
          },
        },
        { new: true }
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

      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} added a new task ${taskName} to the project ${project.projectTitle}`,
            },
          },
        },
        { new: true }
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
      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} delete the task ${taskId} from the project ${project.projectTitle}`,
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
      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} update the task ${taskId} from the project ${project.projectTitle} to ${taskName}`,
            },
          },
        },
        { new: true }
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
      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} update the project status of the task ${taskId} from the project ${project.projectTitle} to ${taskStatus}`,
            },
          },
        },
        { new: true }
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

// @desc   - Add Task
// @route  - post /api/projects/add-task
// @access - Private
exports.addCollaborator = async (req, res) => {
  const { email, id } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    const user = await User.findOne({ email: email });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    } else {
      const existingCollaborator = await Project.findOne({
        _id: id,
        collaborator: { $elemMatch: { userId: user._id } },
      });
      if (existingCollaborator) {
        return res.json({
          success: false,
          message: "User already added as collaborator.",
        });
      }
      await Project.updateOne(
        { _id: id },
        {
          $push: {
            collaborator: {
              userId: user._id,
            },
          },
        }
      );
      const projectUser = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${projectUser.fullName} added ${email} as a collaborator to the project ${project.projectTitle}`,
            },
          },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Collaborator added successfully..",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - Delete Colllaborator
// @route  - post /api/projects/delete-collaborator
// @access - Private
exports.deleteCollaborator = async (req, res) => {
  const { email, id } = req.body;
  try {
    const project = await Project.findOne({ _id: id });
    const user = await User.findOne({ email: email });

    if (!project) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    }
    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    } else {
      await Project.updateOne(
        { _id: id },
        {
          $pull: {
            collaborator: {
              userId: user._id,
            },
          },
        }
      );
      const user = await User.findOne({ _id: project.userId });
      await ProjectLog.findOneAndUpdate(
        { projectId: id },
        {
          $push: {
            logs: {
              log: `${user.fullName} removed ${email} as a collaborator to the project ${project.projectTitle}`,
            },
          },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Collaborator deleted successfully..",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// @desc   - List Collaborators
// @route  - post /api/projects/list-collaborators`
// @access - Private
exports.listCollaborators = async (req, res) => {
  const { id } = req.params;
  try {
    const collaborator = await Project.findOne({ _id: id }).populate({
      path: "collaborator.userId",
      model: "User",
      select: "_id fullName email",
    });
    if (collaborator) {
      res.json({ success: true, collaborators: collaborator.collaborator });
    } else {
      res.json({ success: false, message: "No collaborator found." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// @desc   - Generate Project Report
// @route  - post /api/projects/report
// @access - Private
exports.getReport = async (req, res) => {
  const { id } = req.params;
  try {
    const projectReport = await ProjectLog.findOne({ projectId: id }).populate({
      path: "projectId",
      model: "Project",
      select: "projectTitle projectDescription",
    });
    if (!projectReport) {
      return res.json({
        success: false,
        message: "Project not found.",
      });
    } else {
      return res.json({ success: true, report: projectReport });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong.",
    });
  }
};
