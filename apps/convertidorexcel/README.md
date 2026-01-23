# Excel to JSON Converter

Una aplicación Vue 3 con Vuetify 3 para convertir archivos Excel (.xlsx, .xls) a formato JSON o Array.

## Características

- ✅ Interfaz moderna con Vuetify 3
- ✅ Soporte para archivos .xlsx y .xls
- ✅ Conversión a JSON con encabezados como claves
- ✅ Conversión a Array simple
- ✅ Selección de hoja de cálculo específica
- ✅ Vista previa de datos en tabla
- ✅ Descarga del resultado como archivo JSON
- ✅ Interfaz responsive y fácil de usar

## Instalación

1. Navega al directorio de la aplicación:
```bash
cd apps
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Uso

1. **Subir archivo**: Haz clic en "Seleccionar archivo Excel" y elige tu archivo .xlsx o .xls
2. **Configurar opciones**:
   - Selecciona el formato de salida (JSON o Array)
   - Elige la hoja de cálculo específica (opcional)
   - Activa/desactiva "Incluir encabezados como claves"
3. **Convertir**: Haz clic en "Convertir a JSON/ARRAY"
4. **Ver resultado**: Revisa la vista previa en tabla o el código JSON
5. **Descargar**: Haz clic en "Descargar" para guardar el resultado

## Formato de salida

### JSON con encabezados
```json
[
  {
    "Nombre": "Juan",
    "Edad": 25,
    "Ciudad": "Madrid"
  },
  {
    "Nombre": "María",
    "Edad": 30,
    "Ciudad": "Barcelona"
  }
]
```

### Array simple
```json
[
  ["Nombre", "Edad", "Ciudad"],
  ["Juan", 25, "Madrid"],
  ["María", 30, "Barcelona"]
]
```

## Tecnologías utilizadas

- Vue 3 (Composition API)
- Vuetify 3
- XLSX.js para lectura de archivos Excel
- Vite como bundler
- Material Design Icons

## Estructura del proyecto

```
apps/
├── src/
│   ├── App.vue          # Componente principal
│   └── main.js          # Punto de entrada
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.js       # Configuración de Vite
└── README.md           # Este archivo
```
