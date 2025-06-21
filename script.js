// Select elements
const calendarBar = document.getElementById('calendarBar')
const box = document.getElementById("box")
const taskinput = document.getElementById("taskname")
const dateinput = document.getElementById("Taskdate")
const taskForm = document.getElementById("taskForm")
const taskModal = document.querySelector(".popupmain")

let selectedDate = new Date()

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Render horizontal calendar
function renderCalendar() {
    calendarBar.innerHTML = "";
    for (let i = -3; i <= 3; i++) {
        const date = new Date(selectedDate)
        date.setDate(selectedDate.getDate() + i)

        const day = dayNames[date.getDay()]
        const dateNum = date.getDate()
        const month = monthNames[date.getMonth()]

        const div = document.createElement('div')
        div.classList.add('calendar-day')

        if (date.toDateString() === new Date().toDateString()) div.classList.add('today')
        if (date.toDateString() === selectedDate.toDateString()) div.classList.add('selected')

        div.innerHTML = `<div>${day}</div><div>${dateNum}</div><div>${month}</div>`
        div.onclick = () => {
            selectedDate = date
            renderCalendar()
            loadTaskForDate(selectedDate)
        };

        calendarBar.appendChild(div)
    }
}
renderCalendar()
setupModalButton()

// Open task form popup
function setupModalButton() {
    const mbutton = document.getElementById("mainbutton")
    mbutton.onclick = function () {
        taskModal.style.display = "flex"
        const close = document.querySelector(".close")
        close.onclick = () => (taskModal.style.display = "none")
        window.onclick = (e) => {
            if (e.target === taskModal) taskModal.style.display = "none"
        };
    };
}

// Handle task form submission
taskForm.onsubmit = (e) => {
    e.preventDefault();
    const task = taskinput.value.trim();
    const date = new Date(dateinput.value).toISOString().split("T")[0]
    if (!task || !date) return

    const allTasks = JSON.parse(localStorage.getItem("tasks")) || {}
    if (!allTasks[date]) allTasks[date] = []
    allTasks[date].push({ name: task, completed: false })
    localStorage.setItem("tasks", JSON.stringify(allTasks))

    taskForm.reset()
    taskModal.style.display = "none"

    const selectedKey = selectedDate.toISOString().split("T")[0]
    if (date === selectedKey) {
        loadTaskForDate(selectedDate)
    }
};

// Load tasks for selected date
function loadTaskForDate(date) {
    const id = typeof date === "string" ? date : date.toISOString().split("T")[0]
    const tasks = JSON.parse(localStorage.getItem("tasks")) || {}
    box.innerHTML = ""

    if (!tasks[id] || !tasks[id].length) {
        box.innerHTML = "<p>No task for this day.</p>"
        return;
    }

    tasks[id].forEach((task, index) => {
        const row = document.createElement("div")
        row.className = "task-row box"
        row.style.display = "flex"
        row.style.alignItems = "center"
        row.style.justifyContent = "space-between"
        row.style.margin = "10px auto"

        const check = document.createElement("input")
        check.type = "checkbox"
        check.checked = task.completed
        // check.disabled = task.completed

        const taskText = document.createElement("span")
        taskText.textContent = task.name;

        if (task.completed) taskText.classList.add("checked")

        check.onclick = function () {
            task.completed = true
            // check.disabled = true
            // taskText.classList.add("checked")
            localStorage.setItem("tasks", JSON.stringify(tasks))
            loadTaskForDate(date)
        };

        const left = document.createElement("div")
        left.style.display = "flex"
        left.style.alignItems = "center"
        left.appendChild(check)
        left.appendChild(taskText)

        const deleteBtn = document.createElement("button")
        deleteBtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete" style="width:20px;height:20px;">`;
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.onclick = function () {
            tasks[id].splice(index, 1)
            localStorage.setItem("tasks", JSON.stringify(tasks))
            loadTaskForDate(date)
        };
        taskText.onclick = function () {
            taskText.setAttribute("contenteditable", "true");
            taskText.focus();

            taskText.onblur = function () {
                const newName = taskText.textContent.trim();
                if (newName !== "") {
                    task.name = newName;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    loadTaskForDate(date);
                } else {
                    taskText.textContent = task.name;
                }
                taskText.removeAttribute("contenteditable");
            };
        };
        const right = document.createElement("div")
        right.appendChild(deleteBtn)

        row.appendChild(left)
        row.appendChild(right)
        box.appendChild(row)
    });
}
