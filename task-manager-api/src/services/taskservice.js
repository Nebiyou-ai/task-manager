// src/services/taskService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TaskService {
    // Get all tasks
    async getAllTasks() {
        try {
            return await prisma.task.findMany({
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new Error(`Failed to fetch tasks: ${error.message}`);
        }
    }

    // Get a single task by ID
    async getTaskById(id) {
        try {
            const task = await prisma.task.findUnique({
                where: { id: parseInt(id) }
            });
            
            if (!task) {
                throw new Error('Task not found');
            }
            return task;
        } catch (error) {
            throw new Error(`Failed to fetch task: ${error.message}`);
        }
    }

    // Create a new task
    async createTask(text) {
        try {
            if (!text || text.trim() === '') {
                throw new Error('Task text is required');
            }
            
            return await prisma.task.create({
                data: { text: text.trim() }
            });
        } catch (error) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    }

    // Update a task
    async updateTask(id, updates) {
        try {
            const task = await prisma.task.findUnique({
                where: { id: parseInt(id) }
            });
            
            if (!task) {
                throw new Error('Task not found');
            }

            return await prisma.task.update({
                where: { id: parseInt(id) },
                data: updates
            });
        } catch (error) {
            throw new Error(`Failed to update task: ${error.message}`);
        }
    }

    // Delete a task
    async deleteTask(id) {
        try {
            const task = await prisma.task.findUnique({
                where: { id: parseInt(id) }
            });
            
            if (!task) {
                throw new Error('Task not found');
            }

            return await prisma.task.delete({
                where: { id: parseInt(id) }
            });
        } catch (error) {
            throw new Error(`Failed to delete task: ${error.message}`);
        }
    }

    // Filter tasks by status
    async filterTasksByStatus(completed) {
        try {
            const isCompleted = completed === 'true' || completed === true;
            
            return await prisma.task.findMany({
                where: { completed: isCompleted },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new Error(`Failed to filter tasks: ${error.message}`);
        }
    }
}

module.exports = new TaskService();