const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
  // write schemas here

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  collaborator: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  projectTitle: {
    type: String,
  },
  projectDescription: {
    type: String,
  },
  projectTask: [
    {
      taskName: {
        type: String,
      },
      taskStatus: {
        type: String,
        default: "To-Do",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
