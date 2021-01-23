// Write your "projects" router here!
const express = require("express");
const projectsDB = require("./projects-model");
const router = express.Router();
const {
  checkProjectID,
  checkProjectBody,
} = require("../middleware/middleware");

router.get("/", (req, res) => {
  projectsDB
    .get()
    .then((projects) => res.status(200).send(projects))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Server failed in getting the projects.", error })
    );
});

router.get("/:id", checkProjectID, (req, res) => {
  res.status(200).send(req.project);
});

router.post("/", checkProjectBody, (req, res, next) => {
  const project = req.project;
  projectsDB
    .insert(project)
    .then((newProject) => res.status(201).send(newProject))
    .catch((err) => next(err));
});

router.put("/:id", checkProjectID, checkProjectBody, (req, res, next) => {
  const changes = req.body;
  const { id } = req.params;
  projectsDB
    .update(id, changes)
    .then((updatedProject) => res.status(200).send(updatedProject))
    .catch((err) => next(err));
});

router.delete("/:id", checkProjectID, (req, res, next) => {
  const { id } = req.params;
  projectsDB
    .remove(id)
    .then((count) => {
      if (count === 1) res.sendStatus(204);
      else res.status(500).send("Could not delete resource.");
    })
    .catch((err) => next(err));
});

router.get("/:id/actions", checkProjectID, (req, res, next) => {
  const { id } = req.params;
  projectsDB
    .getProjectActions(id)
    .then((actions) => {
      res.status(200).send(actions);
    })
    .catch((err) => next(err));
});

module.exports = router;
