<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3" class="pa-4">
          <v-card-title class="text-h5 mb-4">
            <v-icon left color="primary">mdi-upload</v-icon>
            Convertir JSON a Excel
          </v-card-title>

          <v-tabs v-model="inputMethod" color="primary" class="mb-4">
            <v-tab value="file">
              <v-icon left>mdi-file-upload</v-icon>
              Subir Archivo
            </v-tab>
            <v-tab value="paste">
              <v-icon left>mdi-content-paste</v-icon>
              Pegar JSON
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="inputMethod">
            <!-- Método: Subir archivo -->
            <v-tabs-window-item value="file">
              <v-file-input
                v-model="selectedFile"
                accept=".json,application/json"
                label="Seleccionar archivo JSON"
                prepend-icon="mdi-file-code"
                variant="outlined"
                :disabled="isProcessing"
                hint="Formato soportado: .json"
                persistent-hint
                show-size
                chips
                multiple="false"
              />
            </v-tabs-window-item>

            <!-- Método: Pegar JSON -->
            <v-tabs-window-item value="paste">
              <v-textarea
                v-model="jsonText"
                label="Pegar o escribir JSON aquí"
                variant="outlined"
                rows="10"
                :disabled="isProcessing"
                hint="Asegúrate de que el JSON sea válido"
                persistent-hint
                class="font-family-monospace"
              />
            </v-tabs-window-item>
          </v-tabs-window>

          <v-divider class="my-4" />

          <v-card-title class="text-h6 mb-2">
            <v-icon left color="secondary">mdi-cog</v-icon>
            Opciones de Conversión
          </v-card-title>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="sheetName"
                label="Nombre de la hoja"
                variant="outlined"
                :disabled="isProcessing"
                hint="Nombre para la hoja de Excel (opcional)"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="fileName"
                label="Nombre del archivo"
                variant="outlined"
                :disabled="isProcessing"
                hint="Nombre para el archivo Excel (sin extensión)"
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-switch
            v-model="flattenNested"
            label="Aplanar objetos anidados"
            color="primary"
            :disabled="isProcessing"
            class="mt-2"
            hint="Convierte objetos anidados en columnas separadas (ej: usuario.nombre)"
            persistent-hint
          />

          <v-btn
            color="primary"
            size="large"
            block
            @click="downloadExcel"
            :loading="isProcessing"
            :disabled="!excelData"
            class="mt-4"
          >
            <v-icon left>mdi-download</v-icon>
            Descargar Excel
          </v-btn>

          <v-alert
            v-if="error"
            type="error"
            class="mt-4"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <v-alert
            v-if="success"
            type="success"
            class="mt-4"
            closable
            @click:close="success = ''"
          >
            {{ success }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Vista previa de datos -->
    <v-row v-if="allProcessedData && allProcessedData.length > 0" justify="center" class="mt-4">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              <v-icon left color="info">mdi-eye</v-icon>
              Vista Previa de Datos
            </span>
            <v-btn
              color="primary"
              variant="outlined"
              @click="downloadExcel"
              :disabled="!excelData"
            >
              <v-icon left>mdi-download</v-icon>
              Descargar Excel
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Buscar en la tabla"
              variant="outlined"
              density="compact"
              clearable
              class="mb-4"
            />
            <v-data-table
              :headers="tableHeaders"
              :items="filteredData"
              :items-per-page="25"
              :search="searchQuery"
              class="elevation-1"
              density="compact"
            >
              <template v-slot:top>
                <div class="d-flex align-center justify-space-between pa-2">
                  <span class="text-body-2">
                    Mostrando {{ filteredData.length }} de {{ allProcessedData.length }} registros
                  </span>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import * as XLSX from 'xlsx'

// Estado reactivo
const selectedFile = ref(null)
const jsonText = ref('')
const inputMethod = ref('file')
const sheetName = ref('Datos')
const fileName = ref('converted_data')
const flattenNested = ref(false)
const isProcessing = ref(false)
const error = ref('')
const success = ref('')
const previewData = ref([])
const allProcessedData = ref([])
const excelData = ref(null)
const searchQuery = ref('')

// Validar si hay entrada válida
const hasValidInput = computed(() => {
  if (inputMethod.value === 'file') {
    return selectedFile.value && selectedFile.value.length > 0
  } else {
    return jsonText.value.trim().length > 0
  }
})

// Headers para la tabla de vista previa
const tableHeaders = computed(() => {
  if (!allProcessedData.value || allProcessedData.value.length === 0) return []
  
  const firstItem = allProcessedData.value[0]
  if (typeof firstItem === 'object' && firstItem !== null) {
    return Object.keys(firstItem).map(key => ({
      title: key,
      key: key,
      sortable: true
    }))
  }
  return [{ title: 'Valor', key: 'value', sortable: true }]
})

// Datos filtrados para la tabla
const filteredData = computed(() => {
  if (!searchQuery.value) {
    return allProcessedData.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return allProcessedData.value.filter(item => {
    if (typeof item === 'object' && item !== null) {
      return Object.values(item).some(value => {
        const strValue = String(value || '').toLowerCase()
        return strValue.includes(query)
      })
    }
    return String(item || '').toLowerCase().includes(query)
  })
})

// Función para aplanar objetos anidados
const flattenObject = (obj, prefix = '') => {
  const flattened = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey))
      } else if (Array.isArray(obj[key])) {
        // Para arrays, convertirlos a string JSON
        flattened[newKey] = JSON.stringify(obj[key])
      } else {
        flattened[newKey] = obj[key]
      }
    }
  }
  
  return flattened
}

// Validar JSON
const validateJson = () => {
  try {
    const parsed = JSON.parse(jsonText.value)
    error.value = ''
    success.value = 'JSON válido ✓'
    return true
  } catch (err) {
    error.value = 'JSON inválido: ' + err.message
    success.value = ''
    return false
  }
}

// Procesar datos JSON
const processJsonData = (data) => {
  let processedData = []

  // Si es un array, usar directamente
  if (Array.isArray(data)) {
    processedData = data
  } 
  // Si es un objeto, convertirlo a array
  else if (typeof data === 'object' && data !== null) {
    // Si el objeto tiene una propiedad que es un array, usar ese array
    const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]))
    if (arrayKeys.length > 0) {
      processedData = data[arrayKeys[0]]
    } else {
      // Si no, convertir el objeto en un array de un elemento
      processedData = [data]
    }
  } else {
    throw new Error('El JSON debe ser un objeto o un array')
  }

  // Aplicar aplanado si está habilitado
  if (flattenNested.value) {
    processedData = processedData.map(item => {
      if (typeof item === 'object' && item !== null) {
        return flattenObject(item)
      }
      return item
    })
  }

  return processedData
}

// Procesar JSON automáticamente
const processJsonAutomatically = async () => {
  isProcessing.value = true
  error.value = ''
  success.value = ''
  allProcessedData.value = []
  excelData.value = null

  try {
    let jsonData

    // Obtener datos según el método de entrada
    if (inputMethod.value === 'file') {
      if (!selectedFile.value || selectedFile.value.length === 0) {
        isProcessing.value = false
        return
      }

      const file = selectedFile.value[0]
      const text = await file.text()
      jsonData = JSON.parse(text)
    } else {
      if (!jsonText.value.trim()) {
        isProcessing.value = false
        return
      }
      jsonData = JSON.parse(jsonText.value)
    }

    // Procesar los datos
    const processedData = processJsonData(jsonData)

    if (processedData.length === 0) {
      throw new Error('No se encontraron datos para convertir')
    }

    // Guardar todos los datos procesados
    allProcessedData.value = processedData

    // Crear workbook
    const workbook = XLSX.utils.book_new()
    
    // Convertir datos a hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(processedData)
    
    // Agregar la hoja al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.value || 'Datos')

    // Guardar datos para descarga
    excelData.value = workbook

    success.value = `Datos procesados exitosamente. ${processedData.length} fila(s) cargada(s).`
  } catch (err) {
    console.error('Error processing JSON:', err)
    error.value = 'Error al procesar: ' + err.message
    allProcessedData.value = []
    excelData.value = null
  } finally {
    isProcessing.value = false
  }
}

// Descargar Excel
const downloadExcel = () => {
  if (!excelData.value) {
    error.value = 'No hay datos para descargar'
    return
  }

  try {
    const fileExtension = '.xlsx'
    const finalFileName = fileName.value || 'converted_data'
    const fullFileName = finalFileName.endsWith(fileExtension) 
      ? finalFileName 
      : finalFileName + fileExtension

    XLSX.writeFile(excelData.value, fullFileName)
    success.value = `Archivo ${fullFileName} descargado exitosamente`
  } catch (err) {
    console.error('Error downloading file:', err)
    error.value = 'Error al descargar el archivo: ' + err.message
  }
}

// Procesar automáticamente cuando cambia el archivo
watch(selectedFile, async (newFile) => {
  if (!newFile || (Array.isArray(newFile) && newFile.length === 0)) {
    allProcessedData.value = []
    excelData.value = null
    error.value = ''
    success.value = ''
    searchQuery.value = ''
    return
  }
  
  // Procesar automáticamente después de un pequeño delay
  await processJsonAutomatically()
})

// Procesar automáticamente cuando cambia el texto JSON (con debounce)
let jsonTextTimeout = null
watch(jsonText, () => {
  if (inputMethod.value !== 'paste') return
  
  // Limpiar timeout anterior
  if (jsonTextTimeout) {
    clearTimeout(jsonTextTimeout)
  }
  
  // Esperar 1 segundo después de que el usuario deje de escribir
  jsonTextTimeout = setTimeout(async () => {
    if (jsonText.value.trim()) {
      await processJsonAutomatically()
    } else {
      allProcessedData.value = []
      excelData.value = null
      error.value = ''
      success.value = ''
      searchQuery.value = ''
    }
  }, 1000)
})

// Reprocesar cuando cambia la opción de aplanar
watch(flattenNested, async () => {
  if (hasValidInput.value) {
    await processJsonAutomatically()
  }
})

// Regenerar Excel cuando cambia el nombre de la hoja (solo si ya hay datos)
watch(sheetName, () => {
  if (allProcessedData.value && allProcessedData.value.length > 0) {
    try {
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(allProcessedData.value)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.value || 'Datos')
      excelData.value = workbook
    } catch (err) {
      console.error('Error regenerating Excel:', err)
    }
  }
})

// Limpiar datos cuando se cambia el método de entrada
watch(inputMethod, () => {
  error.value = ''
  success.value = ''
  allProcessedData.value = []
  excelData.value = null
  searchQuery.value = ''
  
  // Procesar automáticamente si hay datos válidos
  if (hasValidInput.value) {
    processJsonAutomatically()
  }
})
</script>

<style scoped>
.font-family-monospace {
  font-family: 'Courier New', Courier, monospace;
}
</style>

