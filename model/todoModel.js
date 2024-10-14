const mongoose = require("mongoose");

// Define the todo schema
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
  },
});
// Create the Todo model
const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
