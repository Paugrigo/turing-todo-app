const STORAGE_KEY = 'todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = loadTodos();

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Storage unavailable (e.g. private mode) — tasks stay in memory only.
  }
}

function render() {
  list.innerHTML = '';
  for (const todo of todos) {
    const item = document.createElement('li');
    if (todo.done) item.classList.add('done');

    // Wrapping the checkbox in a label makes the text clickable too.
    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', () => {
      todo.done = checkbox.checked;
      item.classList.toggle('done', todo.done);
      saveTodos();
    });

    const text = document.createElement('span');
    text.textContent = todo.text;

    label.append(checkbox, text);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete task: ${todo.text}`);
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((t) => t.id !== todo.id);
      saveTodos();

      // Move focus to a neighbouring task so keyboard users don't lose their place.
      const neighbour = item.nextElementSibling || item.previousElementSibling;
      item.remove();
      (neighbour ? neighbour.querySelector('.delete-button') : input).focus();
    });

    item.append(label, deleteButton);
    list.appendChild(item);
  }
}

// A form submit fires on both Enter in the input and clicking Add.
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text, done: false });
  saveTodos();
  render();

  input.value = '';
  input.focus();
});

render();
