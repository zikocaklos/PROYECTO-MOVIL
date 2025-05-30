<template>
  <ion-page>
    <ion-content class="welcome-bg" fullscreen>
      <div class="welcome-container">
        <div class="logo-circle">
          <img
            src="c:\Users\julia\AppData\Local\Packages\5319275A.WhatsAppDesktop_cv1g1gvanyjgm\TempState\E6CB2A3C14431B55AA50C06529EAA21B\Imagen de WhatsApp 2025-05-23 a las 18.11.02_f420a18f.jpg"
            alt="Logo GastoControl"
            class="logo-img"
          />
        </div>
        <h1 class="app-title">Finanzas</h1>
        <p class="tagline">Bienvenido a tu app de gestión financiera</p>
        <ion-button expand="block" color="success" class="welcome-button" @click="goToLogin">
          INICIAR SESIÓN
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useRouter } from 'vue-router'; // ✅ Importar useRouter

const router = useRouter(); // ✅ Definir router

const goToLogin = () => {
  router.push('/login'); // ✅ Redirige correctamente
};
</script>

<style scoped>
.welcome-bg {
  --background: linear-gradient(180deg, #00264d, #004080 80%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  min-height: 400px;
  max-width: 400px;
  width: 100%;
  margin: auto;
  background: transparent;
  box-shadow: none;
  text-align: center;
}

.logo-circle {
  background: #fff;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  box-shadow: 0 4px 24px rgba(13, 59, 102, 0.15);
  overflow: hidden;
}

.logo-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}

.app-title {
  font-size: 2.7rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 14px;
  letter-spacing: 2px;
}

.tagline {
  color: #b0d4f1;
  font-size: 1.2rem;
  margin-bottom: 38px;
  font-weight: 500;
}

.welcome-button {
  font-weight: bold;
  border-radius: 18px;
  font-size: 1.2rem;
  letter-spacing: 1px;
  box-shadow: 0 2px 8px rgba(13, 59, 102, 0.08);
  width: 90%;
  margin-top: 18px;
  padding: 18px 0;
}

@media (max-width: 600px) {
  .welcome-container {
    padding: 0 8px;
    max-width: 98vw;
    height: 80vh;
    min-height: 300px;
  }
  .logo-circle {
    width: 60px;
    height: 60px;
  }
  .logo-img {
    width: 50px;
    height: 50px;
  }
  .app-title {
    font-size: 2rem;
  }
}
</style>
