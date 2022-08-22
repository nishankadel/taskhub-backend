const mongoose = require("mongoose");

const ProjectLogSchema = mongoose.Schema({
  // write schemas here
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  logs: [
    {
      log: {
        type: String,
      },
      reportedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectLog = mongoose.model("ProjectLog", ProjectLogSchema);

module.exports = ProjectLog;
