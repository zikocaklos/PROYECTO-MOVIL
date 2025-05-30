import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPague from '@/views/LoginPague.vue';
import CrearcuentaPage from '@/views/CrearcuentaPage.vue';
import BienvenidaPague from '@/views/BienvenidaPague.vue';
import CrearCategoria from "@/views/CrearCategoria.vue";
import ResumenGasto from "@/views/ResumenGasto.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/bienvenido'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPague
  },
  {
    path: '/crearcuenta',
    name: 'crear-cuenta',
    component: CrearcuentaPage
  },
  {
    path: '/register',
    redirect: '/crearcuenta' 
  },
  {
    path: '/bienvenido',
    name: 'bienvenido',
    component: BienvenidaPague
  },
  {
    path: '/crear-categoria',
    name: 'CrearCategoria',
    component: CrearCategoria
  },
  {
    path: '/resumen-gastos',
    name: 'ResumenGastos',
    component: ResumenGasto
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
