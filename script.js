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
const warnungElement = document.querySelector("#warnung");

const apiUrl = "http://localhost:4730/todos";
//___________________________________________________________________________________________________
// Fetch funktion
async function loadData() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  state.todos = data;
  render();
}

async function sendData(method, todoData, id = "") {
  const url = apiUrl + "/" + id;
  const response = await fetch(url, {
    method: method,
    headers: {
      "content-type": "application/json",
    },
    body: method !== "DELETE" ? JSON.stringify(todoData) : null,
  });

  await loadData();
}
//______________________________________________________________________________________________________

// erstellung des Todos

function showWarning(message) {
  warnungElement.innerText = message;
  setTimeout(() => {
    warnungElement.innerText = "";
  }, 3000);
}

function addNewTodo() {
  const description = newTodoDescriptionElement.value.trim();
  if (description === "") {
    showWarning("Bitte ein Todo eintragen!!!!!");
    return;
  }

  const todoExists = state.todos.some(
    (todo) => todo.description === description
  );
  if (todoExists) {
    showWarning("Diese Todo existiert bereits!!!!!");
    return;
  }

  const newTodoData = {
    id: "todo" + new Date().getTime(),
    description: description,
    done: false,
  };

  sendData("POST", newTodoData);
  newTodoFormElement.reset();
}

newTodoFormElement.addEventListener("submit", (event) => {
  event.preventDefault();
  addNewTodo();
});

function generateListItem(todoData) {
  const liElement = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todoData.done;
  checkbox.addEventListener("change", () => toggleTodoDone(todoData.id));

  const span = document.createElement("span"); //hmtlfor
  span.innerText = todoData.description;
  if (todoData.done) {
    span.classList.add("strikethrough");
  }
  liElement.appendChild(checkbox);
  liElement.appendChild(span);

  return liElement;
}

//_____________________________________________________________________________________________________
//remove

function playAudio() {
  let audio = new Audio("delete.mp3");
  audio.play();
  audio.volume = 0.25;
}

btn.addEventListener("click", async function () {
  playAudio();
  let filteredTodos = state.todos;
  if (state.currentFilter === "active") {
    filteredTodos = state.todos.filter((todo) => !todo.done);
  } else if (state.currentFilter === "completed") {
    filteredTodos = state.todos.filter((todo) => todo.done);
  }
  for (const todo of filteredTodos) {
    await sendData("DELETE", null, todo.id);
  }
  playAudio();
});

async function toggleTodoDone(id) {
  const todo = state.todos.find((todo) => todo.id === id);
  if (todo) {
    todo.done = !todo.done;
    await sendData("PUT", todo, id);
  }
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

//________________________________________________________________________________________________
//einzelne filter

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

window.addEventListener("load", () => {
  filterAllCheckbox.checked = true;
  state.currentFilter = "all";
  render();
});

loadData();

const btnShow = document.getElementById("show-input-container");

btnShow.addEventListener("click", function () {
  let inputContainer = document.getElementById("new-todo-form");
  if (inputContainer.style.display === "none") {
    inputContainer.style.display = "flex";
    btnShow.classList.add("rotata");
  } else {
    inputContainer.style.display = "none";
    btnShow.classList.remove("rotata");
  }
});
