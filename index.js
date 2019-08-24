const express = require("express");

//server initialization
const server = express();
//accpets json requests
server.use(express.json());

//data
const projects = [];
let counter = 0;

//global middleware to track the amount of requests made
server.use((req, res, next) => {
  counter++;

  console.log(`Number of requests: ${counter}`);

  return next();
});

//local middleware to validate if project exists
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const index = projects.findIndex(project => project.id == id);

  if (index == -1) {
    return res.status(404).send();
  }

  //adds project information in request for easy access in the route
  req.project = projects[index];
  req.projectIndex = index;

  return next();
}

//local middleware to block creating a project with an existing id
function checkIdExists(req, res, next) {
  const { id } = req.body;

  const found = projects.find(project => project.id == id) || false;

  if (found) {
    return res.status(400).json({ error: `Id ${id} already in use` });
  }

  return next();
}

//local middleware to check if project data is valid before creating it
function checkProjectDataIsValid(req, res, next) {
  const { id, title } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id field is required" });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ error: "id must be a string value" });
  }

  if (isNaN(id)) {
    return res.status(400).json({ error: "id must be a numeric value" });
  }

  if (!title) {
    return res.status(400).json({ error: "title field is required" });
  }

  if (typeof title !== "string") {
    return res.status(400).json({ error: "title must be a string value" });
  }

  return next();
}

//creates a project
server.post("/projects", checkIdExists, checkProjectDataIsValid, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.status(201).send();
});

//lists all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//edit a project
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

//delete a project
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects.splice(req.projectIndex, 1);

  return res.send();
});

//create a task
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.status(201).send();
});

server.listen(3333);
