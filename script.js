// Add task to the list when form is submitted
const taskForm = document.getElementById('task-form')   // task form
const taskInput= document.getElementById('task-input') // task input
const taskList = document.getElementById('task-list') // unorder list

// EventListener
taskForm.addEventListener('submit', addTask);   // form eventListener
taskList.addEventListener('click', taskListManager);    // list eventListener

// Function for adding task
function addTask(event) {
    event.preventDefault()  // Prevent page from reloading

    const taskText = taskInput.value.trim()
    // List Element for task
    let taskItem = document.createElement('li');    //List item created
    taskItem.setAttribute('class', 'task-item')     // list class set
    // 
    taskItem.innerHTML = `<span>${taskText}</span>
                            <button class="delete-btn">Delete</button>` // delete button created

    taskList.appendChild(taskItem); // append to unorder element
    taskInput.value = '';  // reset input space on click of add task
    
    //save to local storage
    saveTasks()
}

// Function for completion and deletion
function taskListManager(e) {
    const target = e.target; // target set
    const taskItem = target.closest('.task-item');  // target the parent <li>

    // Check if it has a class attribute is delete
    if (target.classList.contains('delete-btn')) {  
        taskItem.remove();
    } else if (target.tagName === 'SPAN') { // Detect if it a span element
        taskItem.classList.toggle('completed');
    }

    // Save to local storage
    saveTasks();
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach((task) => {
      tasks.push({
                  text: task.querySelector('span').textContent,
                  completed: task.classList.contains('completed')
                })
    } )
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    //Get saved tasks or empty arraymif none exist
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    //clear existing tasks before rebuilding
    taskList.innerHTML = '';

    // Rebuilding the DOM
    savedTasks.forEach(task => {
        const taskItem = document.createElement('li');

        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <button class="delete-btn">Delete</button>`;

        taskList.appendChild(taskItem);
    
    })
}

document.addEventListener('DOMContentLoaded', loadTasks);