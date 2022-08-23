// create express route
const express = require("express");
const {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} = require("../controllers/todoController");
const { checkUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-todo", checkUser, createTodo);
router.get("/list-todos/:id", checkUser, getTodos);
router.post("/delete-todo", checkUser, deleteTodo);
router.post("/update-todo", checkUser, updateTodo);

module.exports = router;
