const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createTodo, updateTodo } = require("./type");
const Todo = require("./model/todoModel");
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017/todo");
  console.log("Mongoose Connected");
};
dbConnect();

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json({ msg: "Todo Listed", todos: todos });
  } catch (err) {
    res.json({ msg: "Something went wrong" });
  }
});

// send data tomongodb
app.post("/todo", async (req, res) => {
  const createPaylod = req.body;
  const parsedPayload = createTodo.safeParse(createPaylod);
  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "you sent a wromg input",
    });
  }
  const createdTodo = await Todo.create({
    title: createPaylod.title,
    description: createPaylod.description,
    completed: false,
  });
  // put in mongodb
  res.send({ message: "Done", todo: createdTodo });
});

app.put("/completed", async (req, res) => {
  const updatePayload = req.body;
  const parsedPayload = updateTodo.safeParse(updatePayload);
  if (!parsedPayload.success) {
    res.status(411).json({
      msg: "you sent a wrong input",
    });
    return;
  }
  try {
    await Todo.updateOne({ _id: req.body.id }, { completed: true });

    res.json({ msg: "todo completed" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "something went wrong" });
  }
});

// delete
app.delete("/delete/:id", async (req, res) => {
  const deletePayload = req.params.id;

  // No need for updateTodo.safeParse here, as we're just deleting by ID.
  // If you want to validate the ID, you can use a custom schema.

  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ msg: "Todo deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`server is started at http://localhsot:${port}`);
});
