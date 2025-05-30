export async function login({ email, password }) {
  // Simulación de llamada a API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === '1234') {
        resolve({
          data: {
            // token eliminado
            message: 'Inicio de sesión exitoso'
          }
        });
      } else {
        const error = new Error('Credenciales incorrectas');
        error.response = { data: { message: 'Credenciales incorrectas' } };
        reject(error);
      }
    }, 500); // Simula retardo de red
  });
}