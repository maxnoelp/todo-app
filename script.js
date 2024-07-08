const state = {
  currentFilter: "all",
  todos: [],
};

const todoListElement = document.querySelector("#todo-list");
const newTodoFormElement = document.querySelector("#new-todo-form");
const newTodoDescriptionElement = document.querySelector(
  "#new-todo-description"
);
const btn = document.querySelector("#remove");
const filterAllCheckbox = document.querySelector("#filter-all");
const filterActiveCheckbox = document.querySelector("#filter-active");
const filterCompletedCheckbox = document.querySelector("#filter-completed");

function getDataFromLocalStorage() {
  const todoData = JSON.parse(localStorage.getItem("todos"));
  state.todos = todoData || [];
  render();
}

function updateLocalStorageData() {
  const todoDataToString = JSON.stringify(state.todos);
  localStorage.setItem("todos", todoDataToString);
}

function addNewTodo() {
  const description = newTodoDescriptionElement.value.trim();
  if (description === "") {
    alert("Bitte ein Todo eintragen!!!!!");
    return;
  }

  const todoExists = state.todos.some(
    (todo) => todo.description === description
  );
  if (todoExists) {
    alert("Dieses Todo existiert bereits!!!!!");
    return;
  }

  const newTodoData = {
    id: new Date().getTime(),
    description: newTodoDescriptionElement.value,
    done: false,
  };

  state.todos.push(newTodoData);
  updateLocalStorageData();
  render();
  newTodoFormElement.reset();
}

newTodoFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  addNewTodo();
});

// todos löschen
btn.addEventListener("click", function () {
  if (state.currentFilter === "all") {
    state.todos = [];
  } else if (state.currentFilter === "active") {
    state.todos = state.todos.filter((todo) => todo.done);
  } else if (state.currentFilter === "completed") {
    state.todos = state.todos.filter((todo) => !todo.done);
  }
  updateLocalStorageData();
  render();
});

function toggleTodoDone(id) {
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.done = !todo.done;
    updateLocalStorageData();
    render();
  }
}

function generateListItem(todoData) {
  const liElement = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todoData.done;
  checkbox.addEventListener("change", () => toggleTodoDone(todoData.id));

  const span = document.createElement("span");
  span.innerText = todoData.description;
  if (todoData.done) {
    span.classList.add("strikethrough");
  }

  liElement.appendChild(span);
  liElement.appendChild(checkbox);
  return liElement;
}

function render() {
  todoListElement.innerHTML = "";
  let filteredTodos = state.todos;

  if (state.currentFilter === "active") {
    filteredTodos = state.todos.filter((todo) => !todo.done);
  } else if (state.currentFilter === "completed") {
    filteredTodos = state.todos.filter((todo) => todo.done);
  }

  for (const todoData of filteredTodos) {
    const liElement = generateListItem(todoData);
    todoListElement.appendChild(liElement);
  }
}

filterAllCheckbox.addEventListener("change", () => {
  if (filterAllCheckbox.checked) {
    state.currentFilter = "all";
    filterActiveCheckbox.checked = false;
    filterCompletedCheckbox.checked = false;
    render();
  }
});

filterActiveCheckbox.addEventListener("change", () => {
  if (filterActiveCheckbox.checked) {
    state.currentFilter = "active";
    filterAllCheckbox.checked = false;
    filterCompletedCheckbox.checked = false;
    render();
  }
});

filterCompletedCheckbox.addEventListener("change", () => {
  if (filterCompletedCheckbox.checked) {
    state.currentFilter = "completed";
    filterAllCheckbox.checked = false;
    filterActiveCheckbox.checked = false;
    render();
  }
});

getDataFromLocalStorage();
