# 📚 ÍNDICE COMPLETO DE ARCHIVOS - GESTIÓN DE INSUMOS

## 🎯 ARCHIVOS PRINCIPALES

### 📊 Datos Base
| Archivo | Registros | Descripción |
|---------|-----------|-------------|
| `insumos.json` | 25,425 | Archivo original con duplicados |
| `insumos_sin_duplicados.json` | 23,546 | Insumos únicos (duplicados eliminados) |
| `delphi_insumos.json` | 38,716 | Base de datos Delphi |

### 🔗 Datos Combinados
| Archivo | Registros | Descripción |
|---------|-----------|-------------|
| `insumos_combinados.json` | 23,546 | Todos los insumos con datos Delphi combinados |
| `insumos_con_coincidencia.json` | ~15,773 | Insumos encontrados en Delphi |
| `insumos_sin_coincidencia.json` | ~7,773 | Insumos NO encontrados en Delphi |

---

## 📋 CATÁLOGOS Y CATEGORÍAS

### 🏷️ Categorías Únicas Extraídas

| Archivo | Cantidad | Formato | Descripción |
|---------|----------|---------|-------------|
| `marcas_unicas.json` | 316 | JSON | Marcas únicas |
| `marcas_array.php` | 316 | PHP | Array PHP de marcas |
| `marcas_array.json` | 316 | JSON | Array estructurado |
| | | | |
| `unidades_unicas.json` | 31 | JSON | Unidades de medida |
| `unidades_array.php` | 31 | PHP | Array PHP de unidades |
| | | | |
| `insumos_unicos.json` | 11 | JSON | Categorías de insumos |
| `insumos_array.php` | 11 | PHP | Array PHP de insumos |
| | | | |
| `detalles_unicos.json` | 71 | JSON | Detalles únicos |
| `detalles_array.php` | 71 | PHP | Array PHP de detalles |
| | | | |
| `tipo_costos.json` | 7 | JSON | Tipos de costos |
| `tipo_costos_array.php` | 7 | PHP | Array PHP de tipos de costos |
| | | | |
| `categorias.json` | 82 | JSON | Categorías generales |
| `categorias_array.php` | 82 | PHP | Array PHP de categorías |
| `categorias_info.json` | 82 | JSON | Info detallada por grupos |

---

## 📦 ESTRUCTURA DE DATOS

### 🔸 Insumo Simple
```json
{
  "CODIGO": 20096,
  "INSUMO": "GASTOS GENERALES",
  "DETALLE": "LABORATORIOS Y ESTUDIOS",
  "DESCRIPCIÓN": "ABRASION ANGELES",
  "UND": "UND",
  "PRECIO": 118,
  "MARCA": "NACIONAL"
}
```

### 🔸 Insumo Combinado
```json
{
  "CODIGO": 20096,
  "INSUMO": "GASTOS GENERALES",
  "DETALLE": "LABORATORIOS Y ESTUDIOS",
  "DESCRIPCIÓN": "ABRASION ANGELES",
  "delphi_id_producto": "LP0000000717",
  "delphi_costo_unitario": 120.5,
  "delphi_categoria": "MATERIALES",
  "coincidencia_encontrada": true
}
```

### 🔸 Tipo de Costo
```json
{
  "id": 1,
  "nombre": "MANO DE OBRA",
  "codigo": "TC0000000001",
  "estado": 1
}
```

### 🔸 Categoría
```json
{
  "id": 1,
  "nombre": "MANO DE OBRA",
  "estado": 1
}
```

---

## 🔧 SCRIPTS DE PROCESAMIENTO

| Script | Función |
|--------|---------|
| `eliminar_duplicados.js` | Elimina duplicados basándose en INSUMO, DETALLE y DESCRIPCIÓN |
| `extraer_categorias.js` | Extrae marcas, unidades, insumos y detalles únicos |
| `generar_array_php.js` | Genera array PHP de marcas |
| `generar_todos_arrays_php.js` | Genera todos los arrays PHP |
| `combinar_insumos.js` | Combina insumos con datos de Delphi |

---

## 📊 ESTADÍSTICAS GENERALES

### Duplicados Eliminados
- **Total original**: 25,425 registros
- **Total únicos**: 23,546 registros
- **Duplicados**: 1,879 (7.39%)

### Catálogos
- **Marcas**: 316
- **Unidades**: 31
- **Insumos**: 11
- **Detalles**: 71
- **Tipos de Costos**: 7
- **Categorías**: 82

### Combinación con Delphi
- **Con coincidencia**: ~67%
- **Sin coincidencia**: ~33%

---

## 🎯 TIPOS DE COSTOS (7)

| ID | Nombre | Código |
|----|--------|--------|
| 1 | MANO DE OBRA | TC0000000001 |
| 2 | MATERIALES | TC0000000002 |
| 3 | EQUIPO | TC0000000003 |
| 4 | SUB-CONTRATOS | TC0000000004 |
| 5 | COSTOS AUXILIARES | TC0000000005 |
| 6 | GASTO GENERAL | TC0000000006 |
| 7 | REPUESTOS, COMBUSTIBLE Y LUBRICANTES | TC0000000007 |

---

## 📂 CATEGORÍAS AGRUPADAS (82 total)

### 1️⃣ Principales (ID 1-20) - 13 categorías
- Mano de Obra, Sub Contrata, Materiales, Equipos, Gastos Generales, Seguridad, Manejo Ambiental, etc.

### 2️⃣ Impuestos y Planilla (ID 26-41) - 13 categorías
- IGV, Renta, Planilla, ESSALUD, Fondo de Pensiones, CTS, Pensión, etc.

### 3️⃣ Equipamiento de Oficina (ID 56-93) - 25 categorías
- Impresoras, Computadoras, Laptops, Monitores, Muebles, etc.

### 4️⃣ Servicios (ID 132-143) - 12 categorías
- Alquiler, Internet, Telefonía, Agua, Luz, Software, Vigilancia, etc.

### 5️⃣ Especiales (ID 330+) - 11 categorías
- Router, SCTR, Préstamos, Correctivo, Preventivo, Mov Tierras, etc.

---

## 💡 USO DE ARCHIVOS PHP

### Incluir Categorías
```php
require_once('categorias_array.php');
$categoria = buscarCategoriaPorId($categorias, 1);
echo $categoria['nombre']; // MANO DE OBRA
```

### Incluir Tipo de Costos
```php
require_once('tipo_costos_array.php');
$tipo = buscarTipoCostoPorCodigo($tipoCostos, 'TC0000000002');
echo $tipo['nombre']; // MATERIALES
```

### Incluir Todo
```php
require_once('categorias_consolidado.php');
$stats = $categorias->getEstadisticas();
```

---

## 📄 REPORTES Y DOCUMENTACIÓN

| Archivo | Descripción |
|---------|-------------|
| `reporte_duplicados.json` | Análisis de duplicados eliminados |
| `reporte_combinacion.json` | Reporte de combinación con Delphi |
| `no_encontrados_en_delphi.json` | Lista de insumos sin coincidencia |
| `categorias_extraidas.json` | Todas las categorías consolidadas |
| `resumen_categorias.json` | Estadísticas de categorías |
| `categorias_info.json` | Información detallada por grupos |
| `RESUMEN_ARCHIVOS.md` | Documentación general |
| `RESUMEN_PHP.txt` | Resumen de archivos PHP |
| `INDEX.md` | Este archivo (índice completo) |

---

## 🚀 FLUJO DE TRABAJO RECOMENDADO

1. **Cargar datos originales** → `insumos.json`
2. **Eliminar duplicados** → `insumos_sin_duplicados.json`
3. **Combinar con Delphi** → `insumos_combinados.json`
4. **Usar categorías** → Arrays PHP o JSON
5. **Generar reportes** según necesidad

---

## 📞 ARCHIVOS DE REFERENCIA RÁPIDA

### Para Desarrollo Web (PHP)
- `categorias_array.php`
- `tipo_costos_array.php`
- `marcas_array.php`
- `unidades_array.php`
- `categorias_consolidado.php`

### Para APIs (JSON)
- `categorias.json`
- `tipo_costos.json`
- `insumos_combinados.json`
- `categorias_extraidas.json`

### Para Análisis
- `reporte_combinacion.json`
- `categorias_info.json`
- `resumen_categorias.json`

---

*Última actualización: 2025-10-18*
*Total de archivos generados: 40+*


