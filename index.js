const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB connection
const uri = "mongodb+srv://aman:1234@aman.j2hwf4m.mongodb.net/todoapp?retryWrites=true&w=majority&appName=aman";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Define the Todo model
const Todo = mongoose.model('Todo', new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
}));

// Routes
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.send(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });
  await todo.save();
  res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.send({ message: 'Todo deleted' });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
