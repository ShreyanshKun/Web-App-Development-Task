
const calendarbar = document.getElementById('calendarBar')
const box = document.getElementById("box")                      // created variables by extracting elements from their id and class name
const taskinput = document.getElementById("taskname")
const dateinput = document.getElementById("Taskdate")
const tasform = document.getElementById("taskForm")
const taskmodal = document.querySelector(".popupmain")

let selecteddate = new Date()

const daynames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']                                 //storing the month name and day name in array
const monthnames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


function calendar() {                     //  function to render horizontal calendar
    calendarbar.innerHTML = "";
    for (let i = -3; i <= 3; i++) {
        const date = new Date(selecteddate)                       // for loop to extract dates 3 days beofre and after the current date 
        date.setDate(selecteddate.getDate() + i)

        const day = daynames[date.getDay()]         //getting the day name
        const datenum = date.getDate()                           //getting the num of date
        const month = monthnames[date.getMonth()]               //getting the month name

        const div = document.createElement('div')
        div.classList.add('calendar-day')       //adding class to the div created above

        if (date.toDateString() === new Date().toDateString()) div.classList.add('today')   //ifthe current date is the date selected date
        if (date.toDateString() === selectedDate.toDateString()) div.classList.add('selected')     // if the current date is some other date

        div.innerHTML = `<div>${day}</div><div>${datenum}</div><div>${month}</div>`   //setting the inner html of the calnedar
        div.onclick = () => {
            selecteddate = date                 //adding event on click and callling the function 
            calendar()
            loadtask(selecteddate)
        };

        calendarBar.appendChild(div)                                        // appendinng it to the page
    }
}
calendar()            
setupbutton()


function setupbutton() {                                   // function to open pop up
    const mbutton = document.getElementById("mainbutton")
    mbutton.onclick = function () {                             // adding event on clicking the button
        taskmodal.style.display = "flex"
        const close = document.querySelector(".close")                      //adding function to close
        close.onclick = () => (taskModal.style.display = "none")
        window.onclick = (e) => {
            if (e.target === taskModal) taskModal.style.display = "none"        // adding event to close the pop up
        };
    };
}


taskform.onsubmit = (e) => {                            // adding event to handle submission 
    e.preventDefault();                     // to prevent balnk answer
    const task = taskinput.value.trim();        //removing extra gaps at the start and end 
    const date = new Date(dateinput.value).toISOString().split("T")[0]                  // converting it string format
    if (!task || !date) return

    const alltasks = JSON.parse(localStorage.getItem("tasks")) || {}      // loads all saved tasks so you can read, update, or add new tasks under a specific date
    if (!alltasks[date]) alltasks[date] = []
    alltasks[date].push({ name: task, completed: false })   // to add a task under that date
    localStorage.setItem("tasks", JSON.stringify(alltasks))             //to save it in th local storage 

    taskform.reset()        // resteing it
    taskmodal.style.display = "none"

    const selectedkey = selecteddate.toISOString().split("T")[0]        // if the sected date is some other date
    if (date === selectedkey) {
        loadtask(selecteddate)
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
        

        const tasktext = document.createElement("span")
        tasktext.textContent = task.name;               // adding the task text

        if (task.completed) tasktext.classList.add("checked")                   // adding class if the task is completed

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

        const deletebtn = document.createElement("button")                                  // creating a delete button
        deletebtn.innerHTML = `<img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Delete" style="width:20px;height:20px;">`;   //adding an image to dlt button
        deletebtn.style.border = "none";
        deletebtn.style.background = "transparent";
        deletebtn.style.cursor = "pointer";
        deletebtn.onclick = function () {           //adding a event on clicking the delte button
            tasks[id].splice(index, 1)                          // to remove the task 
            localStorage.setItem("tasks", JSON.stringify(tasks))            // svaing i in local storage 
            loadtask(date)
        };
        tasktext.onclick = function () {                        //adding event to edit the teasktext
            tasktext.setAttribute("contenteditable", "true");
            tasktext.focus();                               //on focus 

            tasktext.onblur = function () {                                         //on going awaya from the text
                const newname = tasktext.textContent.trim();
                if (newname !== "") {
                    task.name = newname;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    loadtask(date);
                } else {
                    tasktext.textContent = task.name;
                }
                tasktext.removeAttribute("contenteditable");
            };
        };
        const right = document.createElement("div")
        right.appendChild(deleteBtn) // appending the delte button

        row.appendChild(left)
        row.appendChild(right)          // appending the left, right and row to the main box
        box.appendChild(row)
    });
}
