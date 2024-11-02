const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask, searchTasks, getTaskById, toggleTaskStatus, getWeeklyTaskCounts,} = require('../controllers/taskController');
const router = express.Router();

router.get('/search', searchTasks);
router.get('/weekly-task-counts', getWeeklyTaskCounts);
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id',getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.put('/:id/toggle-status', toggleTaskStatus);



module.exports = router;
