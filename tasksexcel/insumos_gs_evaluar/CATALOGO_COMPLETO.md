# 📚 CATÁLOGO COMPLETO - GESTIÓN DE INSUMOS Y COSTOS

## 📊 RESUMEN EJECUTIVO

| Catálogo | Cantidad | Archivo JSON | Archivo PHP |
|----------|----------|--------------|-------------|
| Tipos de Costos | 7 | `tipo_costos.json` | `tipo_costos_array.php` |
| Categorías | 82 | `categorias.json` | `categorias_array.php` |
| Detalles | 125 | `detalles.json` | `detalles_array.php` |
| Marcas | 316 | `marcas_unicas.json` | `marcas_array.php` |
| Unidades | 31 | `unidades_unicas.json` | `unidades_array.php` |
| **TOTAL** | **561** | - | - |

---

## 1️⃣ TIPOS DE COSTOS (7)

### Estructura
```json
{
  "id": 1,
  "nombre": "MANO DE OBRA",
  "codigo": "TC0000000001",
  "estado": 1
}
```

### Listado Completo

| ID | Código | Nombre |
|----|--------|--------|
| 1 | TC0000000001 | MANO DE OBRA |
| 2 | TC0000000002 | MATERIALES |
| 3 | TC0000000003 | EQUIPO |
| 4 | TC0000000004 | SUB-CONTRATOS |
| 5 | TC0000000005 | COSTOS AUXILIARES |
| 6 | TC0000000006 | GASTO GENERAL |
| 7 | TC0000000007 | REPUESTOS, COMBUSTIBLE Y LUBRICANTES |

---

## 2️⃣ CATEGORÍAS (82)

### Estructura
```json
{
  "id": 1,
  "nombre": "MANO DE OBRA",
  "estado": 1
}
```

### Agrupadas por Rango de ID

#### Principales (ID 1-20) - 13 categorías
1. MANO DE OBRA
2. SUB CONTRATA
3. MATERIALES
4. EQUIPOS
5. GASTOS GENERALES
6. SEGURIDAD
7. MANEJO AMBIENTAL
8. CAJA CHICA O.
10. CEMENTO
11. ACEROS
12. HERRAMIENTAS
13. EPPS
14. MAQUINARIA

#### Impuestos y Planilla (ID 26-41) - 13 categorías
26. IGV
27. RENTA
28. FACTURAS
30. PAGO DE VALORIZACION
33. PLANILLA
34. RH
35. ESSALUD
36. FONDO DE PENSIONES
37. RENTA 4ta CARTEGORIA
38. RENTA 5ta CARTEGORIA
39. VIDA LEY
40. CTS
41. PENSION

#### Equipamiento de Oficina (ID 56-93) - 25 categorías
56. IMPRESORAS
60. OFICINA
62. SILLAS
64. COMPUTADORA GA
65. COMPUTADORA GM
67. LAPTOPS
70. PLOTERS
71. PROYECTOR MULTIMEDIA
73. ESCRITORIOS
74. AUDIFONOS
75. TACHOS (LIMPIEZA)
79. MUEBLES
81. TELEFONOS
82. ESTABILIZADORES
83. CAMARA
84. CASE SWITCH/SSD
85. PARLANTES
86. PAD MOUSE
87. USB
88. FUENTE DE PODER
89. PROCESADOR
90. ADAPTADORES
91. ECRAN
92. ESTUFA
93. MONITOR

#### Servicios (ID 132-143) - 12 categorías
132. ALQUILER
133. INTERNET
134. TELEFONIA
135. AGUA
136. LUZ
137. LIMPIEZA
138. APLICATIVOS INFORMATICOS
139. PAGINA WEB
140. SOPORTE TECNICO
141. SOFTWARE
142. VIGILANCIA
143. IMPRESIÓN

#### Especiales (ID 330+) - 11 categorías
330. ROUTER
331. CARPAS
339. SCTR
340. PRESTAMOS
341. PAGO PERSONAL
342. CORRECTIVO
343. PREVENTIVO
346. MOV TIERRAS
347. PAVIMENTO
352. ENCOFRADOS
355. ARENA GRUESA

---

## 3️⃣ DETALLES (125)

### Estructura
```json
{
  "id": 1,
  "nombre": "PLANILLAS",
  "estado": 1
}
```

### Agrupados por Categoría

#### Planilla y Beneficios (ID 1-10) - 10 detalles
1. PLANILLAS
2. PENSION
3. CUARTOS
4. CAMAS , COLCHONES
5. ESSALUD
6. SINDICATO
7. FONDO DE PENSIONES
8. CONAFOVICER
9. RENTA 4ta CARTEGORIA
10. RENTA 5ta CARTEGORIA

#### Construcción (ID 11-45) - 35 detalles
11. MOV TIERRAS
12. PAVIMENTO
13. VEREDAS
14. CERRAJERIA
15. PINTURA
16. ENCOFRADOS
17. ADOQUINES
18. AFIRMADO
19. ACERO
20. AGREGADOS FINO
21. AGREGADO GRUESO
22. ADITIVOS
23. APARATOS SANITARIOS
24. ASFALTO
25. BLOQUES Y LADRILLOS
26. CEMENTO
27. CERAMICAS
28. CERRAJERIA
29. DETONANTE
30. POSTE DE CONCRETO
31. LOSETA
32. ELECTRICOS
33. GASFITERIA_A
34. GASFITERIA_D
35. TUBOS PVC
36. MADERA
37. PINTURA
38. CAJA DE AGUA
39. GRASA
40. GEOMEMBRANA
41. TAPAS DE CONCRETO
42. ORNAMENTALES
43. POLIMEROS
44. CONCRETO PREMEZCLADO
45. FLETE

#### Equipos y Combustibles (ID 46-52) - 7 detalles
46. HERRAMIENTAS
47. EQUIPOS PESADOS
48. EQUIPOS LIVIANOS
49. PETROLEO
50. GASOLINA
51. TOPOGRAFIA
52. MOVILIZACION

#### Servicios Generales (ID 53-68) - 16 detalles
53. SERVICIOS
54. PAGO PERSONAL
55. GASTOS DE ESTADIA
56. EQUIPOS DE SEGURIDAD
57. UTILES DE ESCRITORIO
58. HERRAMIENTAS DE OFICINA
59. CAMIONETA
60. GASTOS DE VISITA OBRA
61. PRIMAS DE FIANZA
62. SENCICO
63. ITF
64. SCTR
65. VIDA LEY
66. POLIZA CAR
67. LIQUIDACION DE OBRA
68. GASTOS DE LICITACION

#### Estudios y Permisos (ID 69-76) - 8 detalles
69. LABORATORIOS Y ESTUDIOS
70. PM ARQUEOLOGICO
71. ALQUILER LOCAL
72. REHUBICACION DE POSTES
73. DERECHO DE EXTRACCION
74. DERECHO DE AGUA
75. DONACIONES
76. EXPEDIENTE ADICIONAL

#### Seguridad (ID 77-81) - 5 detalles
77. E.P. INDIVIDUAL
78. E.P. COLECTIVA
79. SEÑALIZACION DE SEGURIDAD
80. EMERGENCIA EN SEGURIDAD
81. CAPACITACION EN SEGURIDAD

#### Medio Ambiente (ID 82-85) - 4 detalles
82. PLAN DE MANEJO AMBIENTAL
83. RESIDUOS SOLIDOS
84. MONITOREO DE AIRE Y RUIDO
85. MONITOREO DE AGUA

#### Otros (ID 90+) - 40 detalles
90. EQUIPOS PESADOS
99. PAGO PERSONAL
101. PAGO PERSONAL
102. NO PLANILLA
103. MOVILIDAD
104. TARRAJEO
105. MANO DE OBRA
106. HERRAMIENTAS DE OFICINA
107. UTILES DE ESCRITORIO
109. LABORATORIOS Y ESTUDIOS
110. PETROLEO
111. MOVILIZACION/DESMOVILIZACION
112. SERVICIOS
113. SINDICATO
114. SEÑALIZACION DE SEGURIDAD
115. CAMAS , COLCHONES
116. PAGO PERSONAL
117. HERRAMIENTAS
118. DESMOVILIZACION
119. PAGO PERSONAL
120. APARATOS SANITARIOS
121. HERRAMIENTAS
122. SINDICATO
123. CERAMICAS
124. PENSION
125. SCTR OBRA
126. PAGO PERSONAL
127. PAGO PERSONAL
130. MOVILIZACION/DESMOVILIZACION
131. MOVILIZACION/DESMOVILIZACION
132. PAGO OFICINA CENTRAL
133. DEVUELTOS
134. RECIBIDOS
137. GERENCIA
138. OBRAS
139. ADMINISTRACION
140. GERENCIA
141. OBRAS
142. ADMINISTRACION

### ⚠️ Nota: Detalles Duplicados
Hay algunos detalles que aparecen con diferentes IDs pero el mismo nombre:
- **PAGO PERSONAL**: IDs 54, 99, 101, 116, 119, 126, 127
- **CERRAJERIA**: IDs 14, 28
- **PINTURA**: IDs 15, 37
- **SINDICATO**: IDs 6, 113, 122
- **HERRAMIENTAS**: IDs 46, 117, 121
- **EQUIPOS PESADOS**: IDs 47, 90
- **MOVILIZACION/DESMOVILIZACION**: IDs 111, 130, 131

---

## 4️⃣ MARCAS (316)

Ver archivo: `marcas_unicas.json` o `marcas_array.php`

### Marcas más Comunes
- NACIONAL
- POELSA
- SIKA
- TRUPER
- BOSCH
- VISTONY
- etc.

---

## 5️⃣ UNIDADES (31)

### Listado Completo
1. BLISTER
2. BOL
3. CAJA
4. CIENT
5. CIL
6. CNTO
7. DIA
8. DOC
9. GBL
10. GLN
11. HM
12. JGO
13. KG
14. L
15. M
16. M2
17. M3
18. MES
19. MLL
20. MTR
21. P2
22. PAQ
23. PAR
24. PLN
25. PQT
26. PZ
27. PZA
28. RLL
29. SAC
30. UND
31. VAR

---

## 💻 EJEMPLOS DE USO

### PHP - Buscar Tipo de Costo
```php
<?php
require_once('tipo_costos_array.php');

$tipo = buscarTipoCostoPorCodigo($tipoCostos, 'TC0000000002');
echo $tipo['nombre']; // MATERIALES
?>
```

### PHP - Buscar Categoría
```php
<?php
require_once('categorias_array.php');

$categoria = buscarCategoriaPorId($categorias, 3);
echo $categoria['nombre']; // MATERIALES

$grupos = agruparCategoriasPorTipo($categorias);
print_r($grupos['principales']);
?>
```

### PHP - Buscar Detalle
```php
<?php
require_once('detalles_array.php');

$detalle = buscarDetallePorId($detalles, 19);
echo $detalle['nombre']; // ACERO

$detallesConstruccion = obtenerDetallesPorRango($detalles, 11, 45);
print_r($detallesConstruccion);
?>
```

### PHP - Buscar Marca
```php
<?php
require_once('marcas_array.php');

$marca = buscarMarcaPorNombre($marcas, 'NACIONAL');
if ($marca) {
    echo "Marca encontrada: " . $marca['nombre'];
}
?>
```

---

## 📦 ARCHIVOS DISPONIBLES

### JSON
- `tipo_costos.json` (7 registros)
- `categorias.json` (82 registros)
- `detalles.json` (125 registros)
- `marcas_unicas.json` (316 registros)
- `unidades_unicas.json` (31 registros)

### PHP
- `tipo_costos_array.php`
- `categorias_array.php`
- `detalles_array.php`
- `marcas_array.php`
- `unidades_array.php`

### Consolidados
- `categorias_consolidado.php` (Clase unificada)
- `categorias_info.json` (Info detallada)
- `CATALOGO_COMPLETO.md` (Este archivo)

---

## 🎯 JERARQUÍA SUGERIDA

```
TIPO_COSTO (7)
  └── CATEGORIA (82)
      └── DETALLE (125)
          └── INSUMO/PRODUCTO
              ├── MARCA (316)
              └── UNIDAD (31)
```

### Ejemplo Jerárquico
```
MATERIALES (Tipo de Costo)
  └── CEMENTO (Categoría)
      └── CEMENTO (Detalle)
          └── CEMENTO TIPO I (Insumo)
              ├── Marca: ANDINO
              └── Unidad: BOL
```

---

*Última actualización: 2025-10-18*
*Total de elementos en catálogo: 561*


