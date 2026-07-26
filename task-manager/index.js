#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

const TASKS_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
    try {
        return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    } catch (error) {
        return [];
    }
}

function writeTasks(tasks) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

program
    .command('add <task>')
    .action((task) => {
        const tasks = readTasks();
        tasks.push({ id: Date.now(), text: task, completed: false });
        writeTasks(tasks);
        console.log('Task added!');
    });

program
    .command('list')
    .action(() => {
        const tasks = readTasks();
        if (tasks.length === 0) {
            console.log('No tasks');
            return;
        }
        tasks.forEach((task, i) => {
            console.log(`${i + 1}. ${task.completed ? '[X]' : '[ ]'} ${task.text}`);
        });
    });

program
    .command('complete <id>')
    .action((id) => {
        const tasks = readTasks();
        const index = parseInt(id) - 1;
        if (tasks[index]) {
            tasks[index].completed = true;
            writeTasks(tasks);
            console.log('Done!');
        } else {
            console.log('Invalid ID');
        }
    });

program
    .command('delete <id>')
    .action((id) => {
        const tasks = readTasks();
        const index = parseInt(id) - 1;
        if (tasks[index]) {
            tasks.splice(index, 1);
            writeTasks(tasks);
            console.log('Deleted!');
        } else {
            console.log('Invalid ID');
        }
    });

program
    .command('filter <status>')
    .action((status) => {
        const tasks = readTasks();
        const filtered = tasks.filter(t => t.completed === (status === 'done'));
        filtered.forEach((task, i) => {
            console.log(`${i + 1}. ${task.completed ? '[X]' : '[ ]'} ${task.text}`);
        });
    });

program.parse(process.argv);
