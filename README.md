# Challenge #1 from Rocketseats' bootcamp

Instructions: https://github.com/Rocketseat/bootcamp-gostack-desafio-01/blob/master/README.md#desafio-01-conceitos-do-nodejs.

Create an application from scratch using Express.

The application will be used to store projects and its tasks.

It must make use of middlewares and validate the request data.

# Routes

## POST /projects

request body:

```
{
  "id": "1",
  "title": "Project title"
}
```

## GET /projects

## PUT /projects/:id

request body:

```
{
  "title": "New project title"
}
```

## DELETE /projects/:id

## POST /projects/:id/tasks

request body:

```
{
  "title": "Task title"
}
```
