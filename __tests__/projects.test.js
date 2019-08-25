const request = require("supertest");
const app = require("../app");
const server = app.server;

async function createProject(id, title) {
  return request(server)
    .post("/projects")
    .send({
      id: id.toString(),
      title
    });
}

async function getProjects() {
  const response = await request(server).get("/projects");
  return response.body;
}

beforeAll(() => {
  app.setTesting(true);
});

beforeEach(() => {
  app.clear();
});

describe("Projects", () => {
  it("should create a project", async () => {
    const response = await createProject(1, "Test title 22");

    expect(response.status).toBe(201);
  });

  it("should list created projects", async () => {
    await createProject(2, "Test title");

    const response = await request(server).get("/projects");

    expect(response.body).toEqual([
      {
        id: "2",
        title: "Test title",
        tasks: []
      }
    ]);
  });

  it("should edit project and list its changes accordingly", async () => {
    await createProject(3, "Test title");

    const response = await request(server)
      .put("/projects/3")
      .send({
        title: "New test title"
      });

    expect(response.status).toBe(200);

    const projects = await getProjects();

    expect(projects[0].title).toBe("New test title");
  });

  it("should delete project and not show it in the listing", async () => {
    await createProject(5, "Test title");

    const response = await request(server).delete("/projects/5");

    expect(response.status).toBe(200);

    const projects = await getProjects();

    expect(projects.length).toBe(0);
  });

  it("should create a task for a project", async () => {
    await createProject(8, "Test title");

    const response = await request(server)
      .post("/projects/8/tasks")
      .send({ title: "Task title" });

    expect(response.status).toBe(201);

    const projects = await getProjects();

    expect(projects[0].tasks[0]).toBe("Task title");
  });
});
