const Task = require('../models/Task');
const moment = require('moment');

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
  const { keyword } = req.query; 

  try {
    const tasks = await Task.find({
      $or: [
        { title: new RegExp(keyword, 'i') }, 
        { description: new RegExp(keyword, 'i') } 
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error searching tasks', error });
  }
};



// Get task By id
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


exports.getWeeklyTaskCounts = async (req, res) => {
  try {
    const currentWeekStart = moment().startOf('isoWeek');
    const currentWeekEnd = moment().endOf('isoWeek');

   
    const tasks = await Task.find({
      date: {
        $gte: currentWeekStart.toDate(),
        $lte: currentWeekEnd.toDate(),
      },
    });

    const weeklySummary = {};

    tasks.forEach((task) => {
      const weekStart = moment(task.date).startOf('isoWeek').format('YYYY-MM-DD');
      const weekEnd = moment(task.date).endOf('isoWeek').format('YYYY-MM-DD');
      const weekRange = `${weekStart} - ${weekEnd}`;

      if (!weeklySummary[weekRange]) {
        weeklySummary[weekRange] = {
          completed: 0,
          open: 0,
          tasks: []
        };
      }

     
      if (task.status === 'true') {
        weeklySummary[weekRange].completed += 1;
      } else {
        weeklySummary[weekRange].open += 1;
      }

      
      weeklySummary[weekRange].tasks.push(task);
    });

    res.status(200).json({ weeklySummary });
  } catch (error) {
    res.status(500).json({ message: 'Error counting tasks by week', error });
  }
};