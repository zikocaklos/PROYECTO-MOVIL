<template>
  <ion-page :class="themeClass">
    <ion-header>
      <ion-toolbar>
        <ion-title>Bienvenido a GastoContro</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="toggleTheme">
            <ion-icon :icon="themeIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Solo mostrar COP -->
    

      <ion-card>
        <ion-card-header>
          <ion-card-title>Presupuesto Mensual</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Presupuesto</ion-label>
            <ion-input :value="formatCurrency(monthlyBudget)" readonly></ion-input>
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Sustituye el bloque de botones de categorías por una lista -->
      <ion-list class="category-list">
        <ion-item
          v-for="category in categories"
          :key="category.id"
        >
          <ion-label>{{ category.name }}</ion-label>
          <ion-button slot="end" color="warning" size="small" @click="editCategory(category)">Editar</ion-button>
          <ion-button slot="end" color="danger" size="small" @click="deleteCategory(category.id)">Eliminar</ion-button>
        </ion-item>
        <ion-item button color="success" @click="showAddCategoryModal = true">
          <ion-label class="crear-categoria-label">Crear Nueva Categoría</ion-label>
        </ion-item>
      </ion-list>

      <ion-button expand="block" color="primary" @click="goToResumenGastos" class="small-button">
        Calcular Gastos
      </ion-button>

      <ion-list>
        <ion-item v-for="expense in expenses" :key="expense.id">
          <ion-label>
            {{ expense.description }} - {{ getCategoryName(expense.categoryId) }} - {{ formatCurrency(expense.amount) }}
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-button expand="block" color="secondary" class="add-money-button" @click="showAddMoneyModal = true">
        Agregar Dinero
      </ion-button>

      <!-- Modal para agregar gasto -->
      <ion-modal :is-open="showAddExpenseModal" @did-dismiss="showAddExpenseModal = false">
        <ion-content class="ion-padding">
          <h2>Agregar Gasto</h2>
          <ion-item>
            <ion-label position="stacked">Descripción</ion-label>
            <ion-input v-model="newExpense.description" placeholder="Ej: Supermercado"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Monto</ion-label>
            <ion-input v-model.number="newExpense.amount" type="number" placeholder="Ej: 100"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Categoría</ion-label>
            <ion-select v-model="newExpense.categoryId" placeholder="Selecciona una categoría">
              <ion-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Fecha</ion-label>
            <ion-input v-model="newExpense.spentAt" type="date"></ion-input>
          </ion-item>
          <ion-button expand="block" color="primary" @click="addExpense">Guardar</ion-button>
          <ion-button expand="block" color="medium" @click="showAddExpenseModal = false">Cancelar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Modal para agregar dinero -->
      <ion-modal :is-open="showAddMoneyModal" @did-dismiss="showAddMoneyModal = false">
        <ion-content class="ion-padding">
          <h2>Agregar Dinero</h2>
          <ion-item>
            <ion-label position="stacked">¿Cuánto dinero llegó?</ion-label>
            <ion-input v-model.number="moneyToAdd" type="number" placeholder="Ej: 500"></ion-input>
          </ion-item>
          <ion-button expand="block" color="primary" @click="addMoney">Guardar</ion-button>
          <ion-button expand="block" color="medium" @click="showAddMoneyModal = false">Cancelar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Modal para agregar categoría -->
      <ion-modal :is-open="showAddCategoryModal" @did-dismiss="showAddCategoryModal = false">
        <ion-content class="ion-padding">
          <h2>Agregar Categoría</h2>
          <ion-item>
            <ion-label position="stacked">Nombre de la Categoría</ion-label>
            <ion-input v-model="newCategoryName" placeholder="Ej: Transporte"></ion-input>
          </ion-item>
          <ion-button expand="block" color="primary" @click="addCategory">Guardar</ion-button>
          <ion-button expand="block" color="medium" @click="showAddCategoryModal = false">Cancelar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Modal para editar categoría -->
      <ion-modal :is-open="showEditCategoryModal" @did-dismiss="showEditCategoryModal = false">
        <ion-content class="ion-padding">
          <h2>Editar Categoría</h2>
          <ion-item>
            <ion-label position="stacked">Nuevo nombre</ion-label>
            <ion-input v-model="editCategoryName"></ion-input>
          </ion-item>
          <ion-button expand="block" color="success" @click="saveEditCategory">Guardar</ion-button>
          <ion-button expand="block" color="medium" @click="showEditCategoryModal = false">Cancelar</ion-button>
          <ion-button expand="block" color="danger" @click="deleteCategory(editCategoryId)">Eliminar</ion-button>
        </ion-content>
      </ion-modal>

      <ion-button expand="block" color="tertiary" class="mt-2" @click="showAddExpenseModal = true">
        Agregar Gasto
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';
import { moon, sunny } from 'ionicons/icons';
import { ref, onMounted, computed, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const BASE_URL = 'https://gastocontrol-backend.onrender.com/api';

const router = useRouter();

const categories = ref([]);
const expenses = ref([]);
const monthlyBudget = ref(0);

const showAddMoneyModal = ref(false);
const showAddExpenseModal = ref(false);
const showAddCategoryModal = ref(false);
const newCategoryName = ref('');
const showEditCategoryModal = ref(false);
const editCategoryId = ref(null);
const editCategoryName = ref('');

const moneyToAdd = ref(null);

const newExpense = ref({
  description: '',
  categoryId: null,
  amount: null,
  spentAt: ''
});

const theme = ref('light');
const themeClass = computed(() => theme.value === 'dark' ? 'dark-theme' : 'light-theme');
const themeIcon = computed(() => theme.value === 'dark' ? sunny : moon);

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('dark', theme.value === 'dark');
  document.body.classList.toggle('light', theme.value === 'light');
};

const cargarCategorias = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/categories/all`);
    categories.value = res.data;
  } catch (e) {
    categories.value = [];
    console.error('Error cargando categorías:', e);
  }
};

const cargarGastos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/expenses`);
    expenses.value = res.data;
  } catch (e) {
    expenses.value = [];
    console.error('Error cargando gastos:', e);
  }
};

const cargarPresupuesto = async () => {
  try {
    const ingresosRes = await axios.get(`${BASE_URL}/incomes`);
    const totalIngresos = ingresosRes.data.reduce((acc, inc) => acc + inc.amount, 0);
    const gastosRes = await axios.get(`${BASE_URL}/expenses`);
    const totalGastos = gastosRes.data.reduce((acc, g) => acc + g.amount, 0);
    monthlyBudget.value = totalIngresos - totalGastos;
  } catch (e) {
    monthlyBudget.value = 0;
    console.error('Error cargando presupuesto:', e);
  }
};

const addMoney = async () => {
  if (!moneyToAdd.value || moneyToAdd.value <= 0) {
    alert('Ingresa un monto válido');
    return;
  }
  try {
    await axios.post(`${BASE_URL}/incomes`, {
      amount: moneyToAdd.value,
      description: 'Ingreso manual',
      date: new Date().toISOString().slice(0, 10)
    });
    await cargarPresupuesto();
    moneyToAdd.value = null;
    showAddMoneyModal.value = false;
  } catch (e) {
    alert('Error al agregar dinero');
    console.error(e);
  }
};

const addExpense = async () => {
  if (!newExpense.value.description || !newExpense.value.categoryId || !newExpense.value.amount || !newExpense.value.spentAt) {
    alert('Completa todos los campos');
    return;
  }
  try {
    await axios.post(`${BASE_URL}/expenses`, {
      amount: newExpense.value.amount,
      description: newExpense.value.description,
      spentAt: newExpense.value.spentAt,
      categoryId: newExpense.value.categoryId
    });
    await cargarGastos();
    await cargarPresupuesto();
    newExpense.value = { description: '', categoryId: null, amount: null, spentAt: '' };
    showAddExpenseModal.value = false;
  } catch (e) {
    alert('Error al agregar gasto');
    console.error(e);
  }
};

const addCategory = async () => {
  if (!newCategoryName.value) {
    alert('Ingresa un nombre para la categoría');
    return;
  }
  try {
    await axios.post(`${BASE_URL}/categories`, {
      name: newCategoryName.value
    });
    await cargarCategorias();
    newCategoryName.value = '';
    showAddCategoryModal.value = false;
  } catch (e) {
    alert('Error al agregar la categoría');
    console.error(e);
  }
};

const editCategory = (category) => {
  editCategoryId.value = category.id;
  editCategoryName.value = category.name;
  showEditCategoryModal.value = true;
};

const saveEditCategory = async () => {
  if (!editCategoryName.value || !editCategoryId.value) return;
  try {
    await axios.put(`${BASE_URL}/categories/${editCategoryId.value}`, {
      name: editCategoryName.value
    });
    await cargarCategorias();
    showEditCategoryModal.value = false;
    editCategoryId.value = null;
    editCategoryName.value = '';
  } catch (e) {
    alert('Error al editar la categoría');
    console.error(e);
  }
};

const deleteCategory = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
  try {
    await axios.delete(`${BASE_URL}/categories/${id}`);
    await cargarCategorias();
    showEditCategoryModal.value = false;
    editCategoryId.value = null;
    editCategoryName.value = '';
  } catch (e) {
    alert('Error al eliminar la categoría');
    console.error(e);
  }
};

const getCategoryName = (categoryId) => {
  const cat = categories.value.find(c => c.id === categoryId);
  return cat ? cat.name : '';
};

const goToResumenGastos = () => {
  router.push({ path: '/resumen-gastos' }).catch(() => {});
};



const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return value.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 });
};

onMounted(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  theme.value = prefersDark ? 'dark' : 'light';
  document.body.classList.toggle('dark', prefersDark);
  document.body.classList.toggle('light', !prefersDark);
  cargarCategorias();
  cargarGastos();
  cargarPresupuesto();
});

// Recarga categorías al volver a la pantalla
onActivated(() => {
  cargarCategorias();
  cargarGastos();
  cargarPresupuesto();
});
</script>


<style scoped>
:root,
.light-theme {
  --ion-background-color: #f4f4f4;
  --ion-text-color: #222;
  --ion-card-background: #fff;
  --ion-toolbar-background: #3880ff;
  --ion-toolbar-color: #fff;
  --ion-item-background: #fff;
  --ion-label-color: #222;
}

.dark-theme,
body.dark {
  --ion-background-color: #181824;
  --ion-text-color: #fff;
  --ion-card-background: #23233a;
  --ion-toolbar-background: #23233a;
  --ion-toolbar-color: #fff;
  --ion-item-background: #23233a;
  --ion-label-color: #fff;
}

ion-page {
  background: var(--ion-background-color);
  color: var(--ion-text-color);
}

ion-card {
  background-color: var(--ion-card-background);
  color: var(--ion-text-color);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

ion-card-title {
  color: var(--ion-text-color);
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
}

ion-toolbar {
  background: var(--ion-toolbar-background);
  color: var(--ion-toolbar-color);
}

ion-item {
  --background: var(--ion-item-background);
  --color: var(--ion-label-color);
  margin-bottom: 12px;
}

ion-label {
  color: var(--ion-label-color);
}

ion-input {
  --color: var(--ion-label-color);
  color: var(--ion-label-color);
  font-weight: bold;
  text-align: center;
}

.category-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.category-list {
  margin-top: 20px;
}

ion-button {
  --border-radius: 10px;
  font-size: 1rem;
}

.small-button {
  margin-top: 20px;
}

.add-money-button {
  margin-top: 20px;
}

ion-list {
  margin-top: 20px;
  background-color: transparent;
}

ion-item ion-label {
  color: var(--ion-label-color);
}

.mt-2 {
  margin-top: 16px;
}
</style>
