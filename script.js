const clientListContainer = document.getElementById('client-list');
const emptyState = document.getElementById('empty-state');
const editIndexInput = document.getElementById('edit-index');

// Retrieve clients from localStorage
function getClients() {
  return JSON.parse(localStorage.getItem('clients') || '[]');
}

// Save clients to localStorage
function saveClients(clients) {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Render clients to DOM
function renderClients(filter = '') {
  const clients = getClients();
  clientListContainer.innerHTML = '';

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    filtered.forEach((client, index) => {
      const div = document.createElement('div');
      div.className = 'client';
      div.innerHTML = `
        <span class="name">${client.name}</span>
        <span class="phone">${client.phone}</span>
        <button class="copy-btn" data-index="${index}">Copy</button>
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">🗑</button>
      `;
      clientListContainer.appendChild(div);
    });
  }

  attachActionHandlers();
}

// Attach handlers for copy, edit, delete buttons
function attachActionHandlers() {
  // Copy
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', () => {
      const phone = button.previousElementSibling.textContent.trim();
      navigator.clipboard.writeText(phone).then(() => {
        alert(`Copied: ${phone}`);
      });
    });
  });

  // Edit
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      const client = getClients()[index];
      document.getElementById('name').value = client.name;
      document.getElementById('phone').value = client.phone;
      editIndexInput.value = index;
      modal.style.display = 'block';
    });
  });

  // Delete
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
      const index = button.dataset.index;
      if (confirm('Delete this number?')) {
        const clients = getClients();
        clients.splice(index, 1);
        saveClients(clients);
        renderClients(searchInput.value);
      }
    });
  });
}

// Handle Add/Edit Client form submit
document.getElementById('add-client-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const editIndex = editIndexInput.value;

  if (!name || !phone) return;

  const clients = getClients();

  if (editIndex === '') {
    // Add new
    clients.push({ name, phone });
  } else {
    // Update existing
    clients[editIndex] = { name, phone };
    editIndexInput.value = '';
  }

  saveClients(clients);
  renderClients(searchInput.value);
  modal.style.display = 'none';
  e.target.reset();
});

// Modal logic
const modal = document.getElementById('modal');
document.getElementById('add-client-btn').onclick = () => {
  document.getElementById('add-client-form').reset();
  editIndexInput.value = '';
  modal.style.display = 'block';
  setTimeout(() => document.getElementById('name')?.focus(), 50);
};
document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

// Search & clear logic
const searchInput = document.getElementById('search');
const clearBtn = document.getElementById('clear-search');
searchInput.addEventListener('input', () => renderClients(searchInput.value));
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  renderClients();
});

// Initial load
renderClients();





