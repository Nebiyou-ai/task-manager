const taskService = require('../services/taskservice');

class TaskController {
    async getAllTasks(req, res, next) {
        try {
            const { status } = req.query;
            let tasks;
            
            if (status !== undefined) {
                tasks = await taskService.filterTasksByStatus(status);
            } else {
                tasks = await taskService.getAllTasks();
            }
            
            res.json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req, res, next) {
        try {
            const task = await taskService.getTaskById(req.params.id);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async createTask(req, res, next) {
        try {
            const { text } = req.body;
            const task = await taskService.createTask(text);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const task = await taskService.updateTask(req.params.id, req.body);
            res.json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await taskService.deleteTask(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
