const ventasSemanales = [
  { dia: 'Lun', monto: 15000 },
  { dia: 'Mar', monto: 22000 },
  { dia: 'Mié', monto: 18000 },
  { dia: 'Jue', monto: 28000 },
  { dia: 'Vie', monto: 35000 },
  { dia: 'Sáb', monto: 42000 },
  { dia: 'Dom', monto: 25000 }
];

const actividadReciente = [
  { tiempo: 'Hace 5 min', descripcion: 'Nueva venta registrada - $12,500' },
  { tiempo: 'Hace 15 min', descripcion: 'Producto "Buzo Negro" actualizado' },
  { tiempo: 'Hace 1 hora', descripcion: 'Nuevo cliente registrado: María González' },
  { tiempo: 'Hace 2 horas', descripcion: 'Stock actualizado para 5 productos' },
  { tiempo: 'Hace 3 horas', descripcion: 'Venta completada - Orden #1543' }
];

async function cargarDatosAdmin() {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/auth/profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const { data } = await response.json();

  const adminData = {
    nombre: data.nombre,
    email: data.email
  };

  document.getElementById('admin-nombre').textContent = adminData.nombre;
  document.getElementById('admin-email').textContent = adminData.email;
  document.getElementById('admin-inicial').textContent = adminData.nombre.charAt(0);
}

function renderChart() {
  const chartContainer = document.getElementById('ventas-chart');
  const maxMonto = Math.max(...ventasSemanales.map(v => v.monto));

  chartContainer.innerHTML = ventasSemanales.map(venta => {
    const altura = (venta.monto / maxMonto) * 100;
    return `
          <div class="bar" style="height: ${altura}%">
            <div class="bar-value">$${(venta.monto / 1000).toFixed(0)}k</div>
            <div class="bar-label">${venta.dia}</div>
          </div>
        `;
  }).join('');
}

function renderActivity() {
  const activityContainer = document.getElementById('actividad-container');
  activityContainer.innerHTML = actividadReciente.map(item => `
        <div class="activity-item">
          <div class="activity-time">${item.tiempo}</div>
          <div class="activity-description">${item.descripcion}</div>
        </div>
      `).join('');
}

async function cargarEstadisticas() {
  try {
    console.log('Dashboard cargado');
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/api/admin/login-view';
    return;
  }
  cargarDatosAdmin();
  renderChart();
  renderActivity();
  cargarEstadisticas();
});