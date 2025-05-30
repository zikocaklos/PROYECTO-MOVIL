<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <ion-page>
    <ion-content class="ion-padding ion-text-center">
      <div class="logo-container">
        <h1 class="logo-text">Iniciar Sesión</h1>
      </div>

      <ion-item>
        <ion-label position="stacked">Correo Electrónico</ion-label>
        <ion-input v-model="email" type="email" placeholder="Ingresa tu correo" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Contraseña</ion-label>
        <ion-input v-model="password" type="password" placeholder="Ingresa tu contraseña" required></ion-input>
      </ion-item>

      <ion-button expand="block" color="primary" @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
      </ion-button>

      <ion-text>
        <p>
          ¿No tienes cuenta?
          <router-link to="/crearcuenta">Crear una cuenta</router-link>
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
const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Por favor, ingresa todos los campos');
    return;
  }

  isLoading.value = true;

  try {
    const response = await fetch('https://gastocontrol-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Credenciales incorrectas');
    }

    // Si tu backend retorna un token o usuario, puedes guardarlo aquí si lo necesitas
    // const data = await response.json();

    await router.push('/home');
  } catch (error) {
    alert(error.message || 'Error al iniciar sesión');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.logo-container {
  margin-top: 20vh;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 3rem;
  font-weight: bold;
  color: #0d3b66;
}

ion-item {
  margin-bottom: 20px;
}

ion-button {
  margin-top: 20px;
}

ion-text p {
  margin-top: 20px;
  font-size: 14px;
}

router-link {
  color: #0d3b66;
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
}
</style>
