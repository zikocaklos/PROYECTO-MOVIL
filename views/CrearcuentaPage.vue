<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center dark-background">
      <div class="logo-container">
        <h1 class="logo-text">Crear Cuenta</h1>
      </div>

      <form @submit.prevent="handleRegister" class="form-box">
        <ion-item class="input-item">
          <ion-label position="stacked" class="label">Nombre</ion-label>
          <ion-input v-model="name" type="text" placeholder="Ingresa tu nombre" required class="input"></ion-input>
        </ion-item>

        <ion-item class="input-item">
          <ion-label position="stacked" class="label">Correo Electrónico</ion-label>
          <ion-input v-model="email" type="email" placeholder="Ingresa tu correo" required class="input"></ion-input>
        </ion-item>

        <ion-item class="input-item">
          <ion-label position="stacked" class="label">Contraseña</ion-label>
          <ion-input v-model="password" type="password" placeholder="Ingresa tu contraseña" required class="input"></ion-input>
        </ion-item>

        <ion-button type="submit" expand="block" color="primary" :disabled="isLoading" class="submit-button">
          {{ isLoading ? 'Registrando...' : 'Crear Cuenta' }}
        </ion-button>
      </form>

      <ion-text>
        <p>
          ¿Ya tienes cuenta?
          <router-link to="/login" class="link">Iniciar sesión</router-link>
        </p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText,
} from '@ionic/vue';

const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    showError('Por favor, ingresa todos los campos');
    return;
  }

  isLoading.value = true;

  try {
    // Envía el campo correcto "name"
    const response = await fetch('https://gastocontrol-backend.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar');
    }

    alert('Registro exitoso. Ahora inicia sesión.');
    router.push('/login');
  } catch (error) {
    showError(error.message || 'Error al registrar');
  } finally {
    isLoading.value = false;
  }
};

const showError = (message) => {
  alert(message);
};
</script>

<style scoped>
.dark-background {
  --background: linear-gradient(135deg, #0d3b66 0%, #1d1f25 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container {
  margin-top: 7vh;
  margin-bottom: 3vh;
}

.logo-text {
  font-size: 2.3rem;
  font-weight: bold;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #0d3b66 60%, #1c658c 100%);
  padding: 18px 0 18px 0;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 4px 16px rgba(13, 59, 102, 0.10);
}

.form-box {
  background: rgba(30, 40, 60, 0.92);
  border-radius: 0 0 18px 18px;
  padding: 32px 18px 24px 18px;
  max-width: 410px;
  margin: 0 auto 18px auto;
  box-shadow: 0 8px 32px rgba(13, 59, 102, 0.18);
}

.input-item {
  margin-bottom: 22px;
  background: transparent;
  --background: transparent;
  border-radius: 10px;
}

.input {
  color: #fff;
  background-color: #22304a;
  border-radius: 10px;
  padding: 16px 12px;
  font-size: 1.1rem;
  border: 1.5px solid #1c658c;
  box-shadow: 0 2px 8px rgba(13, 59, 102, 0.08);
  transition: border 0.2s;
}

.input:focus-within {
  border: 2px solid #0d3b66;
}

.label {
  color: #b3c7e6;
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 1rem;
}

.submit-button {
  font-size: 1.1rem;
  padding: 16px 0;
  border-radius: 10px;
  background: linear-gradient(90deg, #0d3b66, #1c658c);
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(13, 59, 102, 0.15);
  border: none;
  transition: background 0.3s, box-shadow 0.3s;
  margin-top: 10px;
  letter-spacing: 1px;
}

.submit-button:disabled {
  background: #555;
  opacity: 0.7;
  box-shadow: none;
}

ion-text p {
  margin-top: 24px;
  font-size: 15px;
  color: #b3c7e6;
}

.link {
  color: #00b4d8;
  font-weight: bold;
  text-decoration: underline;
  transition: color 0.2s;
  margin-left: 4px;
}

.link:hover {
  color: #48cae4;
}

@media (max-width: 600px) {
  .logo-container {
    margin-top: 4vh;
    margin-bottom: 2vh;
  }
  .logo-text {
    font-size: 1.5rem;
    padding: 12px 0;
  }
  .form-box {
    padding: 18px 4px 14px 4px;
    max-width: 98vw;
  }
  .input {
    font-size: 1rem;
    padding: 12px 8px;
  }
  .submit-button {
    font-size: 1rem;
    padding: 12px 0;
  }
  ion-text p {
    font-size: 13px;
  }
}
</style>