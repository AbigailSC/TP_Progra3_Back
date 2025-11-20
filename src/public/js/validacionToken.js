export async function validarToken() {
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
    return true;
  } else {
    return false;
  }
}