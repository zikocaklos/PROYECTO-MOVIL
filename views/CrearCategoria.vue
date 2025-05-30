<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" @click="goBack"></ion-back-button>
        </ion-buttons>
        <ion-title>Crear Categoría</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Nueva Categoría</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="crearCategoria">
            <ion-item>
              <ion-label position="stacked">Nombre de la Categoría</ion-label>
              <ion-input v-model="nombreCategoria" required></ion-input>
            </ion-item>
            <ion-button type="submit" expand="block" color="primary" class="mt-2">
              Crear
            </ion-button>
          </form>
          <ion-list>
            <ion-item v-for="cat in categorias" :key="cat.id">
              <ion-label>{{ cat.name }}</ion-label>
              <ion-button slot="end" color="warning" @click="editarCategoria(cat)">Editar</ion-button>
              <ion-button slot="end" color="danger" @click="eliminarCategoria(cat.id)">Eliminar</ion-button>
            </ion-item>
          </ion-list>
          <form v-if="editando" @submit.prevent="guardarEdicion">
            <ion-item>
              <ion-label position="stacked">Editar nombre</ion-label>
              <ion-input v-model="nombreEditado" required></ion-input>
            </ion-item>
            <ion-button type="submit" expand="block" color="success" class="mt-2">
              Guardar
            </ion-button>
            <ion-button expand="block" color="medium" class="mt-2" @click="cancelarEdicion">
              Cancelar
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonButton, IonList, IonButtons, IonBackButton
} from '@ionic/vue';
import axios from 'axios';

const router = useRouter();
const nombreCategoria = ref('');
const categorias = ref([]);
const editando = ref(false);
const idEditando = ref(null);
const nombreEditado = ref('');

const cargarCategorias = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/categories/all');
    categorias.value = res.data;
  } catch (e) {
    categorias.value = [];
  }
};

const crearCategoria = async () => {
  if (!nombreCategoria.value) return;
  try {
    const res = await axios.post('http://localhost:3000/api/categories', {
      name: nombreCategoria.value
    });
    // Algunos backends devuelven el objeto creado bajo otra propiedad, revisa si es res.data.id o res.data.category.id
    const nuevaCategoria = res.data.id
      ? res.data
      : res.data.category
        ? res.data.category
        : res.data[0]
          ? res.data[0]
          : null;

    nombreCategoria.value = '';
    await cargarCategorias();

    // Solo redirige si hay id válido
    if (nuevaCategoria && nuevaCategoria.id) {
      router.push(`/categoria/${nuevaCategoria.id}`);
    } else {
      alert('Categoría creada, pero no se pudo obtener el ID para redirigir.');
    }
  } catch (error) {
    alert(error.response?.data?.message || 'Error al crear la categoría');
  }
};

const editarCategoria = (cat) => {
  editando.value = true;
  idEditando.value = cat.id;
  nombreEditado.value = cat.name;
};

const guardarEdicion = async () => {
  if (!nombreEditado.value || !idEditando.value) return;
  try {
    await axios.put(`http://localhost:3000/api/categories/${idEditando.value}`, {
      name: nombreEditado.value
    });
    editando.value = false;
    idEditando.value = null;
    nombreEditado.value = '';
    await cargarCategorias();
  } catch (e) {
    // Manejo de error opcional
  }
};

const cancelarEdicion = () => {
  editando.value = false;
  idEditando.value = null;
  nombreEditado.value = '';
};

const eliminarCategoria = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/categories/${id}`);
    await cargarCategorias();
  } catch (e) {
    // Manejo de error opcional
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  cargarCategorias();
});
</script>

<style scoped>
.mt-2 {
  margin-top: 16px;
}
</style>