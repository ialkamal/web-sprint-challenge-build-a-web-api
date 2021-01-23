const projectsDB = require("../projects/projects-model");
const actionsDB = require("../actions/actions-model");

function checkProjectID(req, res, next) {
  const { id } = req.params;

  projectsDB
    .get(id)
    .then((project) => {
      if (project) {
        req.project = project;
        next();
      } else
        res.status(404).json({ message: "project with that id not found" });
    })
    .catch((err) => next(err));
}

function checkProjectBody(req, res, next) {
  const project = req.body;

  if (!project.name || !project.description) {
    res.status(400).json({
      message: "Bad request, you need to include project name and description.",
    });
  } else {
    req.project = project;
    next();
  }
}

function checkActionID(req, res, next) {
  const { id } = req.params;

  actionsDB
    .get(id)
    .then((action) => {
      if (action) {
        req.action = action;
        next();
      } else res.status(404).json({ message: "action with that id not found" });
    })
    .catch((err) => next(err));
}

function checkActionBody(req, res, next) {
  const action = req.body;

  if (!action.project_id || !action.description || !action.notes) {
    res.status(400).json({
      message:
        "Bad request, you need to include project id, action description and notes.",
    });
  } else {
    projectsDB
      .get(action.project_id)
      .then((project) => {
        if (project) {
          if (action.description.length > 128)
            res.status(400).json({
              message: "action description is longer than 128 characters",
            });
          else {
            req.action = action;
            next();
          }
        } else
          res.status(404).json({ message: "project with that id not found" });
      })
      .catch((err) => next(err));
  }
}

module.exports = {
  checkProjectID,
  checkProjectBody,
  checkActionID,
  checkActionBody,
};
