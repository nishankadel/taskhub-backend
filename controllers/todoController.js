// create express controller
// Import here
const { isValidObjectId } = require("mongoose");
const Todo = require("../models/ToDo");
const User = require("../models/User");

// ddesc  - Create TODO
// @route  - POST /api/todos/create-todo
// @access - Private
exports.createTodo = async (req, res) => {
  const { id, todoTitle, todoDescription } = req.body;
  try {
    const user = await User.findById({ _id: id });
    if (isValidObjectId(id) === false) {
      return res.json({ success: false, message: "Invalid user id" });
    }
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const todo = await Todo.findOne({ userId: id });
    if (todo) {
      await Todo.findOneAndUpdate(
        { userId: id },
        { $push: { todos: { todoTitle, todoDescription } } },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Todo added successfully.",
      });
    } else {
      const newTodo = await new Todo({
        userId: id,
        todos: [
          {
            todoTitle,
            todoDescription,
          },
        ],
      });
      await newTodo.save();
      return res.json({
        success: true,
        message: "Todo added successfully.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Something went wrong." });
  }
};

// desc  - Get all TODOs
// @route  - GET /api/todos/get-todos/:id
// @access - Private
exports.getTodos = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findOne({ userId: id });
    if (!todo) {
      return res.json({ success: false, message: "No todos found." });
    } else {
      return res.json({ success: true, todo });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

// desc  - DELETE Todo
// @route  - POST /api/todos/delete-todo/:id
// @access - Private
exports.deleteTodo = async (req, res) => {
  const { id, userId, todoId } = req.body;
  try {
    const todo = await Todo.findOne({ userId });
    if (!todo) {
      return res.json({
        success: false,
        message: "Todo not found.",
      });
    } else {
      await Todo.updateOne(
        { _id: id },
        {
          $pull: {
            todos: {
              _id: todoId,
            },
          },
        },
        { new: true }
      );
      return res.json({
        success: true,
        message: "Todo deleted successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};

// desc  - Update Todo
// @route  - POST /api/todos/update-todo/:id
// @access - Private
exports.updateTodo = async (req, res) => {
  const { id, todoId, todoTitle, todoDescription } = req.body;
  try {
    const todo = await Todo.findOne({ _id: id });
    if (!todo) {
      return res.json({
        success: false,
        message: "Todo not found.",
      });
    } else {
      await Todo.updateOne(
        { _id: id, "todos._id": todoId },
        {
          $set: {
            "todos.$.todoTitle": todoTitle,
            "todos.$.todoDescription": todoDescription,
          },
        }
      );

      return res.json({
        success: true,
        message: "Todo updated successfully.",
      });
    }
  } catch (err) {
    res.json({ success: false, message: "Something went wrong." });
    console.log(err);
  }
};
