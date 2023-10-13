import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  delete req.body.id;
  const { project } = req.body;

  const existProject = await Project.findById(project);
  if (!existProject) {
    const error = new Error("Project Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (existProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error("You don't have permission to add tasks");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const taskSave = await Task.create(req.body);
    //To save the id in the project
    existProject.tasks.push(taskSave._id);
    await existProject.save();
    res.json(taskSave);
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  return res.json(task);
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  task.nameTask = req.body.nameTask || task.nameTask;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deadline = req.body.deadline || task.deadline;

  try {
    const taskSave = await task.save();
    res.json(taskSave);
  } catch (error) {
    console.log();
  }
};
const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (id.length !== 24) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task.id);
    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ msg: `Task ${task.nameTask} Deleted` });
  } catch (error) {
    console.log(error);
  }
};
const changeState = async (req, res) => {
  if (req.params.id.length !== 24) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (!req.params.id) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  const task = await Task.findById(req.params.id)
    .populate("project")
    .populate("completeBy");

  if (!task) {
    const error = new Error("Task Not Found");
    return res.status(404).json({ msg: error.message });
  }
  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error("Invalid Action");
    return res.status(403).json({ msg: error.message });
  }
  try {
    task.state = !task.state;
    task.completeBy = req.user._id;
    await task.save();
    const taskSaved = await Task.findById(req.params.id)
      .populate("project")
      .populate("completeBy");
    return res.json(taskSaved);
  } catch (error) {
    console.log(error);
  }
};

export { addTask, getTask, updateTask, deleteTask, changeState };
