document.addEventListener("DOMContentLoaded", function () {
  var popupContent = document.getElementById("popup-content");
  var popupContent2 = document.getElementById("popup-content2");
  var todoInput = document.getElementById("todo-text");
  var addButton = document.getElementById("add-button");
  var isPopupContentVisible = true;
  var currentDateAndTime = document.getElementById("current-date-time"); // New element to display date and time
  var currentContent = "popup-content"; // Variable to track current content

  // Load existing todos from local storage
  var todos = JSON.parse(localStorage.getItem("todos")) || [];
  // Load existing time-sensitive todos from local storage
  var timeSensitiveTodos = JSON.parse(localStorage.getItem("time_sensitive_todos")) || [];

  if (timeSensitiveTodos) {
      timeSensitiveTodos.sort(sortByDateMMDDYYYY);
  }
  // Function to render the to-do list with line wrapping at 24 characters
  function renderTodos() {
    var todoList = document.createElement("ul");
    todoList.className = "custom-list-style";
  
    var todosToDisplay = currentContent === "popup-content" ? todos : timeSensitiveTodos;
  
    todosToDisplay.forEach(function (todoItem, index) {
      var listItem = document.createElement("li");
  
      if (Array.isArray(todoItem)) {
        // For time-sensitive todos with two parts (item text and date)
        var itemText = todoItem[0];
        var itemDate = todoItem[1];
        let displayText = splitStringIntoLines(itemText, 24);
     
        if (itemDate) {
          displayText += "<div class='datetext'>" + itemDate + "</div>";
        }
        listItem.innerHTML = displayText;
      } else {
        // For regular todos with one part (item text)
        listItem.innerHTML = splitStringIntoLines(todoItem, 24);
      }
  
      // Add a click event to the list item to trigger delete confirmation
      listItem.addEventListener("click", function () {
        if (confirm("Are you sure you want to delete this item?")) {
          // Remove the item from the appropriate array
          if (currentContent === "popup-content") {
            todos.splice(index, 1);
            localStorage.setItem("todos", JSON.stringify(todos));
          } else {
            timeSensitiveTodos.splice(index, 1);
            localStorage.setItem("time_sensitive_todos", JSON.stringify(timeSensitiveTodos));
          }
  
          // Re-render the list
          renderTodos();
        }
      });
  
      todoList.appendChild(listItem);
    });
  
    popupContent.innerHTML = ""; // Clear the existing list
    popupContent2.innerHTML = ""; // Clear the existing list in popup-content2

    if (currentContent === "popup-content") {
      popupContent.appendChild(todoList);
    } else {
      popupContent2.appendChild(todoList);
    }

    // Check if the content exceeds the maximum height and show/hide the scrollbar accordingly
    var contentToCheck = currentContent === "popup-content" ? popupContent : popupContent2;
    if (contentToCheck.scrollHeight > 509) {
      contentToCheck.style.overflowY = "scroll";
    } else {
      contentToCheck.style.overflowY = "hidden";
    }
  }

  // Function to update and display the current date and time
  function updateCurrentDateTime() {
    var now = new Date();
    var dateTimeString = now.toLocaleString(); // Format the date and time
    currentDateAndTime.textContent = dateTimeString;
  }

function sortByDateMMDDYYYY(a, b) {
  const dateA = new Date(a[1]);
  const dateB = new Date(b[1]);

  if (dateA < dateB) {
      return -1;
  } else if (dateA > dateB) {
      return 1;
  } else {
      return 0;
  }
}
  function changeBackground(imageUrl) {
    // Get a reference to the body element
    var body = document.body;
    // Set the new background image URL
    var newBackgroundImage = 'url("' + imageUrl + '")';
    // Change the background image
    body.style.backgroundImage = newBackgroundImage;
}

function isValidDateFormat(dateText) {
  // Use a regular expression to check the format
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateText);
}

function splitStringIntoLines(inputString, maxLineLength) {
  // Initialize an empty array to store the lines
  var lines = [];
  // Loop through the input string
  for (var i = 0; i < inputString.length; i += maxLineLength) {
      // Use substring to extract a chunk of the string
      var line = inputString.substring(i, i + maxLineLength);
      // Push the chunk (line) into the array
      lines.push(line);
  }
  // Join the lines with newline characters to create a multi-line string
  var result = lines.join('\n');
  return result;
}

  // Render the initial to-do list
  renderTodos();
  // Display the current date and time
  updateCurrentDateTime();

 // Add a new to-do item
addButton.addEventListener("click", function () {
  var newTodo = todoInput.value.trim();
  if (newTodo) {
    var targetArray = currentContent === "popup-content" ? todos : timeSensitiveTodos;
    targetArray.push(newTodo);
    var storageKey = currentContent === "popup-content" ? "todos" : "time_sensitive_todos";
    localStorage.setItem(storageKey, JSON.stringify(targetArray));
    todoInput.value = "";
    renderTodos();
  }
});

document.getElementById("add-button2").addEventListener("click", function () {
  var newTodoText = document.getElementById("todo-text2").value.trim();
  var newTodoDate = document.getElementById("datepicker").value.trim();

  if (newTodoText && newTodoDate) {
 /*  this is never gonna happen 
      if (!isValidDateFormat(newTodoDate)) {
          element.style.backgroundColor = "red";
          alert("Please enter a valid mm/dd/yyyy date.");
          return;
      }else{
        element.style.backgroundColor = "white";
      }
*/

    var newTimeSensitiveTodo = [newTodoText, newTodoDate];
    timeSensitiveTodos.push(newTimeSensitiveTodo);
    localStorage.setItem("time_sensitive_todos", JSON.stringify(timeSensitiveTodos));

    // Clear the input fields
    document.getElementById("todo-text2").value = "";
    document.getElementById("datepicker").value = "";

    // Re-render the list of time-sensitive todos
    renderTodos();
  }
});


  // Add an event listener for the F3 key to toggle visibility
  document.addEventListener("keydown", function (event) {
    if (event.key === "F3") {
      if (isPopupContentVisible) {  // change to timesensitivetodos 
        changeBackground('clockback.jpg')
        popupContent.style.display = "none";
        popupContent2.style.display = "block";
        todoInput.style.display = "none";
        addButton.style.display = "none";
        document.getElementById("todo-input2").style.display = "inline-block"; // Show the new input div
        currentContent = "popup-content2";
      } else {                      // change to regular
        changeBackground('listbackground.jpg')
        popupContent.style.display = "block";
        todoInput.style.display = "inline-block";
        addButton.style.display = "inline-block";
        popupContent2.style.display = "none";
        document.getElementById("todo-input2").style.display = "none"; // Hide the new input div
        currentContent = "popup-content";
      }
      isPopupContentVisible = !isPopupContentVisible;
      renderTodos();
    }
  });
 
  // Update the date and time every second
  setInterval(updateCurrentDateTime, 1000);
});
