import { renderPaginacion } from './paginacion.js';

let ventas = [];
const API_BASE = '/api';

window.addEventListener('DOMContentLoaded', async () => {
  const exportBtn = document.querySelector('.generar-reporte');

  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (data.status !== 401) {
    await cargarVentas();
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }

  exportBtn.addEventListener('click', exportarReporte);
});

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type} show`;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}

async function cargarVentas() {
  const loading = document.getElementById('loading');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');

  loading.style.display = 'block';
  tableContainer.style.display = 'none';
  emptyState.style.display = 'none';

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/ventas`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      window.location.href = '/api/admin/login-view';
      return;
    }

    const { data } = await response.json();
    console.log("🚀 ~ cargarVentas ~ data:", data)

    ventas = data?.ventas || [];

    mostrarVentas();
    renderPaginacion(data.pagination);
  } catch (error) {
    console.error('Error al cargar ventas:', error);
    showAlert('Error al cargar los ventas', 'error');
    emptyState.style.display = 'block';
  } finally {
    loading.style.display = 'none';
  }
}

function mostrarVentas() {
  const tbody = document.getElementById('productosBody');
  const tableContainer = document.getElementById('tableContainer');
  const emptyState = document.getElementById('emptyState');
  const filtro = document.getElementById('filtroEstado').value;

  let ventasFiltrados = ventas;

  // Aplicar filtro
  if (filtro === 'activo') {
    ventasFiltrados = productos.filter(p => p.activo === 1 || p.activo === true);
  } else if (filtro === 'inactivo') {
    ventasFiltrados = productos.filter(p => p.activo === 0 || p.activo === false);
  }

  if (ventasFiltrados.length === 0) {
    tableContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  console.log("🚀 ~ mostrarVentas ~ ventasFiltrados:", ventasFiltrados)

  tbody.innerHTML = '';
  ventasFiltrados.forEach(venta => {
    let badgeEstado;
    switch (venta.estado.toLowerCase()) {
      case 'pendiente':
        badgeEstado = 'badge-pendiente';
        break;
      case 'procesando':
        badgeEstado = 'badge-procesando';
        break;
      case 'completado':
        badgeEstado = 'badge-completado';
        break;
      default:
        badgeEstado = 'badge-cancelado';
    }
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${venta.id}</td>
            <td>${venta.cliente_nombre || 'Invitado'}</td>
            <td>${venta.metodo_pago.charAt(0).toUpperCase() + venta.metodo_pago.slice(1).toLowerCase()}</td>
            <td>$${Number(venta.total).toLocaleString()}</td>
            <td>${new Date(venta.created_at).toLocaleDateString('es-AR')}</td>
            <td>
              <span class="badge ${badgeEstado}">
                ${venta.estado.charAt(0).toUpperCase() + venta.estado.slice(1).toLowerCase()}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 5px;">
                <button class="btn btn-primary btn-small" onclick="editarVenta(${venta.id})">
                  Editar
                </button>
                <div style="display: flex; gap: 5px;">
                  <button class="btn btn-secondary btn-small" onclick="verDetalles(${venta.id})">
                    Ver detalles
                  </button>
                </div>
              </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  tableContainer.style.display = 'block';
  emptyState.style.display = 'none';
}

async function exportarReporte(e) {
  const token = localStorage.getItem('token');
  try {
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = 'Exportando...';
    button.disabled = true;

    const response = await fetch('/api/admin/export-ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al exportar el reporte');
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    const filename = `reporte_ventas ${new Date().toISOString().split('T')[0]} .xlsx`;

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    button.textContent = originalText;
    button.disabled = false;

    showAlert('Reporte exportado exitosamente', 'success');
  } catch (error) {
    console.error('Error al descargar el reporte de ventas:', error);
    showAlert('Error al descargar el reporte de ventas', 'error');
  }
}

function editarProducto(id) {
  window.location.href = `/api/admin/producto-form?id=${id}`;
}

function confirmarEliminar(id) {
  mostrarModal(
    'Confirmar eliminación',
    '¿Está seguro de que desea eliminar este producto? El producto pasará a estado inactivo.',
    () => eliminarProducto(id)
  );
}

function confirmarActivar(id) {
  mostrarModal(
    'Confirmar activación',
    '¿Está seguro de que desea activar este producto?',
    () => activarProducto(id)
  );
}

async function eliminarProducto(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Producto eliminado exitosamente', 'success');
      await cargarVentas();
    } else {
      showAlert(data.message || 'Error al eliminar el producto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al eliminar el producto', 'error');
  } finally {
    cerrarModal();
  }
}

async function activarProducto(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activo: 1 })
    });

    const data = await response.json();

    if (response.ok) {
      showAlert('Producto activado exitosamente', 'success');
      await cargarVentas();
    } else {
      showAlert(data.message || 'Error al activar el producto', 'error');
    }
  } catch (error) {
    console.error('Error:', error);
    showAlert('Error al activar el producto', 'error');
  } finally {
    cerrarModal();
  }
}

function mostrarModal(titulo, mensaje, callback) {
  const modal = document.getElementById('modalConfirm');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const btnConfirmar = document.getElementById('btnConfirmar');

  modalTitle.textContent = titulo;
  modalMessage.textContent = mensaje;

  // Remover listeners anteriores
  const newBtn = btnConfirmar.cloneNode(true);
  btnConfirmar.parentNode.replaceChild(newBtn, btnConfirmar);

  newBtn.addEventListener('click', callback);

  modal.classList.add('show');
}

function cerrarModal() {
  const modal = document.getElementById('modalConfirm');
  modal.classList.remove('show');
}

function volverDashboard() {
  window.location.href = '/api/admin/dashboard-view';
}

// Cerrar modal al hacer clic fuera
document.getElementById('modalConfirm').addEventListener('click', (e) => {
  if (e.target.id === 'modalConfirm') {
    cerrarModal();
  }
});
