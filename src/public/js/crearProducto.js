import { validarToken } from './validacionToken.js';

const volverDashboardBtn = document.querySelector('.volver-dashboard');
const btnImg = document.querySelector('.btn-upload-img');

const submitForm = document.querySelector('#crearProducto');
const tituloProducto = document.querySelector('#titulo');
const skuProducto = document.querySelector('#sku');
const precioProducto = document.querySelector('#precio');
const stockProducto = document.querySelector('#stock');
const tipoProducto = document.querySelector('#id_tipo');
const descripcionProducto = document.querySelector('#descripcion');

window.addEventListener('DOMContentLoaded', async () => {
  const usuarioValido = await validarToken();
  if (usuarioValido) {
    btnImg.disabled = true;
    volverDashboardBtn.addEventListener('click', volverDashboard);
  } else {
    window.location.href = '/api/admin/login-view';
    return;
  }
});

function volverDashboard() {
  window.location.href = '/api/admin/dashboard-view';
};

function validarDatos(data) {
  if (!data.titulo || data.titulo.trim() === "") {
    return { valido: false, msg: "El título es obligatorio." };
  }
  if (!data.sku || data.sku.trim() === "") {
    return { valido: false, msg: "El SKU es obligatorio." };
  }
  if (!data.precio || parseFloat(data.precio) <= 0) {
    return { valido: false, msg: "El precio debe ser mayor a 0." };
  }
  if (!data.stock || parseInt(data.stock) < 0) {
    return { valido: false, msg: "El stock no puede ser negativo." };
  }
  return { valido: true, msg: "" };
};

async function guardarProducto(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('mensajeError');
  errorDiv.style.display = 'none';

  const dataProducto = {
    titulo: tituloProducto.value,
    sku: skuProducto.value,
    precio: parseFloat(precioProducto.value),
    stock: parseInt(stockProducto.value),
    id_tipo: parseInt(tipoProducto.value),
    id_usuario: obtenerIdAdmin(),
    descripcion: descripcionProducto.value || null
  }

  const validacion = validarDatos(dataProducto);

  if (!validacion.valido) {
    errorDiv.innerText = validacion.msg;
    errorDiv.style.display = 'block';
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/productos/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataProducto)
    });

    const data = await response.json();
    console.log("🚀 ~ guardarProducto ~ data:", data)

    showAlert('Producto creado correctamente', 'success');
  } catch (error) {
    showAlert('Error al crear producto: ' + data.errors[0], 'error');
  }
};

async function obtenerIdAdmin() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/auth/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const { data } = await response.json();
    return data.id;
  } catch (error) {
    console.log(error);
  }
};

function showAlert(message, type = 'success') {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  alert.className = `alert alert-${type} show`;

  setTimeout(() => {
    alert.classList.remove('show');
  }, 5000);
}