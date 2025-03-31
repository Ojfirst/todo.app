// Add task to the list when form is submitted
const taskForm = document.getElementById('task-form')
const taskInput= document.getElementById('task-input')
const taskList = document.getElementById('task-list')

taskForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTactAction);

function addTask(event) {
    event.preventDefault()

    const taskText = taskInput.value.trim()

    let taskItem = document.createElement('li');
    taskItem.setAttribute('class', 'task-item')
    
    taskItem.innerHTML = `<span>${taskText}</span>
                <button class="delete-btn">Delete</button>`

    taskList.appendChild(taskItem);
    taskInput.value = '';          
}