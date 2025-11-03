# YuGiOh Card Manager API

API RESTful desarrollada con NestJS para la gestión de cartas de Yu-Gi-Oh!, permitiendo crear, consultar, actualizar y eliminar cartas con sus tipos, subtipos y estadísticas.

## 📋 Tabla de Contenidos

- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Características](#características)
- [Suposiciones y Decisiones de Diseño](#suposiciones-y-decisiones-de-diseño)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Testing](#testing)
- [Documentación](#documentación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)

---

## 🚀 Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para gestión de base de datos
- **MySQL** - Base de datos relacional
- **Jest** - Framework de testing
- **Class Validator** - Validación de DTOs
- **Class Transformer** - Transformación de objetos

---

## ✨ Características

### Funcionalidades Principales

- ✅ CRUD básico de tipos de cartas (Card Types)
- ✅ CRUD básico de subtipos de cartas (Card Sub Types)
- ✅ CRUD completo de cartas (Cards) con estadísticas opcionales
- ✅ Paginación en endpoints de listado
- ✅ Filtros avanzados (por tipo, subtipo, nombre, estrellas)
- ✅ Validaciones exhaustivas con DTOs
- ✅ Relaciones entre entidades (Types, SubTypes, Cards, Statistics)

### Características Técnicas

- ✅ **Tests Unitarios**: 71 tests (40 controllers + 31 services)
- ✅ **Paginación**: Implementada en todos los endpoints de listado
- ✅ **Clean Architecture**: Código preparado para migración entre bases de datos
- ✅ **Soft Delete**: Eliminación lógica para mantener trazabilidad
- ✅ **TypeORM**: Abstracción de base de datos
- ✅ **Validaciones**: DTOs con class-validator

---

## 🤔 Suposiciones y Decisiones de Diseño

### 1. Estructura de Base de Datos

#### Separación de Entidades

- **Card Types**: Tipos principales (Monster, Spell, Trap)
- **Card Sub Types**: Subtipos específicos (Effect, Fusion, Normal, Quick-Play, etc.)
- **Cards**: Información principal de las cartas
- **Card Statistics**: Estadísticas separadas (solo para cartas tipo Monster)

**Razón**: No todas las cartas tienen estadísticas (Spell y Trap no las necesitan), por lo que se separaron en una tabla independiente para normalización y eficiencia.

#### Campos de las Cartas

```typescript
{
  name: string;        // Nombre único de la carta
  code: string;        // Código único de 7 caracteres (ej: "YGO0001")
  description: string; // Descripción/efecto de la carta
  image_url?: string;  // URL de la imagen (opcional)
  card_type_id: UUID;  // Referencia al tipo
  card_sub_type_id: UUID; // Referencia al subtipo
  statistics?: {       // Opcional, solo para Monsters
    attack: number;
    defense: number;
    stars: number;
  }
}
```

### 2. Validaciones Implementadas

#### Card Types y Sub Types

- Nombre único de máximo 50 caracteres
- Validación de existencia en actualizaciones
- Foreign key constraints

#### Cards

- Nombre único (2-50 caracteres)
- Código único (exactamente 7 caracteres)
- Descripción requerida (5-255 caracteres)
- URL de imagen opcional (5-255 caracteres)
- Validación de existencia de tipo y subtipo
- Estadísticas opcionales con valores mínimos de 1

### 3. Relaciones y Cascade

```
CardType (1:N) → CardSubType (1:N) → Card (1:1) → CardStatistics
```

- **CASCADE on DELETE**: Si se elimina un tipo, se eliminan sus subtipos y cartas asociadas
- **Soft Delete**: Todas las entidades tienen `deleted_at` para eliminación lógica
- **Relations eager**: Se cargan automáticamente en consultas para evitar N+1 queries

### 4. Paginación

Todos los endpoints de listado soportan paginación:

```typescript
{
  limit?: number;  // Default: 10
  offset?: number; // Default: 0
}
```

### 5. Filtros Implementados

**Cards - FindAll**:

- `type_id`: UUID del tipo de carta
- `sub_type_id`: UUID del subtipo
- `name`: Búsqueda por nombre
- `stars`: Filtrar por nivel/estrellas

**Cards - FindOne**:

- `id`: UUID de la carta
- `name`: Nombre exacto
- `stars`: Nivel/estrellas

**Validación**: Al menos un filtro debe ser proporcionado en `findOne`

### 6. Respuestas de la API

#### Controllers con Wrapper

```json
{
  "success": true,
  "data": {
    /* resultado */
  }
}
```

### 7. Códigos de Error HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `400 Bad Request`: Validación fallida o parámetros inválidos
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (duplicados)

---

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <https://github.com/AgustinChavero/nest-challenge>
cd nest-challenge
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto: SOLICITAR EL ARCHIVO ENV PREVIAMENTE

```env
# Database Configuration
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
```

## ▶️ Ejecución del Proyecto

### Modo Desarrollo

```bash
docker-compose up -d
```

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000`

### Modo Producción

Unicamente consumir la API desde, por ejemplo, Postman

## 🧪 Testing

El proyecto incluye **71 tests unitarios** completos para controllers y services.

### Ejecutar Todos los Tests

```bash
npm test
```

### Ejecutar Tests de un Módulo Específico

```bash
# Card Type
npm test card_type.controller.spec.ts
npm test card_type.service.spec.ts

# Card Sub Type
npm test card_sub_type.controller.spec.ts
npm test card_sub_type.service.spec.ts

# Card
npm test card.controller.spec.ts
npm test card.service.spec.ts
```

### Documentación de Tests

Para información detallada sobre los tests implementados, consulta:
📄 **[documentation/testing.md](./documentation/testing.md)**

---

## 📚 Documentación

### Estructura de Base de Datos

📄 **[documentation/database.md](./documentation/database.md)**

Incluye:

- Descripción de cada tabla
- Decisiones de diseño
- Consideraciones para migración
- Queries de ejemplo
- Índices recomendados

### Colección de Postman

📄 **[documentation/YuGiOh.postman_collection.json](./documentation/YuGiOh.postman_collection.json)**

Importa este archivo en Postman para probar todos los endpoints de la API.

**Cómo importar**:

1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo `YuGiOh.postman_collection.json`
4. La colección aparecerá con todos los endpoints configurados

---

## 📁 Estructura del Proyecto

```
nest-challenge/
├── src/
│   ├── card/                    # Módulo de cartas
│   │   ├── dto/                 # DTOs de validación
│   │   ├── entities/            # Entidad Card
│   │   ├── card.controller.ts   # Controller
│   │   ├── card.service.ts      # Lógica de negocio
│   │   ├── card.module.ts       # Módulo
│   │   ├── card.controller.spec.ts  # Tests del controller
│   │   └── card.service.spec.ts     # Tests del service
│   │
│   ├── card_type/               # Módulo de tipos de carta
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── card_type.controller.ts
│   │   ├── card_type.service.ts
│   │   ├── card_type.module.ts
│   │   ├── card_type.controller.spec.ts
│   │   └── card_type.service.spec.ts
│   │
│   ├── card_sub_type/           # Módulo de subtipos
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── card_sub_type.controller.ts
│   │   ├── card_sub_type.service.ts
│   │   ├── card_sub_type.module.ts
│   │   ├── card_sub_type.controller.spec.ts
│   │   └── card_sub_type.service.spec.ts
│   │
│   ├── card_statistics/         # Módulo de estadísticas
│   │   ├── dto/
│   │   └── entities/
│   │
│   ├── common/                  # Recursos compartidos
│   │   ├── dto/                 # PaginationDto
│   │   ├── entities/            # ModelEntity (base)
│   │   └── helpers/             # Manejo de errores
│   │
│   ├── app.module.ts            # Módulo principal
│   └── main.ts                  # Punto de entrada
│
├── documentation/               # Documentación
│   ├── database.md
│   ├── testing.md
│   └── YuGiOh.postman_collection.json
│
├── .env                         # Variables de entorno (no versionado)
├── .env.example                 # Ejemplo de configuración
├── jest.config.ts               # Configuración de Jest
├── tsconfig.json                # Configuración de TypeScript
├── package.json
└── README.md                    # Este archivo
```

---

## 🌐 API Endpoints

### Card Types

| Método | Endpoint                       | Descripción                 |
| ------ | ------------------------------ | --------------------------- |
| POST   | `/card-type`                   | Crear tipo de carta         |
| GET    | `/card-type?limit=10&offset=0` | Listar tipos con paginación |
| PATCH  | `/card-type/:id`               | Actualizar tipo             |

### Card Sub Types

| Método | Endpoint                           | Descripción                    |
| ------ | ---------------------------------- | ------------------------------ |
| POST   | `/card-sub-type`                   | Crear subtipo                  |
| GET    | `/card-sub-type?limit=10&offset=0` | Listar subtipos con paginación |
| PATCH  | `/card-sub-type/:id`               | Actualizar subtipo             |

### Cards

| Método | Endpoint                                                 | Descripción                          |
| ------ | -------------------------------------------------------- | ------------------------------------ |
| POST   | `/card`                                                  | Crear carta (con o sin estadísticas) |
| GET    | `/card?limit=10&offset=0&type_id=...&name=...&stars=...` | Listar cartas con filtros            |
| GET    | `/card/find?id=...&name=...&stars=...`                   | Buscar carta específica              |
| PATCH  | `/card/:id`                                              | Actualizar carta                     |
| DELETE | `/card/:id`                                              | Eliminar carta (soft delete)         |

### Ejemplos de Uso

#### Crear un Card Type

```bash
POST http://localhost:3000/card-type
Content-Type: application/json

{
  "name": "Monster"
}
```

#### Crear un Card Sub Type

```bash
POST http://localhost:3000/card-sub-type
Content-Type: application/json

{
  "name": "Effect",
  "card_type_id": "uuid-del-tipo"
}
```

#### Crear una Carta con Estadísticas

```bash
POST http://localhost:3000/card
Content-Type: application/json

{
  "name": "Dark Magician",
  "code": "YGO-001",
  "description": "The ultimate wizard in terms of attack and defense",
  "image_url": "https://example.com/dark-magician.jpg",
  "card_type_id": "uuid-del-tipo",
  "card_sub_type_id": "uuid-del-subtipo",
  "statistics": {
    "attack": 2500,
    "defense": 2100,
    "stars": 7
  }
}
```

#### Buscar Cartas con Filtros

```bash
GET http://localhost:3000/card?type_id=uuid-del-tipo&stars=7&limit=20&offset=0
```

Para más ejemplos, consulta la colección de Postman en `documentation/`.

---

## 🏗️ Arquitectura

El proyecto sigue principios de **Clean Architecture**:

- **Controllers**: Manejan las peticiones HTTP y delegan al service
- **Services**: Contienen la lógica de negocio
- **Entities**: Representan las tablas de la base de datos
- **DTOs**: Validación y transformación de datos de entrada
- **Repositories**: Abstracción de acceso a datos (TypeORM)

### Ventajas del Diseño

✅ **Testeable**: Fácil de mockear y probar unitariamente  
✅ **Mantenible**: Separación clara de responsabilidades  
✅ **Escalable**: Fácil de extender con nuevas funcionalidades  
✅ **Portable**: Preparado para cambiar de base de datos sin afectar la lógica

---

## 📊 Resumen de Cumplimiento de Requisitos

### Requisitos Obligatorios ✅

- ✅ Desarrollado en NestJS
- ✅ Base de datos MySQL con TypeORM
- ✅ Suposiciones y decisiones documentadas
- ✅ Datos persistentes en base de datos
- ✅ Repositorio accesible
- ✅ Documentación de endpoints (Postman)
- ✅ Documentación de estructura de BD

### Requisitos Opcionales ✅

- ✅ Paginación implementada en todos los listados
- ✅ 71 Tests Unitarios (40 controllers + 31 services)
- ⚠️ Deploy en Cloud (pendiente)
- ⚠️ Servicios de AWS (pendiente)

---

## 👤 Autor

Desarrollado por Agustín Chavero para un challenge técnico.

---

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en contactarme:

- Email: agustindanielchavero@gmail.com
- Télefono:+5492612797321
