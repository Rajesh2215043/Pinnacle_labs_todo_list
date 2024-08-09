const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

function CreateToDoItems() {
  if (todoValue.value === "") {
    todoAlert.innerText = "Please enter your todo text!";
    todoValue.focus();
    return;
  }

  let isPresent = todo.some((element) => element.item === todoValue.value);
  if (isPresent) {
    setAlertMessage("This item is already present in the list!");
    return;
  }

  const li = document.createElement("li");
  const todoItems = `
    <div title="Double click to mark as complete" ondblclick="CompletedToDoItems(this)">
      ${todoValue.value}
    </div>
    <div>
      <button class="edit todo-controls" onclick="UpdateToDoItems(this)">Edit</button>
      <button class="delete todo-controls" onclick="DeleteToDoItems(this)">Delete</button>
    </div>`;
  li.innerHTML = todoItems;
  listItems.appendChild(li);

  todo.push({ item: todoValue.value, status: false });
  setLocalStorage();
  todoValue.value = "";
  setAlertMessage("Todo item created successfully!");
}

function ReadToDoItems() {
  listItems.innerHTML = "";
  todo.forEach((element) => {
    const li = document.createElement("li");
    const style = element.status ? "style='text-decoration: line-through'" : "";
    const todoItems = `
      <div ${style} title="Double click to mark as complete" ondblclick="CompletedToDoItems(this)">
        ${element.item}
        ${element.status ? '<span class="todo-controls">✔</span>' : ""}
      </div>
      <div>
        ${
          !element.status
            ? '<button class="edit todo-controls" onclick="UpdateToDoItems(this)">Edit</button>'
            : ""
        }
        <button class="delete todo-controls" onclick="DeleteToDoItems(this)">Delete</button>
      </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);
  });
}

function UpdateToDoItems(e) {
  const todoDiv = e.parentElement.parentElement.querySelector("div");
  if (!todoDiv.style.textDecoration) {
    todoValue.value = todoDiv.innerText.trim();
    updateText = todoDiv;
    addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
    addUpdate.textContent = "Update";
    todoValue.focus();
  }
}

function UpdateOnSelectionItems() {
  if (todoValue.value === "") {
    setAlertMessage("Please enter your todo text!");
    return;
  }

  let isPresent = todo.some((element) => element.item === todoValue.value);
  if (isPresent) {
    setAlertMessage("This item is already present in the list!");
    return;
  }

  todo.forEach((element) => {
    if (element.item === updateText.innerText.trim()) {
      element.item = todoValue.value;
    }
  });
  setLocalStorage();

  updateText.innerText = todoValue.value;
  addUpdate.setAttribute("onclick", "CreateToDoItems()");
  addUpdate.textContent = "Add";
  todoValue.value = "";
  setAlertMessage("Todo item updated successfully!");
}

function DeleteToDoItems(e) {
  const deleteValue = e.parentElement.parentElement
    .querySelector("div")
    .innerText.trim();

  if (confirm(`Are you sure you want to delete this item: ${deleteValue}?`)) {
    e.parentElement.parentElement.classList.add("deleted-item");

    todo = todo.filter((element) => element.item !== deleteValue);

    setTimeout(() => {
      e.parentElement.parentElement.remove();
    }, 1000);

    setLocalStorage();
    setAlertMessage("Todo item deleted successfully!");
  }
}

function CompletedToDoItems(e) {
  const todoDiv = e.parentElement.querySelector("div");
  if (!todoDiv.style.textDecoration) {
    todoDiv.style.textDecoration = "line-through";
    const span = document.createElement("span");
    span.textContent = "✔";
    span.className = "todo-controls";
    todoDiv.appendChild(span);

    todo = todo.map((element) => {
      if (element.item === todoDiv.innerText.trim()) {
        element.status = true;
      }
      return element;
    });

    e.parentElement.querySelector(".edit").remove();
    setLocalStorage();
    setAlertMessage("Todo item completed successfully!");
  }
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.classList.remove("toggleMe");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}

ReadToDoItems();
