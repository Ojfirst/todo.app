// Add task to the list when form is submitted
const taskForm = document.getElementById('task-form');   // task form
const taskInput= document.getElementById('task-input'); // task input
const taskList = document.getElementById('task-list'); // unorder list
const addBtn = document.getElementById('add-btn');
const dueDateInput = document.getElementById('due-date');


// EVENT LISTENER
taskForm.addEventListener('submit', addTask);   // form eventListener
taskList.addEventListener('click', taskListManager);    // list eventListener

// EVENT LISTENER FOR SAVE/CANCEL (EDIT-MODE)
taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('save-btn')) {
        handleSave(e);
    } else if (e.target.classList.contains('cancel-btn')) {
        handleCancel(e);
    }
})


// EVENT LISTENER  FOR EDIT-MODE
taskList.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'SPAN') {
        enterEditMode(e.target.closest('.task-item'))
    }
})

taskList.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSave(e)
    } else if (e.key == 'Escape') {
        handleCancel(e)
    }
})


// Button state 
function setBtnSate(btn, isDisabled) {
    btn.disabled = isDisabled;
}

// Inital state: Disable if empty
setBtnSate(addBtn, taskInput.value.trim() === '');

// Real-time valuation on input
taskInput.addEventListener('input', () => {
    const isEmpty = taskInput.value.trim() === '';
    setBtnSate(addBtn, isEmpty);
})



// Function for adding task
function addTask(event) {
    event.preventDefault()  // Prevent page from reloading

    const taskText = taskInput.value.trim()
    const dueDate = dueDateInput.value || null;

    if (!taskText) return;

    // Default for new text
    const task = {
        text: taskText,
        completed: false,
        dueDate: dueDate
    };


    // List Element for task
    let taskItem = document.createElement('li');    //List item created
    taskItem.setAttribute('class', 'task-item')     // list class set
    // 
    taskItem.innerHTML = `<span>${taskText}</span>
                            <span class="due-date">${dueDate || 'No due date'}</span>
                            <button class="delete-btn">Delete</button>`; // delete button created


      // Check if overdue (for newly added tasks)
    if (dueDate && new Date(dueDate) < new Date()) {
        taskItem.classList.add('overdue');
    }


    taskList.appendChild(taskItem); // append to unorder element
    taskInput.value = '';  // reset input space on click of add task
    
    //save to local storage
    // loadTasks(task)
    saveTasks()


    taskInput.value = '';
    dueDateInput.value = '';
    setBtnSate(addBtn, true);
}



// Function for completion and deletion task
function taskListManager(e) {
    const target = e.target; // target set
    const taskItem = target.closest('.task-item');  // target the parent <li>

    // Check if it has a class attribute is delete
    if (target.classList.contains('delete-btn')) {  
        taskItem.remove();
    } else if (target.tagName === 'SPAN') {     // Detect if it a span element
        taskItem.classList.toggle('completed');
    }
    
    // Save to local storage
    saveTasks();
}





function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(task => {
      tasks.push({
                  text: task.querySelector('span:first-child').textContent, // Explicitly target first child
                  completed: task.classList.contains('completed'),
                  dueDate: task.querySelector('.due-date').textContent === 'No due date' 
                    ? null : task.querySelector('.due-date').textContent
                })
    } )
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



function loadTasks() {
    //Get saved tasks or empty array if none exist
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    //clear existing tasks before rebuilding
    taskList.innerHTML = '';

    // Rebuilding the DOM
    savedTasks.forEach(task => {
        const taskItem = document.createElement('li');

        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <span class="due-date">${task.dueDate || 'No due dat'}</span>
            <button class="delete-btn">Delete</button>
        `;

        // Check for overdue tasks
        if (task.dueDate && new Date(task.dueDate) < new Date()) {
            taskItem.classList.add('overdue');
        }

        taskList.appendChild(taskItem);

    })
}




function formatDueDate(dateString) {
   if (!dateString) return 'No due date'
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  





function showError (message) {
    const errorEl = document.getElementById('error-message');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');

    setTimeout(() => {
        errorEl.classList.add('hidden')
    }, 3000);
}



//  Edit-mode function 
function enterEditMode(taskItem) {
    // Get current task text
    const currentText = taskItem.querySelector('span').textContent; 
    taskItem.setAttribute('data-original-text', currentText);   // Store value

    taskItem.classList.add('edit-mode') // Add visual effect

    taskItem.innerHTML = `
        <input class="edit-input" type="text" value="${currentText}" autofocus> 
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
    `;
    // Auto-focus the input field (ux improvement) 
    taskItem.querySelector('.edit-input').focus();
}




function handleCancel(e) {
    const taskItem = e.target.closest('.task-item'); // Fix selector
    const originalText = taskItem.getAttribute('data-original-text'); //Get stored text

    //Remove edit-mode
    taskItem.classList.remove('edit-mode');
    //Return previous task
    taskItem.innerHTML = `
            <span>${originalText}</span>
            <button class="delete-btn">Delete</button>`;

}




function handleSave(e) {
    const taskItem = e.target.closest('.task-item'); // gets the parent node
    const editInput = document.querySelector('.edit-input');  // gets the input element 
    const editedText = editInput.value.trim() ; // gets user's input value and remove whitespace

    //Validation: Revert if empty
    if (!editedText) {
        showError("Task can't be empty!")
        editInput.focus();
        return; // Exit early
    }

    //Removes edit-mode
    taskItem.classList.remove('edit-mode')
    // Add update user's value
    taskItem.innerHTML = `
            <span>${editedText}</span>
            <button class="delete-btn">Delete</button>`;

    //Update localStorage
    saveTasks();
}


// Load saved tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Prevent past date (place ater DOM loads)
document.getElementById('due-date').min = new Date().toISOString().split('T')[0];













// function handleTaskDoubleClick(e) {
//     // Condition gets content to be edited
//     if (e.target.tagName === 'SPAN') {
//         const taskItem = e.target.closest('.task-item'); // 
//         const currentText = e.target.textContent; // 

//         //Add edit mode
//         taskItem.classList.add('edit-mode'); // add a class edit for simple toggle
//         // Build edit mode
//         // retain current text before editing
//         taskItem.innerHTML = `
//         <input class="edit-input" type="text" value="${currentText}"> 
//         <button class="save-btn">Save</button>
//         <button class="cancel-btn">Cancel</button>`;
//     }
    
// }