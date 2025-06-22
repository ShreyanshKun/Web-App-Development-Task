
const calendarBar = document.getElementById('calendarBar')
const box = document.getElementById("box")                      // created variables by extracting elements from their id and class name
const taskinput = document.getElementById("taskname")
const dateinput = document.getElementById("Taskdate")
const taskForm = document.getElementById("taskForm")
const taskModal = document.querySelector(".popupmain")

let selectedDate = new Date()

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']                                 //storing the month name and day name in array
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


function Calendar() {                     //  function to render horizontal calendar
    calendarBar.innerHTML = "";
    for (let i = -3; i <= 3; i++) {
        const date = new Date(selectedDate)                       // for loop to extract dates 3 days beofre and after the current date 
        date.setDate(selectedDate.getDate() + i)

        const day = dayNames[date.getDay()]         //getting the day name
        const dateNum = date.getDate()                           //getting the num of date
        const month = monthNames[date.getMonth()]               //getting the month name

        const div = document.createElement('div')
        div.classList.add('calendar-day')       //adding class to the div created above

        if (date.toDateString() === new Date().toDateString()) div.classList.add('today')   //ifthe current date is the date selected date
        if (date.toDateString() === selectedDate.toDateString()) div.classList.add('selected')     // if the current date is some other date

        div.innerHTML = `<div>${day}</div><div>${dateNum}</div><div>${month}</div>`   //setting the inner html of the calnedar
        div.onclick = () => {
            selectedDate = date                 //adding event on click and callling the function 
            Calendar()
            loadtask(selectedDate)
        };

        calendarBar.appendChild(div)                                        // appendinng it to the page
    }
}
Calendar()            
setupButton()


function setupButton() {                                   // function to open pop up
    const mbutton = document.getElementById("mainbutton")
    mbutton.onclick = function () {                             // adding event on clicking the button
        taskModal.style.display = "flex"
        const close = document.querySelector(".close")                      //adding function to close
        close.onclick = () => (taskModal.style.display = "none")
        window.onclick = (e) => {
            if (e.target === taskModal) taskModal.style.display = "none"        // adding event to close the pop up
        };
    };
}


taskForm.onsubmit = (e) => {                            // adding event to handle submission 
    e.preventDefault();                     // to prevent balnk answer
    const task = taskinput.value.trim();        //removing extra gaps at the start and end 
    const date = new Date(dateinput.value).toISOString().split("T")[0]                  // converting it string format
    if (!task || !date) return

    const allTasks = JSON.parse(localStorage.getItem("tasks")) || {}      // loads all saved tasks so you can read, update, or add new tasks under a specific date
    if (!allTasks[date]) allTasks[date] = []
    allTasks[date].push({ name: task, completed: false })   // to add a task under that date
    localStorage.setItem("tasks", JSON.stringify(allTasks))             //to save it in th local storage 

    taskForm.reset()        // resteing it
    taskModal.style.display = "none"

    const selectedKey = selectedDate.toISOString().split("T")[0]        // if the sected date is some other date
    if (date === selectedKey) {
        loadtask(selectedDate)
    }
};


function loadtask(date) {                                    // function to load tasks for selected date
    const id = typeof date === "string" ? date : date.toISOString().split("T")[0]   // converting date to string
    const tasks = JSON.parse(localStorage.getItem("tasks")) || {}
    box.innerHTML = ""

    if (!tasks[id] || !tasks[id].length) {
        box.innerHTML = "<p>No task for this day.</p>"                      // if there is nothing added , then it shos this text
        return;
    }

    tasks[id].forEach((task, index) => {
        const row = document.createElement("div")
        row.className = "task-row box"
        row.style.display = "flex"                              //creating a div lement and adiing styles to it
        row.style.alignItems = "center"
        row.style.justifyContent = "space-between"
        row.style.margin = "10px auto"

        const check = document.createElement("input")
        check.type = "checkbox"                     // creating a checkbox to check when the task is complted
        check.checked = task.completed
        

        const taskText = document.createElement("span")
        taskText.textContent = task.name;               // adding the task text

        if (task.completed) taskText.classList.add("checked")                   // adding class if the task is completed

        check.onclick = function () {                       //adding event on clicking the the checkbox
            task.completed = true
            
            localStorage.setItem("tasks", JSON.stringify(tasks))                //storing it in the local storage
            loadtask(date)
        };

        const left = document.createElement("div")
        left.style.display = "flex"                         //creating a div to append the tasktext and check box button to the left side of the row
        left.style.alignItems = "center"
        left.appendChild(check)
        left.appendChild(taskText)

        const deleteBtn = document.createElement("button")                                  // creating a delete button
        deleteBtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete" style="width:20px;height:20px;">`;   //adding an image to dlt button
        deleteBtn.style.border = "none";
        deleteBtn.style.background = "transparent";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.onclick = function () {           //adding a event on clicking the delte button
            tasks[id].splice(index, 1)                          // to remove the task 
            localStorage.setItem("tasks", JSON.stringify(tasks))            // svaing i in local storage 
            loadtask(date)
        };
        taskText.onclick = function () {                        //adding event to edit the teasktext
            taskText.setAttribute("contenteditable", "true");
            taskText.focus();                               //on focus 

            taskText.onblur = function () {                                         //on going awaya from the text
                const newName = taskText.textContent.trim();
                if (newName !== "") {
                    task.name = newName;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    loadtask(date);
                } else {
                    taskText.textContent = task.name;
                }
                taskText.removeAttribute("contenteditable");
            };
        };
        const right = document.createElement("div")
        right.appendChild(deleteBtn) // appending the delte button

        row.appendChild(left)
        row.appendChild(right)          // appending the left, right and row to the main box
        box.appendChild(row)
    });
}
