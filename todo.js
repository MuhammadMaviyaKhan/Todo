let tasks = [];

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const emptyState = document.getElementById('emptyState');
const dateDisplay = document.getElementById('dateDisplay');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateDate();
    taskInput.focus();
});

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

function updateDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.classList.add('shake');
        setTimeout(() => taskInput.classList.remove('shake'), 400);
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = '';
    saveTasks();
    renderTasks();
    taskInput.focus();
}

function renderTasks() {
    taskList.innerHTML = '';

    const activeCount = tasks.filter(t => !t.completed).length;
    const completedCount = tasks.filter(t => t.completed).length;

    taskCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
    clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item${task.completed ? ' completed' : ''}`;
        li.dataset.id = task.id;
        li.style.animationDelay = `${index * 0.05}s`;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn" title="Delete task">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
            </button>
        `;

        li.querySelector('.task-checkbox').addEventListener('change', () => toggleTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));

        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    const li = taskList.querySelector(`[data-id="${id}"]`);
    if (li) {
        li.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }, 220);
    }
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    taskInput.focus();
}

function saveTasks() {
    localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('todo_tasks');
    if (saved) {
        try {
            tasks = JSON.parse(saved);
        } catch {
            tasks = [];
        }
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
