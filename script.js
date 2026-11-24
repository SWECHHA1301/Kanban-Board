
let tasksData = {};

let todo = document.querySelector("#todo");
let progress = document.querySelector("#progress");
let done = document.querySelector("#done");

let columns = [todo, progress, done];

let tasks = document.querySelectorAll(".task");
const addTaskBtn = document.querySelector("#add-new-task");

let dragElement = null;


// Function to create a task
function createTask(taskTitle, taskDesc) {

    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDesc}</p>
        <button>Delete</button>
    `;

    addDragEvent(div);
    
    // Delete task
    div.querySelector("button").addEventListener("click", () => {
        div.remove();
        updateTasks();
    });

    return div;
}


// Drag event function
function addDragEvent(task) {

    task.addEventListener("dragstart", () => {
        dragElement = task;
    });
}


// Load tasks from localStorage
if (localStorage.getItem("tasks")) {

    const data = JSON.parse(localStorage.getItem("tasks"));

    for (const col in data) {

        const column = document.querySelector(`#${col}`);

        if (column) {

            data[col].forEach((task) => {

                const div = createTask(task.title, task.desc);

                column.appendChild(div);

            });

        }
    }
}


// Add drag events to existing HTML tasks
tasks.forEach((task) => {
    addDragEvent(task);
});


// Function to update counts and save tasks
function updateTasks() {

    columns.forEach((col) => {

        const tasks = col.querySelectorAll(".task");

        const count = col.querySelector(".right");

        count.innerText = tasks.length;


        tasksData[col.id] = Array.from(tasks).map((t) => {

            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            };

        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
}


// Drag and drop function
function addDrageEventOnColumn(column) {

    column.addEventListener("dragenter", (e) => {

        e.preventDefault();

        column.classList.add("hover-over");

    });


    column.addEventListener("dragover", (e) => {

        e.preventDefault();

    });


    column.addEventListener("dragleave", (e) => {

        if (!column.contains(e.relatedTarget)) {
            column.classList.remove("hover-over");
        }

    });


    column.addEventListener("drop", (e) => {

        e.preventDefault();

        if (dragElement) {

            column.appendChild(dragElement);

            dragElement = null;

        }

        column.classList.remove("hover-over");

        updateTasks();

    });

}


// Apply drag events to columns
addDrageEventOnColumn(todo);
addDrageEventOnColumn(progress);
addDrageEventOnColumn(done);


// Initial count
updateTasks();


// Modal elements
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");


// Open modal
toggleModalButton.addEventListener("click", () => {

    modal.classList.toggle("active");

});


// Close modal
modalBg.addEventListener("click", () => {

    modal.classList.remove("active");

});


// Add new task
addTaskBtn.addEventListener("click", () => {

    const taskTitle = document.querySelector("#task-title-input").value;

    const taskDesc = document.querySelector("#task-dec-input").value;

    if (!taskTitle.trim()) {
        alert("Please enter task title");
        return;
    }

    const div = createTask(taskTitle, taskDesc);

    todo.appendChild(div);

    updateTasks();

    modal.classList.remove("active");
 
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-dec-input").value = "";
    

});
