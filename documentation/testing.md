# Testing

Este proyecto incluye tests unitarios completos para controllers y services utilizando Jest y las utilidades de testing de NestJS.

## Ejecutar Tests

```bash
npm test
```

## Cobertura de Tests

### CardType Module

#### CardTypeController (9 tests)

- ✅ Instanciación del controller
- ✅ **Create**: Creación exitosa y manejo de errores
- ✅ **FindAll**: Paginación por defecto, paginación personalizada y manejo de errores
- ✅ **Update**: Actualización exitosa, manejo de errores y validación de formato UUID

**Comando**: `npm test card_type.controller.spec.ts`

#### CardTypeService (6 tests)

- ✅ Instanciación del service
- ✅ **Create**: Creación y guardado de card type
- ✅ **FindAll**: Paginación con valores por defecto y valores personalizados
- ✅ **Update**: Actualización exitosa y NotFoundException cuando no existe el registro

**Comando**: `npm test card_type.service.spec.ts`

---

### CardSubType Module

#### CardSubTypeController (13 tests)

- ✅ Instanciación del controller
- ✅ **Create**: Creación exitosa, manejo de errores genéricos y errores de foreign key
- ✅ **FindAll**: Paginación personalizada, paginación por defecto, array vacío y manejo de errores
- ✅ **Update**: Actualización exitosa, actualización de card_type_id, errores de not found, errores de foreign key y validación UUID

**Comando**: `npm test card_sub_type.controller.spec.ts`

#### CardSubTypeService (7 tests)

- ✅ Instanciación del service
- ✅ **Create**: Creación exitosa y NotFoundException cuando el card_type no existe
- ✅ **FindAll**: Mapeo de datos con paginación por defecto y valores personalizados
- ✅ **Update**: Actualización exitosa y NotFoundException cuando no existe el registro

**Comando**: `npm test card_sub_type.service.spec.ts`

---

### Card Module

#### CardController (18 tests)

- ✅ Instanciación del controller
- ✅ **Create**: Creación sin statistics, con statistics y manejo de errores
- ✅ **FindAll**: Paginación, filtros por type_id, filtros por name y stars, array vacío y manejo de errores
- ✅ **FindOne**: Búsqueda por id, por name y manejo de card not found
- ✅ **Update**: Actualización de campos básicos, con statistics, múltiples campos y manejo de errores
- ✅ **SoftDelete**: Eliminación exitosa y manejo de errores

**Comando**: `npm test card.controller.spec.ts`

#### CardService (18 tests)

- ✅ Instanciación del service
- ✅ **Create**: Creación sin statistics y con statistics
- ✅ **FindAll**: Paginación por defecto, filtros por type_id, name, stars y paginación personalizada
- ✅ **FindOne**: Búsqueda por id, por name, BadRequestException sin filtros y NotFoundException
- ✅ **Update**: Actualización de campos básicos, con statistics, NotFoundException y BadRequestException cuando no existen statistics
- ✅ **SoftDelete**: Eliminación exitosa y NotFoundException

**Comando**: `npm test card.service.spec.ts`

---

## Estructura de Tests

### Controllers

Los tests de controllers verifican:

- ✅ Llamadas correctas a los métodos del service
- ✅ Manejo de parámetros (DTOs, query params, path params)
- ✅ Validación de UUIDs con ParseUUIDPipe
- ✅ Propagación de errores del service
- ✅ Formato de respuesta esperado

### Services

Los tests de services verifican:

- ✅ Interacción con repositorios de TypeORM
- ✅ Lógica de negocio (validaciones, transformaciones)
- ✅ Manejo de relaciones entre entidades
- ✅ Excepciones personalizadas (NotFoundException, BadRequestException)
- ✅ Paginación y filtros
- ✅ Soft delete y operaciones CRUD

---

## Resumen

| Módulo      | Controllers | Services | Total Tests |
| ----------- | ----------- | -------- | ----------- |
| CardType    | 9           | 6        | 15          |
| CardSubType | 13          | 7        | 20          |
| Card        | 18          | 18       | 36          |
| **TOTAL**   | **40**      | **31**   | **71**      |

---

## Convenciones de Testing

- **Mock de repositorios**: Se utiliza `getRepositoryToken()` para mockear repositorios de TypeORM
- **Mock de services**: Se proporciona un objeto con métodos mockeados usando `jest.fn()`
- **Limpieza**: `jest.clearAllMocks()` se ejecuta en `afterEach()` para limpiar estado entre tests
- **Nomenclatura**: Describe claramente lo que se está probando (should + acción + resultado esperado)
- **Aislamiento**: Cada test es independiente y no depende del estado de otros tests

---

## Notas Importantes

- Los tests se enfocan en **testing unitario**, mockeando todas las dependencias
- Se verifica tanto el **caso de exito** como los **casos de error**
- Los tests de controllers **no** ejecutan validaciones de DTOs (eso lo hace NestJS automáticamente)
- Los tests de services **no** ejecutan query reales a la base de datos
