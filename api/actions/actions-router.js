// Write your "actions" router here!
const express = require("express");
const actionsDB = require("./actions-model");
const router = express.Router();
const { checkActionID, checkActionBody } = require("../middleware/middleware");

router.get("/", (req, res) => {
  actionsDB
    .get()
    .then((actions) => res.status(200).send(actions))
    .catch((error) =>
      res
        .status(500)
        .json({ message: "Server failed in getting the projects.", error })
    );
});

router.get("/:id", checkActionID, (req, res) => {
  res.status(200).send(req.action);
});

router.post("/", checkActionBody, (req, res, next) => {
  const action = req.action;
  actionsDB
    .insert(action)
    .then((newAction) => res.status(201).send(newAction))
    .catch((err) => next(err));
});

router.put("/:id", checkActionID, checkActionBody, (req, res, next) => {
  const changes = req.body;
  const { id } = req.params;
  actionsDB
    .update(id, changes)
    .then((updatedAction) => res.status(200).send(updatedAction))
    .catch((err) => next(err));
});

router.delete("/:id", checkActionID, (req, res, next) => {
  const { id } = req.params;
  actionsDB
    .remove(id)
    .then((count) => {
      if (count === 1) res.sendStatus(204);
      else res.status(500).send("Could not delete resource.");
    })
    .catch((err) => next(err));
});

module.exports = router;
