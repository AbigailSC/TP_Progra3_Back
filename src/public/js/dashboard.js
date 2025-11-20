const actividadReciente = [
  { tiempo: 'Hace 5 min', descripcion: 'Nueva venta registrada - $12,500' },
  { tiempo: 'Hace 15 min', descripcion: 'Producto "Buzo Negro" actualizado' },
  { tiempo: 'Hace 1 hora', descripcion: 'Nuevo cliente registrado: María González' },
  { tiempo: 'Hace 2 horas', descripcion: 'Stock actualizado para 5 productos' },
  { tiempo: 'Hace 3 horas', descripcion: 'Venta completada - Orden #1543' }
];

async function validarAuthToken() {
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
    const adminData = {
      nombre: data.data.nombre,
      email: data.data.email
    };
    document.getElementById('admin-nombre').textContent = adminData.nombre;
    document.getElementById('admin-email').textContent = adminData.email;
    document.getElementById('admin-inicial').textContent = adminData.nombre.charAt(0);
    return true;
  } else {
    return false;
  }
}

function generarUltimos7dais() {
  const dias = [];
  const nombresDias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    const diaSemana = fecha.getDay();

    dias.push({
      fecha: fecha.toISOString().split('T')[0],
      dia: nombresDias[diaSemana],
      monto: 0
    });
  }
  return dias;
}

async function getVentasSemanales() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:4000/api/admin/ventas-semanales`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      method: 'GET'
    });
    const data = await response.json();

    return data.ventasSemanales;
  } catch (error) {
    console.error('Error al obtener las ventas semanales:', error);
  }
}

async function generarArrayVentas() {
  const ventasSemanales = await getVentasSemanales();
  const ultimos7Dias = generarUltimos7dais();

  const ventasMapeadas = ultimos7Dias.map((dia) => {
    const ventaEncontrada = ventasSemanales.find((venta) => {
      const fechaDb = new Date(venta.fecha).toISOString().split('T')[0];
      return fechaDb === dia.fecha;
    })

    return {
      fecha: dia.fecha,
      dia: dia.dia,
      monto: ventaEncontrada ? parseFloat(ventaEncontrada.monto) : 0
    }
  });
  return ventasMapeadas;
}

async function renderChart() {
  const ventasSemanales = await generarArrayVentas();
  const chartContainer = document.getElementById('ventas-chart');
  const maxMonto = Math.max(...ventasSemanales.map(v => v.monto)); // monto maximo de las barras

  chartContainer.innerHTML = ventasSemanales.map((venta) => {
    const altura = (venta.monto / maxMonto) * 100;
    return `
      <div class="bar" style="height: ${altura}%">
        <div class="bar-value">$${(venta.monto / 1000).toFixed(0)}k</div>
        <div class="bar-label">${venta.dia}</div>
      </div>
    `;
  }).join('');
}

// function renderActivity() {
//   const activityContainer = document.getElementById('actividad-container');
//   activityContainer.innerHTML = actividadReciente.map(item => `
//     <div class="activity-item">
//       <div class="activity-time">${item.tiempo}</div>
//       <div class="activity-description">${item.descripcion}</div>
//     </div>
//   `).join('');
// }

async function cargarEstadisticas() {
  try {
    console.log('Dashboard cargado');
  } catch (error) {
    console.error('Error cargando estadísticas:', error);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  const authValid = await validarAuthToken();
  if (!authValid) {
    window.location.href = '/api/admin/login-view';
    return;
  }
  renderChart();
  //renderActivity();
  cargarEstadisticas();
});