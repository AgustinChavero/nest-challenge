# Estructura de Base de Datos

Este proyecto utiliza TypeORM como ORM, diseñado con principios de Clean Architecture para facilitar migraciones entre diferentes sistemas de bases de datos (MySQL, PostgreSQL, etc.).

## Entidades

### ModelEntity (Base)

Todas las entidades heredan de `ModelEntity`, que proporciona campos comunes:

```typescript
- id: UUID (Primary Key)
- created_at: DateTime
- updated_at: DateTime
- deleted_at: DateTime (Soft Delete)
```

---

### CardType

**Tabla**: `card_types`

Representa los tipos principales de cartas (Monster, Spell, Trap, etc.).

| Campo      | Tipo        | Restricciones    | Descripción                 |
| ---------- | ----------- | ---------------- | --------------------------- |
| id         | UUID        | PK               | Identificador único         |
| name       | VARCHAR(50) | UNIQUE, NOT NULL | Nombre del tipo             |
| created_at | TIMESTAMP   | NOT NULL         | Fecha de creación           |
| updated_at | TIMESTAMP   | NOT NULL         | Fecha de actualización      |
| deleted_at | TIMESTAMP   | NULLABLE         | Fecha de eliminación lógica |

**Relaciones**:

- `card_sub_types`: OneToMany → CardSubType
- `cards`: OneToMany → Card

---

### CardSubType

**Tabla**: `card_sub_types`

Representa los subtipos de cartas (Effect, Fusion, Normal, etc.).

| Campo        | Tipo        | Restricciones    | Descripción                 |
| ------------ | ----------- | ---------------- | --------------------------- |
| id           | UUID        | PK               | Identificador único         |
| card_type_id | UUID        | FK, NOT NULL     | Referencia a card_types     |
| name         | VARCHAR(50) | UNIQUE, NOT NULL | Nombre del subtipo          |
| created_at   | TIMESTAMP   | NOT NULL         | Fecha de creación           |
| updated_at   | TIMESTAMP   | NOT NULL         | Fecha de actualización      |
| deleted_at   | TIMESTAMP   | NULLABLE         | Fecha de eliminación lógica |

**Relaciones**:

- `card_type`: ManyToOne → CardType (CASCADE on delete)
- `cards`: OneToMany → Card

---

### Card

**Tabla**: `cards`

Representa las cartas individuales del juego.

| Campo            | Tipo         | Restricciones    | Descripción                 |
| ---------------- | ------------ | ---------------- | --------------------------- |
| id               | UUID         | PK               | Identificador único         |
| card_type_id     | UUID         | FK, NOT NULL     | Referencia a card_types     |
| card_sub_type_id | UUID         | FK, NOT NULL     | Referencia a card_sub_types |
| name             | VARCHAR(50)  | UNIQUE, NOT NULL | Nombre de la carta          |
| code             | VARCHAR(7)   | UNIQUE, NOT NULL | Código único de la carta    |
| description      | VARCHAR(255) | NOT NULL         | Descripción de la carta     |
| image_url        | VARCHAR(255) | NULLABLE         | URL de la imagen            |
| created_at       | TIMESTAMP    | NOT NULL         | Fecha de creación           |
| updated_at       | TIMESTAMP    | NOT NULL         | Fecha de actualización      |
| deleted_at       | TIMESTAMP    | NULLABLE         | Fecha de eliminación lógica |

**Relaciones**:

- `card_type`: ManyToOne → CardType (CASCADE on delete)
- `card_sub_type`: ManyToOne → CardSubType (CASCADE on delete)
- `statistics`: OneToOne → CardStatistics (opcional, CASCADE)

---

### CardStatistics

**Tabla**: `card_statistics`

Almacena estadísticas de cartas (solo para cartas tipo Monster).

| Campo      | Tipo      | Restricciones | Descripción                 |
| ---------- | --------- | ------------- | --------------------------- |
| id         | UUID      | PK            | Identificador único         |
| card_id    | UUID      | FK, NOT NULL  | Referencia a cards          |
| attack     | INT       | NOT NULL      | Puntos de ataque            |
| defense    | INT       | NOT NULL      | Puntos de defensa           |
| stars      | INT       | NOT NULL      | Nivel/Estrellas             |
| created_at | TIMESTAMP | NOT NULL      | Fecha de creación           |
| updated_at | TIMESTAMP | NOT NULL      | Fecha de actualización      |
| deleted_at | TIMESTAMP | NULLABLE      | Fecha de eliminación lógica |

**Relaciones**:

- `card`: OneToOne → Card (CASCADE on delete)

---

## Decisiones de Diseño

### 1. Relaciones Explícitas en Código

Las relaciones están definidas explícitamente en las entidades mediante decoradores de TypeORM:

- `@ManyToOne`: Para relaciones N:1
- `@OneToMany`: Para relaciones 1:N
- `@OneToOne`: Para relaciones 1:1

**Ventaja**: Facilita la comprensión del modelo de datos y permite migraciones más sencillas.

### 2. Tipos de Datos Genéricos

Se utilizan tipos de datos compatibles con múltiples bases de datos:

- `VARCHAR`: Compatible con MySQL, PostgreSQL, SQL Server
- `INT`: Compatible con otros sistemas
- `UUID`: Identificadores universales, compatibles con la mayoría de bases de datos modernas

**Ventaja**: Preparado para migrar entre MySQL, PostgreSQL o más sin cambios significativos en el código.

### 3. Separación de Estadísticas

Las estadísticas están en una tabla separada (`card_statistics`) en lugar de incluirlas directamente en `cards`.

**Razones**:

- ✅ **Normalización**: No todas las cartas tienen estadísticas (Spell y Trap no las necesitan)
- ✅ **Flexibilidad**: Las estadísticas solo se crean cuando son necesarias
- ✅ **Performance**: Queries más ligeros cuando no se necesitan las estadísticas
- ✅ **Mantenibilidad**: Facilita agregar nuevas estadísticas sin modificar la tabla principal

### 4. Soft Delete

Todas las entidades heredan el campo `deleted_at` de `ModelEntity`.

**Ventaja**:

- ✅ Permite recuperar registros eliminados
- ✅ Mantiene la integridad referencial
- ✅ Útil para auditoría y trazabilidad

### 5. CASCADE on Delete

Las relaciones utilizan `onDelete: 'CASCADE'`:

- Si se elimina un `CardType`, se eliminan sus `CardSubType` asociados
- Si se elimina un `CardSubType`, se eliminan sus `Card` asociadas
- Si se elimina una `Card`, se eliminan sus `CardStatistics`

**Ventaja**: Mantiene la integridad referencial automáticamente.

### 6. Campos Únicos

- `name` en `card_types` y `card_sub_types`
- `name` y `code` en `cards`

**Ventaja**: Previene duplicados a nivel de base de datos.

---

## Principios de Clean Architecture

### Portabilidad

El diseño está preparado para migrar entre diferentes bases de datos:

```typescript
// Ejemplo: Cambiar de MySQL a PostgreSQL
// Solo requiere cambiar la configuración en TypeORM
{
  type: 'postgres', // Antes: 'mysql'
  // ... resto de la configuración
}
```

### Abstracción

TypeORM actúa como capa de abstracción:

- El código de negocio no depende directamente de la base de datos
- Los repositorios pueden ser reemplazados fácilmente
- Las queries son agnósticas al motor de base de datos

### Escalabilidad

La estructura permite:

- Agregar nuevos tipos y subtipos sin modificar la estructura
- Extender estadísticas sin afectar otras tablas

## Resumen

| Tabla           | Registros Esperados         | Tipo de Relación |
| --------------- | --------------------------- | ---------------- |
| card_types      | ~3-5 (Monster, Spell, Trap) | Catálogo         |
| card_sub_types  | ~20-30                      | Catálogo         |
| cards           | Miles                       | Transaccional    |
| card_statistics | Miles (solo Monsters)       | Transaccional    |

**Ventajas del diseño**:

- ✅ Normalizado y eficiente
- ✅ Preparado para escalabilidad
- ✅ Compatible con múltiples bases de datos
- ✅ Soft delete para trazabilidad
- ✅ Separación lógica de estadísticas
