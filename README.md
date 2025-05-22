# PROYECTO-MOVIL
# GastoControl - Sistema de Gestión Financiera Personal

## 🧠 Planteamiento del Problema

Muchas personas tienen dificultades para administrar sus finanzas personales, lo que provoca gastos innecesarios y descontrol de ingresos. Generalmente, no se lleva un control de los gastos, ingresos o presupuestos mensuales.

**Problema:** Falta de herramientas accesibles y simples para gestionar eficientemente las finanzas personales.

---

## 🌟 Objetivos del Sistema

### Objetivo General

Desarrollar una aplicación web y móvil que permita registrar, monitorear y analizar finanzas personales.

### Objetivos Específicos

* Registrar gastos e ingresos
* Clasificar transacciones por categoría
* Establecer límites de gasto
* Visualizar resumen mensual
* Proveer autenticación segura

---

## 📅 Requerimientos

### Requerimientos Funcionales

* Registro y autenticación de usuarios
* CRUD de gastos e ingresos
* Visualización de resumen mensual
* Límites de presupuesto por mes
* Categorización de transacciones

### Requerimientos No Funcionales

* Aplicación responsiva
* Base de datos PostgreSQL
* Seguridad mediante JWT
* Backend en Node.js con Express
* Frontend en Vue.js con Ionic

---

## ⚙️ Estructura Técnica del Sistema

* **Frontend:** Vue.js + Ionic
* **Backend:** Node.js + Express
* **Base de Datos:** PostgreSQL
* **Autenticación:** JWT
* **Servidor:** Localhost / Render / Vercel

---

## 🏠 Arquitectura del Proyecto

```
GastoControl/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── components/
│   │   ├── router/
│   │   └── App.vue
└── database/
    └── init.sql
```

---

## 👤 Manual de Usuario

### 1. Registro / Inicio de Sesión

* Accede a la pantalla principal
* Elige "Crear cuenta" o "Iniciar sesión"
* Ingresa correo y contraseña

### 2. Agregar Gasto / Ingreso

* Selecciona "Agregar Gasto" o "Agregar Dinero"
* Introduce cantidad, categoría y descripción

### 3. Visualizar Resumen

* Se muestra un resumen mensual con gastos por categoría

---

## 📊 Modelo Entidad-Relación (MER)

### Entidades:

* **Users**
* **Expenses**
* **Incomes**
* **Categories**
* **Limits**

Relaciones:

* Un usuario tiene muchos gastos e ingresos
* Cada gasto/ingreso tiene una categoría
* Un usuario tiene un límite mensual

---

## 📈 Modelo Relacional (MR)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  category_id INTEGER REFERENCES categories(id),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE incomes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE limits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL,
  month VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧰 Diagramas UML

### Diagrama de Casos de Uso

* Registrar usuario
* Iniciar sesión
* Agregar gasto
* Agregar ingreso
* Consultar resumen

### Diagrama de Clases (Simplificado)

```
+----------------+
|    Usuario     |
+----------------+
| id, email, ... |
+----------------+
| registrar()    |
| login()        |
+----------------+

+----------------+
|    Gasto       |
+----------------+
| id, amount, .. |
+----------------+
| agregar()      |
+----------------+
```

### Diagrama de Secuencia - Inicio de Sesión

```
Usuario -> Frontend : Ingresa email y password
Frontend -> Backend : POST /api/auth/login
Backend -> DB : Validar credenciales
Backend -> Frontend : token JWT
Frontend -> Usuario : Acceso concedido
```

---

## 🚀 Tecnologías Usadas

* **Node.js**
* **Express.js**
* **Vue.js**
* **Ionic Framework**
* **PostgreSQL**
* **JWT**
* **Axios**

---

## 📖 Autor

**Nombre:** (Tu nombre aquí)
**Proyecto:** GastoControl
**Fecha:** Mayo 2025
