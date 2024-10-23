// Get references to the HTML elements needed for the form, input, output, and message container
let form = document.querySelector("form");  // Selects the <form> element from the document
let input = document.querySelector("input");  // Selects the <input> element for user input
let output = document.querySelector(".output");  // Selects the <div> (or container) with the class "output" where todo items will be added
let message = document.querySelector(".message-container");  // Selects the <div> (or container) with the class "message-container" to display success/error messages

// Function to create a todo item
function getTodo(value) {
  let todo = document.createElement("div");  // Creates a new <div> element for the todo item
  let textEl = document.createElement("span");  // Creates a <span> element to hold the text of the todo item
  textEl.innerHTML = value;  // Sets the text of the <span> to the value passed into the function (i.e., the user's input)
  todo.appendChild(textEl);  // Adds the <span> containing the text to the todo <div>

  // Displays a success message indicating that an item was added
  message.classList.toggle("success");  // Toggles (adds/removes) the "success" class to show the success message in the message container
  message.textContent = "Item Added";  // Sets the message text to "Item Added"

  // Removes the success message after 2 seconds
  setTimeout(() => {
    message.classList.toggle("success");  // Toggles the "success" class off after 2 seconds to hide the message
  }, 2000);  // 2000 milliseconds (2 seconds)

  let closeEl = document.createElement("span");  // Creates a new <span> element for the close/delete button (to remove the todo item)
  closeEl.innerHTML = "&times;";  // Sets the text inside the <span> to "×" (HTML entity for the close symbol)
  closeEl.classList.add("delete");  // Adds the "delete" class to the close <span> for styling purposes

  // Adds an event listener to the close button to handle removing the todo item when clicked
  closeEl.addEventListener("click", () => {
    output.removeChild(todo);  // Removes the todo <div> from the output container
    message.classList.toggle("error");  // Toggles (adds/removes) the "error" class to show the error message when an item is deleted
    message.textContent = "Item Deleted";  // Sets the message text to "Item Deleted"

    // Removes the error message after 2 seconds
    setTimeout(() => {
      message.classList.toggle("error");  // Toggles the "error" class off after 2 seconds to hide the message
    }, 2000);  // 2000 milliseconds (2 seconds)
  });

  todo.appendChild(closeEl);  // Adds the close button <span> to the todo <div>
  todo.classList.add("todo");  // Adds the "todo" class to the todo <div> for styling purposes
  return todo;  // Returns the fully constructed todo <div> element (with text and close button)
}

// Adds an event listener to the form to handle the submit event when the user adds a new todo
form.addEventListener("submit", (e) => {
  e.preventDefault();  // Prevents the default form submission (which would reload the page)
  let value = input.value;  // Gets the value the user typed into the input field
  if (!value.trim()) return;  // If the input is empty or only contains spaces, do nothing (prevents adding blank items)
  output.appendChild(getTodo(value));  // Appends the new todo item to the output container by calling the getTodo function with the input value
  input.value = "";  // Clears the input field after the todo item is added
});
