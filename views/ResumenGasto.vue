<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Resumen de Gastos Mensual</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Mes</ion-label>
        <ion-input v-model="mes" type="number" min="1" max="12"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">Año</ion-label>
        <ion-input v-model="anio" type="number" min="2000" max="2100"></ion-input>
      </ion-item>
      <ion-button expand="block" color="primary" class="mt-2" @click="cargarResumen">
        Ver Resumen
      </ion-button>
      <ion-list v-if="resumen.length">
        <ion-item v-for="cat in resumen" :key="cat.categoryId">
          <ion-label>
            <strong>{{ cat.categoryName }}</strong>: ${{ cat.totalAmount }}
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-card class="mt-2" v-if="gastos.length">
        <ion-card-header>
          <ion-card-title>Tabla de Gastos</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <table class="gastos-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="gasto in gastos" :key="gasto.id">
                <td>{{ gasto.description }}</td>
                <td>{{ getCategoryName(gasto.categoryId) }}</td>
                <td>{{ formatCurrency(gasto.amount) }}</td>
                <td>{{ gasto.spentAt }}</td>
              </tr>
            </tbody>
          </table>
        </ion-card-content>
      </ion-card>
      <ion-button expand="block" color="success" class="mt-2" @click="exportarGastos">
        Descargar gastos en Excel
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent
} from '@ionic/vue';
import axios from 'axios';
// Importa Filesystem y Directory de Capacitor
import { Filesystem, Directory } from '@capacitor/filesystem';

const BASE_URL = 'https://gastocontrol-backend.onrender.com/api';

const mes = ref(new Date().getMonth() + 1);
const anio = ref(new Date().getFullYear());
const resumen = ref([]);
const gastos = ref([]);
const categorias = ref([]);

const cargarResumen = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/summary/monthly?month=${mes.value}&year=${anio.value}`);
    resumen.value = res.data || [];
    await cargarGastos();
    await cargarCategorias();
  } catch (e) {
    resumen.value = [];
    gastos.value = [];
    categorias.value = [];
    console.error('Error cargando resumen:', e);
  }
};

const cargarGastos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/expenses`);
    gastos.value = res.data.filter(g => {
      const fecha = new Date(g.spentAt);
      return fecha.getMonth() + 1 === Number(mes.value) && fecha.getFullYear() === Number(anio.value);
    });
  } catch (e) {
    gastos.value = [];
    console.error('Error cargando gastos:', e);
  }
};

const cargarCategorias = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/categories/all`);
    categorias.value = res.data;
  } catch (e) {
    categorias.value = [];
    console.error('Error cargando categorías:', e);
  }
};

const getCategoryName = (categoryId) => {
  const cat = categorias.value.find(c => c.id === categoryId);
  return cat ? cat.name : '';
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
};

// Si tu app es móvil (APK/Capacitor), instala el paquete ejecutando en la terminal:
// npm install @capacitor/filesystem
// npx cap sync

// Si solo usas web, usa este método para descargar el Excel:
const exportarGastos = async () => {
  try {
    // Incluye los parámetros de mes y año para filtrar los gastos del mes/año seleccionados
    const response = await axios.get(
      `${BASE_URL}/expenses/export/excel?month=${mes.value}&year=${anio.value}`,
      { responseType: 'blob' }
    );

    // Si estás en móvil (Capacitor), guarda el archivo con Filesystem
    if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
      // Convertir blob a base64
      const toBase64 = (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

      const base64 = await toBase64(response.data);

      await Filesystem.writeFile({
        path: 'gastos.xlsx',
        data: base64,
        directory: Directory.Documents
      });

      alert('Archivo Excel guardado en tus documentos.');
    } else {
      // Web: descarga normal
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'gastos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    console.error('Error descargando Excel:', error);
    alert('Error al descargar el archivo Excel');
  }
};
</script>


<style scoped>
.mt-2 {
  margin-top: 16px;
}
.gastos-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: #181824;
  color: #fff;
}
.gastos-table th, .gastos-table td {
  border: 1px solid #35355a;
  padding: 8px 6px;
  text-align: left;
}
.gastos-table th {
  background: #23233a;
  color: #fff;
}
.gastos-table tr:nth-child(even) {
  background: #23233a;
}
.gastos-table tr:nth-child(odd) {
  background: #181824;
}
body.dark .gastos-table,
.dark-theme .gastos-table {
  background: #23233a;
  color: #fff;
}
body.dark .gastos-table th,
.dark-theme .gastos-table th {
  background: #23233a;
  color: #fff;
}
body.dark .gastos-table tr:nth-child(even),
.dark-theme .gastos-table tr:nth-child(even) {
  background: #181824;
}
</style>
