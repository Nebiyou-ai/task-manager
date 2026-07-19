#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');

// File where tasks are stored
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Helper: Read tasks from file
function readTasks() {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

// Helper: Write tasks to file
function writeTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Command: Add a new task
program
    .command('add <task>')
    .description('Add a new task')
    .action((task) => {
        const tasks = readTasks();
        const newTask = {
            id: Date.now(),
            text: task,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        writeTasks(tasks);
        console.log(chalk.green('✓ Task added successfully!'));
        console.log(chalk.blue(`   "${task}"`));
    });

// Command: List all tasks
program
    .command('list')
    .description('List all tasks')
    .action(() => {
        const tasks = readTasks();
        if (tasks.length === 0) {
            console.log(chalk.yellow('No tasks found. Add one with: node index.js add "Your task"'));
            return;
        }
        
        console.log(chalk.cyan('\n📋 Your Tasks:'));
        tasks.forEach((task, index) => {
            const status = task.completed ? '✓' : '○';
            const color = task.completed ? chalk.green : chalk.white;
            console.log(color(`  ${index + 1}. [${status}] ${task.text}`));
        });
        console.log('');
    });

// Command: Mark task as complete
program
    .command('complete <id>')
    .description('Mark a task as complete')
    .action((id) => {
        const tasks = readTasks();
        const taskIndex = parseInt(id) - 1;
        
        if (taskIndex < 0 || taskIndex >= tasks.length) {
            console.log(chalk.red('✗ Invalid task ID'));
            return;
        }
        
        tasks[taskIndex].completed = true;
        writeTasks(tasks);
        console.log(chalk.green('✓ Task marked as complete!'));
        console.log(chalk.blue(`   "${tasks[taskIndex].text}"`));
    });

// Command: Delete a task
program
    .command('delete <id>')
    .description('Delete a task')
    .action((id) => {
        const tasks = readTasks();
        const taskIndex = parseInt(id) - 1;
        
        if (taskIndex < 0 || taskIndex >= tasks.length) {
            console.log(chalk.red('✗ Invalid task ID'));
            return;
        }
        
        const deleted = tasks.splice(taskIndex, 1);
        writeTasks(tasks);
        console.log(chalk.green('✓ Task deleted!'));
        console.log(chalk.blue(`   "${deleted[0].text}"`));
    });

// Command: Filter tasks by status
program
    .command('filter <status>')
    .description('Filter tasks by status (pending/done)')
    .action((status) => {
        const normalizedStatus = status.toLowerCase();
        
        if (normalizedStatus !== 'done' && normalizedStatus !== 'pending') {
            console.log(chalk.red('✗ Invalid status. Please use "pending" or "done".'));
            return;
        }

        const tasks = readTasks();
        const isCompleted = normalizedStatus === 'done';
        
        // Map tasks to include their original list index (1-based)
        const filtered = tasks
            .map((task, idx) => ({ ...task, originalId: idx + 1 }))
            .filter(t => t.completed === isCompleted);
        
        if (filtered.length === 0) {
            console.log(chalk.yellow(`No ${normalizedStatus} tasks found.`));
            return;
        }
        
        console.log(chalk.cyan(`\n📋 ${normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)} Tasks:`));
        filtered.forEach((task) => {
            const statusIcon = task.completed ? '✓' : '○';
            const color = task.completed ? chalk.green : chalk.white;
            // Uses original ID so users know exactly which ID to pass to 'complete' or 'delete'
            console.log(color(`  ${task.originalId}. [${statusIcon}] ${task.text}`));
        });
        console.log('');
    });

// Parse command-line arguments
program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
    program.outputHelp();
}