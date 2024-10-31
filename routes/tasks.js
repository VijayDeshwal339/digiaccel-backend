const express = require('express');
const { createTask, getAllTasks, updateTask, deleteTask, searchTasks, getTaskById, toggleTaskStatus } = require('../controllers/taskController');
const router = express.Router();

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id',getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/search', searchTasks);
router.put('/:id/toggle-status', toggleTaskStatus);

module.exports = router;
