# Findex API

Conectando personas a través de préstamos inteligentes.

---

## 🚀 Descripción

**Findex** es una API REST construida con **NestJS** para automatizar y administrar préstamos entre personas. Los prestamistas publican ofertas y los prestatarios eligen la que más se adapte a sus necesidades. Todo está respaldado por una estructura robusta y flexible.

🔗 Características principales:

- Registro y gestión de usuarios (prestamistas y prestatarios)
- Publicación y aceptación de ofertas de préstamo
- Configuración de métodos y frecuencia de pago
- Seguimiento de pagos y estado del préstamo
- Autenticación JWT con control de roles (prestamista=1, prestatario=2)
- Carga de comprobantes de pago (Multer)

> Desarrollado por **Kevin Quiroz** como parte de un reto académico. 🎓

---

## 🛠️ Tecnologías utilizadas

- [NestJS](https://nestjs.com/) – Framework backend moderno y modular
- [Node.js](https://nodejs.org/) – Entorno de ejecución
- [PostgreSQL](https://www.postgresql.org/) – Base de datos relacional
- [Pg](https://node-postgres.com/) – Cliente PostgreSQL para Node.js
- [Swagger](https://swagger.io/) – Documentación interactiva de la API

---

## 🧩 Módulos/Capas

- `controllers/` – Endpoints HTTP por dominio (e.g., `prestamo`, `pago`).
- `services/` – Reglas de negocio y acceso a datos SQL (via `DatabaseService`).
- `modules/` – Módulos Nest que ensamblan controller+service.
- `common/` – Decoradores, guards (`JwtAuthGuard`, `RolesGuard`), constantes.
- `database/` – Conector `pg`, configuración y script `databaseFindex.sql`.

Consulta diagramas y flujos en `ARQUITECTURA.md`.

---

## ⚙️ Instalación y ejecución

```bash
# Instala las dependencias
npm install

# Ejecuta en modo desarrollo
npm run start:dev

# Ejecuta en producción
npm run start:prod

# Pruebas unitarias
npm run test

# Pruebas de extremo a extremo (E2E)
npm run test:e2e

# Ver cobertura de pruebas
npm run test:cov
```

### Requisitos

- Node.js 18+ (recomendado 20+)
- PostgreSQL en ejecución y variables de conexión configuradas

### Variables de entorno

Usa el archivo `/.env.example` en la raíz del monorepo como plantilla. Cópialo y ajusta valores reales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=findex
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-strong-secret
PORT=3000
```

Notas:

- `DatabaseService` soporta `DB_DATABASE` o `BD_DATABASE`.
- `JwtAuthGuard` usa `JWT_SECRET` (fallback a `secretfindex` si no está definida).

---

## 🔐 Autenticación y Autorización

- JWT en Authorization: Bearer `token`.
- Guards:
  - `JwtAuthGuard`: protege rutas autenticadas.
  - `RolesGuard` + `@Roles(1|2)`: restringe por tipo de usuario.
- Endpoints clave de préstamos/pagos:
  - `GET /prestamo/prestamos-por-prestatario/:id` (rol 2)
  - `GET /prestamo/prestamos-por-prestamista/:id` (rol 1)
  - `GET /prestamo/mi-prestamo-por-oferta/:id_oferta` (rol 2)
  - `POST /pago` (requiere `id_prestamo`, `id_metodo`, `comprobante`)

---

## 🗺️ Rutas principales (extracto)

```text
GET    /prestamo/:id
GET    /prestamo/prestamos-por-prestatario/:id
GET    /prestamo/prestamos-por-prestamista/:id
GET    /prestamo/mi-prestamo-por-oferta/:id_oferta

GET    /pago
GET    /pago/pagos-prestamo/:id
GET    /pago/pagos-oferta/:id_oferta
POST   /pago
```

Para la lista completa, ver controladores en `src/controllers/**`.

## 🤝 Contribuciones

- Kevin Quiroz — Backend — <https://github.com/triunix>
- Carlos Moreira — Lógica + UX — <https://github.com/cmoreira9255>

---

> ✨ Este proyecto fue desarrollado con pasión y código limpio como parte de un reto académico. ¡Gracias por apoyar nuestro trabajo!
