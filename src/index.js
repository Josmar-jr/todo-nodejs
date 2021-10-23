const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.userName === username);

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

function checksExistsTodoUserAccount(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);
  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (!todo && todoIndex === -1) {
    return response.status(404).json({ error: "Todo not found!!" });
  }

  request.todo = todo;
  request.todoIndex = todoIndex;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, userName } = request.body;

  const userAlreadyExists = users.some((user) => user.name === name);

  if (userAlreadyExists) {
    return response.status(404).json({ error: "User already exists" });
  }

  users.push({
    id: uuidv4(),
    name,
    userName,
    todos: [],
  });

  return response.status(201).json(users);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  return response.json(user);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).send();
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const foundTodo = user.todos.find((todo) => todo.id === id);

  if (!foundTodo) {
    return response.status(400).json({ error: "Todo not found" });
  }

  foundTodo.title = title;
  foundTodo.deadline = new Date(deadline);

  return response.json(foundTodo);
});

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checksExistsTodoUserAccount,
  (request, response) => {
    // Complete aqui
    const { todo } = request;
    todo.done = true;
    return response.send();
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checksExistsTodoUserAccount,
  (request, response) => {
    // Complete aqui
    const { todoIndex, user } = request;

    user.todos.splice(todoIndex, 1);
    return response.status(204).send();
  }
);

module.exports = app;
