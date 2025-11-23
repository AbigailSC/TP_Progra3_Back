import { renderPaginacion } from './paginacion.js';
import { validarToken } from './validacionToken.js';

let administradores = [];
const API_BASE = '/api';

const crearAdminBtn = document.querySelector('.new-admin');
const volverDashboardBtn = document.querySelector('.volver-dashboard');

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();
  if (usuarioValido) {
    await cargarAdmins();
    crearAdminBtn.addEventListener('click', crearAdmin);
    volverDashboardBtn.addEventListener('click', volverDashboard);
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }
});

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type} show`;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

async function cargarAdmins(pagina = 1) {
  const loading = document.getElementById('loading');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  loading.style.display = 'block';
  tableContainer.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/usuarios?page=${pagina}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      window.location.href = '/api/admin/login-view';
      return;
    }

    if (!response.ok) {
      throw new Error('Error al obtener los administradores');
    }

    const { data } = await response.json();

    administradores = data?.usuarios || [];

    mostrarAdmins();
    renderPaginacion(data.pagination);
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    showAlert('Error al cargar los ventas', 'error');
    emptyState.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

function mostrarAdmins() {
  const tbody = document.getElementById('administradoresBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  tbody.innerHTML = '';
  administradores.forEach(admin => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${admin.id}</td>
      <td>${admin.nombre}</td>
      <td>${admin.email}</td>
      <td>${new Date(admin.created_at).toLocaleDateString('es-AR')}</td>
      <td>${new Date(admin.updated_at).toLocaleDateString('es-AR')}</td>
      <td>${admin.created_by}</td>
      <td>${admin.updated_by}</td>
      <td>
        <div style="display: flex; gap: 5px;">
          <button class="btn btn-primary btn-small btn-editar" data-id="${admin.id}">
            Editar
          </button>
          <button class="btn btn-danger btn-small btn-eliminar" data-id="${admin.id}">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
}

async function crearAdmin() {
  document.getElementById('creacionLoading').style.display = 'none';
  document.getElementById('creacionContent').style.display = 'block';

  const nombreInput = document.getElementById('creacionNombre');
  const emailInput = document.getElementById('creacionEmail');
  const passwordInput = document.getElementById('creacionPassword');
  const form = document.getElementById('formCreacion');

  abrirModal('modalCreacion');

  async function handleSubmit(event) {
    event.preventDefault();
    const nombre = nombreInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre, email, password, admin: true })
      });
      const { data } = await response.json();

      if (data.status === 201) {
        showAlert('Administrador creado correctamente', 'success');
        cerrarModal('modalCreacion');
        await cargarAdmins();
      } else {
        showAlert('Error al crear administrador: ' + data.errors[0], 'error');
      }
    } catch (error) {
      console.error('Error al crear el admin:', error);
    }
  }
  form.onsubmit = handleSubmit;
}

async function editarAdmin(id) {
  document.getElementById('edicionVentaId').textContent = id;
  document.getElementById('edicionLoading').style.display = 'none';
  document.getElementById('edicionContent').style.display = 'block';
  const nuevoPassword = document.getElementById('edicionPassword');
  const nuevoNombre = document.getElementById('edicionEstado');

  const form = document.getElementById('formEdicion');

  abrirModal('modalEdicion');

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre: nuevoNombre.value, password: nuevoPassword.value })
      });

      const data = await response.json();

      if (data.status === 200) {
        showAlert('Administrador actualizado correctamente', 'success');
        cerrarModal('modalEdicion');
        await cargarAdmins();
      } else {
        showAlert('Error al actualizar el administrador: ' + data.errors[0], 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      showAlert('Error al actualizar el admin: ' + error.message, 'error');
    }
  }

  form.onsubmit = handleSubmit;
}

async function eliminarAdmin(id) {
  console.log("🚀 ~ eliminarAdmin ~ id:", id)

  if (!confirm('¿Estás seguro de que deseas eliminar este administrador?')) {
    return;
  } else {
    try {
      const response = await fetch(`${API_BASE}/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.status === 200) {
        showAlert('Administrador eliminado correctamente', 'success');
        await cargarAdmins();
      } else {
        showAlert('Error al eliminar el administrador: ' + data.errors[0], 'error');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      showAlert('Error al eliminar el admin: ' + error.message, 'error');
    }
  }
}

function abrirModal(id) {
  document.getElementById(id).classList.add('show');
}

function cerrarModal(id) {
  document.getElementById(id).classList.remove('show');
}

function volverDashboard() {
  window.location.href = '/api/admin/dashboard-view';
}

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('administradoresBody');

  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.classList.contains('btn-editar')) {
      await editarAdmin(id);
    }

    if (btn.classList.contains('btn-eliminar')) {
      await eliminarAdmin(id);
    }
  });
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-close-modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      cerrarModal(modal.id);
    }
  }
});