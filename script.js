// Add task to the list when form is submitted
const taskForm = document.getElementById('task-form')
const taskInput= document.getElementById('task-input')
const taskList = document.getElementById('task-list')

// EventListener
taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', taskListManager);

// Function for adding task
function addTask(event) {
    event.preventDefault()  // Prevent page from reloading

    const taskText = taskInput.value.trim()
    // List Element for task
    let taskItem = document.createElement('li');
    taskItem.setAttribute('class', 'task-item')
    // 
    taskItem.innerHTML = `<span>${taskText}</span>
                            <button class="delete-btn">Delete</button>`

    taskList.appendChild(taskItem);
    taskInput.value = '';          
}

// Function for completion and deletion
function taskListManager(e) {
    const target = e.target;
    const taskItem = target.closest('.task-item');

    // Check if it has a class attribute is delete
    if (target.classList.contains('delete-btn')) {  
        taskItem.remove();
    } else if (target.tagName === 'SPAN') { // Detect if its a span element
        target.classList.toggle('completed');
    }
}