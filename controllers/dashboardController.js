// create express controller
// Import here
const Project = require("../models/Project");

// @desc   - List all project
// @route  - get /api/projects/all-projects
// @access - Private
exports.dashboard = async (req, res) => {
  const { id } = req.body;
  try {
    const projects = await Project.find({
      $or: [
        { userId: id },
        {
          collaborator: { $elemMatch: { userId: id } },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const totalProject = await Project.find({
      $or: [
        { userId: id },
        {
          collaborator: { $elemMatch: { userId: id } },
        },
      ],
    });

    const collaborationProjects = await Project.find({
      collaborator: { $elemMatch: { userId: id } },
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const collaborationProject = await Project.find({
      collaborator: { $elemMatch: { userId: id } },
    });

    const yourProjects = await Project.find({
      userId: id,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    const yourProject = await Project.find({
      userId: id,
    });

    return res.json({
      success: true,
      projects,
      collaborationProjects: collaborationProjects,
      yourProjects: yourProjects,
      totalProject: totalProject.length,
      yourProject: yourProject.length,
      collaborationProject: collaborationProject.length,
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
