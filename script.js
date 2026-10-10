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
    list.appendChild(createItem(todo));
  }
}

function createItem(todo) {
  const item = document.createElement('li');
  if (todo.done) item.classList.add('done');

  // Only the checkbox itself toggles done — the text is for editing.
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.setAttribute('aria-label', `Mark done: ${todo.text}`);
  checkbox.addEventListener('change', () => {
    todo.done = checkbox.checked;
    item.classList.toggle('done', todo.done);
    saveTodos();
  });

  // A button styled as plain text, so it also works with the keyboard.
  const text = document.createElement('button');
  text.type = 'button';
  text.className = 'task-text';
  text.textContent = todo.text;
  text.title = 'Click to edit';
  text.addEventListener('click', () => startEditing(todo, item));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.setAttribute('aria-label', `Delete task: ${todo.text}`);
  deleteButton.addEventListener('click', () => deleteTodo(todo, item, '.delete-button'));

  item.append(checkbox, text, deleteButton);
  return item;
}

// Remove a task. If focusSelector is given, move focus to that element in a
// neighbouring task (or the new-task input) so keyboard users don't lose their place.
function deleteTodo(todo, item, focusSelector) {
  todos = todos.filter((t) => t.id !== todo.id);
  saveTodos();

  const neighbour = item.nextElementSibling || item.previousElementSibling;
  item.remove();
  if (focusSelector) {
    (neighbour ? neighbour.querySelector(focusSelector) : input).focus();
  }
}

// Swap the row's contents for a text field. Enter or clicking away saves,
// Escape cancels. Saving empty text deletes the task.
function startEditing(todo, item) {
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = todo.text;
  editInput.setAttribute('aria-label', 'Edit task');

  let finished = false;
  function finish(save, keepFocus) {
    if (finished) return;
    finished = true;

    const newText = editInput.value.trim();
    if (save && !newText) {
      deleteTodo(todo, item, keepFocus ? '.task-text' : null);
      return;
    }
    if (save && newText !== todo.text) {
      todo.text = newText;
      saveTodos();
    }

    const newItem = createItem(todo);
    item.replaceWith(newItem);
    if (keepFocus) newItem.querySelector('.task-text').focus();
  }

  editInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== 'Escape') return;
    // Without this, the same keypress would "click" the task text button that
    // receives focus below, immediately reopening the editor.
    event.preventDefault();
    finish(event.key === 'Enter', true);
  });
  // Clicking elsewhere saves, but leaves focus wherever the user clicked.
  editInput.addEventListener('blur', () => finish(true, false));

  item.replaceChildren(editInput);
  editInput.focus();
  editInput.select();
}

// Theme: follows the system setting until the user flips the switch,
// then their choice is saved and used from then on.
const THEME_KEY = 'theme';
const themeToggle = document.getElementById('theme-toggle');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

function currentTheme() {
  return document.documentElement.dataset.theme || (systemDark.matches ? 'dark' : 'light');
}

function updateToggle() {
  themeToggle.setAttribute('aria-checked', String(currentTheme() === 'dark'));
}

themeToggle.addEventListener('click', () => {
  const theme = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage unavailable — the theme still changes for this visit.
  }
  updateToggle();
});

// If the user hasn't picked a theme, keep the switch in sync with the system.
systemDark.addEventListener('change', updateToggle);

updateToggle();

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
