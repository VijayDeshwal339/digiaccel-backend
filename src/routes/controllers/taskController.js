const Task = require('../../models/Task');

// Create Task
exports.createTask = async (req, res) => {
  const { title, description, date, startTime, endTime, priority } = req.body; // Include new fields

  const newTask = new Task({ title, description, date, startTime, endTime, priority });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, startTime, endTime, priority, status } = req.body; // Include new fields

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, date, startTime, endTime, priority, status }, // Update new fields
      { new: true }
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await Task.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Search Task
exports.searchTasks = async (req, res) => {
  const { keyword } = req.query; // Get the search keyword from query parameters

  try {
    const tasks = await Task.find({
      $or: [
        { title: new RegExp(keyword, 'i') }, // Search in title
        { description: new RegExp(keyword, 'i') } // Search in description
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error searching tasks', error });
  }
};




exports.getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Toggle Task Status
// Controller function to toggle task status
exports.toggleTaskStatus = async (req, res) => {
  const { id } = req.params;
  try {
    // Find task by ID and toggle the status
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.status = task.status === 'false' ? 'true' : 'false';
    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling task status', error });
  }
};


// Count completed and not completed tasks
exports.Count = async (req, res) => {
  try {
    const completedCount = await Task.countDocuments({ status: 'true' });
    const notCompletedCount = await Task.countDocuments({ status: 'false' });

    res.status(200).json({
      completedTasks: completedCount,
      notCompletedTasks: notCompletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
