// create express controller
// Import here
const Project = require("../models/Project");

// @desc   - List all project
// @route  - get /api/projects/all-projects
// @access - Private
exports.dashboard = async (req, res) => {
  const { id } = req.body;
  try {
    const projects = await Project.find({ userId: id })
      .sort({ createdAt: -1 })
      .limit(3);
    const totalProject = await Project.find({ userId: id });

    res.json({
      success: true,
      projects,
      totalProject: totalProject.length,
    });
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
