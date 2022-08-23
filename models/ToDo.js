const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  // write schemas here
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  todos: [
    {
      todoTitle: {
        type: String,
      },
      todoDescription: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
