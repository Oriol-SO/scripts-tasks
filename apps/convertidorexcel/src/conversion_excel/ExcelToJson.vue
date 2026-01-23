<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3" class="pa-4">
          <v-card-title class="text-h5 mb-4">
            <v-icon left color="primary">mdi-upload</v-icon>
            Subir Archivo Excel
          </v-card-title>

          <v-file-input
            v-model="selectedFile"
            accept=".xlsx,.xls"
            label="Seleccionar archivo Excel"
            prepend-icon="mdi-file-excel"
            variant="outlined"
            :disabled="isProcessing"
            hint="Formatos soportados: .xlsx, .xls"
            persistent-hint
            show-size
            chips
            multiple="false"
          />
          
          <!-- Botón alternativo para debug -->
          <v-btn
            v-if="selectedFile && selectedFile.length > 0"
            color="info"
            variant="outlined"
            size="small"
            @click="debugFileInfo"
            class="mt-2"
          >
            <v-icon left>mdi-bug</v-icon>
            Debug Info
          </v-btn>

          <v-divider class="my-4" />

          <v-card-title class="text-h6 mb-2">
            <v-icon left color="secondary">mdi-cog</v-icon>
            Opciones de Conversión
          </v-card-title>

          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                v-model="outputFormat"
                :items="formatOptions"
                label="Formato de salida"
                variant="outlined"
                :disabled="isProcessing"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="sheetName"
                :items="sheetNames"
                label="Hoja de cálculo"
                variant="outlined"
                :disabled="isProcessing || !selectedFile"
                :loading="isLoadingSheets"
                clearable
                hint="Selecciona una hoja específica o deja vacío para usar la primera"
                persistent-hint
              />
            </v-col>
          </v-row>

          <v-switch
            v-model="includeHeaders"
            label="Incluir encabezados como claves"
            color="primary"
            :disabled="isProcessing"
            class="mt-2"
          />

          <v-btn
            color="primary"
            size="large"
            block
            @click="convertFile"
            :loading="isProcessing"
            :disabled="!selectedFile"
            class="mt-4"
          >
            <v-icon left>mdi-convert</v-icon>
            Convertir a {{ outputFormat.toUpperCase() }}
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

    <!-- Resultado -->
    <v-row v-if="convertedData" justify="center" class="mt-4">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              <v-icon left color="success">mdi-check-circle</v-icon>
              Resultado de la Conversión
            </span>
            <v-btn
              color="primary"
              variant="outlined"
              @click="downloadResult"
              :disabled="!convertedData"
            >
              <v-icon left>mdi-download</v-icon>
              Descargar
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-tabs v-model="activeTab" color="primary">
              <v-tab value="preview">
                <v-icon left>mdi-eye</v-icon>
                Vista Previa
              </v-tab>
              <v-tab value="raw">
                <v-icon left>mdi-code-json</v-icon>
                Código
              </v-tab>
            </v-tabs>

            <v-tabs-window v-model="activeTab" class="mt-4">
              <v-tabs-window-item value="preview">
                <v-data-table
                  :headers="tableHeaders"
                  :items="tableData"
                  :items-per-page="10"
                  class="elevation-1 small-table"
                  density="compact"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="raw">
                <v-textarea
                  :model-value="JSON.stringify(convertedData, null, 2)"
                  readonly
                  variant="outlined"
                  rows="20"
                  class="font-family-monospace small-text"
                />
              </v-tabs-window-item>
            </v-tabs-window>
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
const outputFormat = ref('json')
const includeHeaders = ref(true)
const sheetName = ref('')
const isProcessing = ref(false)
const isLoadingSheets = ref(false)
const error = ref('')
const success = ref('')
const convertedData = ref(null)
const activeTab = ref('preview')

// Opciones de formato
const formatOptions = [
  { title: 'JSON', value: 'json' },
  { title: 'Array', value: 'array' }
]

// Nombres de hojas disponibles
const sheetNames = ref([])

// Headers para la tabla de vista previa
const tableHeaders = computed(() => {
  if (!convertedData.value || convertedData.value.length === 0) return []
  
  if (Array.isArray(convertedData.value)) {
    // Recopilar todas las claves únicas de todos los objetos
    const allKeys = new Set()
    convertedData.value.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key))
      }
    })
    
    if (allKeys.size > 0) {
      return Array.from(allKeys).map(key => ({
        title: key,
        key: key,
        sortable: true
      }))
    }
  }
  
  const firstItem = convertedData.value[0]
  if (typeof firstItem === 'object' && firstItem !== null) {
    return Object.keys(firstItem).map(key => ({
      title: key,
      key: key,
      sortable: true
    }))
  }
  return [{ title: 'Valor', key: 'value', sortable: true }]
})

// Datos para la tabla de vista previa
const tableData = computed(() => {
  if (!convertedData.value) return []
  
  if (Array.isArray(convertedData.value)) {
    // Obtener todas las claves únicas
    const allKeys = new Set()
    convertedData.value.forEach(item => {
      if (typeof item === 'object' && item !== null) {
        Object.keys(item).forEach(key => allKeys.add(key))
      }
    })
    
    const keysArray = Array.from(allKeys)
    
    return convertedData.value.map((item, index) => {
      if (typeof item === 'object' && item !== null) {
        // Crear un nuevo objeto con todas las claves, asegurando que todas estén presentes
        const completeItem = {}
        keysArray.forEach(key => {
          completeItem[key] = item.hasOwnProperty(key) ? item[key] : null
        })
        return completeItem
      }
      return { value: item, index }
    })
  }
  return [{ value: convertedData.value }]
})

// Manejar selección de archivo
const handleFileSelect = (file) => {
  console.log('handleFileSelect called with:', file)
  console.log('Type of file:', typeof file)
  console.log('Is array:', Array.isArray(file))
  
  // Vuetify v-file-input puede pasar el archivo de diferentes maneras
  let fileObj = null
  
  if (Array.isArray(file)) {
    // Si es un array, tomar el primer elemento
    fileObj = file.length > 0 ? file[0] : null
  } else if (file && typeof file === 'object' && file.name) {
    // Si es directamente un objeto File
    fileObj = file
  } else if (file && file instanceof File) {
    // Si es una instancia de File
    fileObj = file
  }
  
  console.log('Extracted fileObj:', fileObj)
  
  if (!fileObj) {
    console.log('No valid file object found, clearing state')
    selectedFile.value = null
    sheetNames.value = []
    sheetName.value = ''
    convertedData.value = null
    error.value = ''
    return
  }

  console.log('File selected:', fileObj.name, 'Type:', fileObj.type, 'Size:', fileObj.size)

  // Limpiar errores previos
  error.value = ''
  success.value = ''
  isLoadingSheets.value = true

  // Leer el archivo para obtener los nombres de las hojas
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      console.log('FileReader onload triggered')
      const data = new Uint8Array(e.target.result)
      console.log('Data length:', data.length)
      
      const workbook = XLSX.read(data, { type: 'array' })
      console.log('Workbook loaded:', workbook)
      console.log('Sheet names:', workbook.SheetNames)
      
      if (workbook.SheetNames && workbook.SheetNames.length > 0) {
        sheetNames.value = workbook.SheetNames.map(name => ({
          title: name,
          value: name
        }))
        sheetName.value = workbook.SheetNames[0]
        console.log('Sheet names set:', sheetNames.value)
        console.log('Default sheet selected:', sheetName.value)
      } else {
        console.log('No sheets found in workbook')
        sheetNames.value = []
        sheetName.value = ''
        error.value = 'No se encontraron hojas en el archivo Excel'
      }
    } catch (err) {
      console.error('Error reading file:', err)
      error.value = 'Error al leer el archivo: ' + err.message
      sheetNames.value = []
      sheetName.value = ''
    } finally {
      isLoadingSheets.value = false
    }
  }
  
  reader.onerror = (e) => {
    console.error('FileReader error:', e)
    error.value = 'Error al leer el archivo'
    sheetNames.value = []
    sheetName.value = ''
    isLoadingSheets.value = false
  }
  
  reader.readAsArrayBuffer(fileObj)
}

// Función de debug para información del archivo
const debugFileInfo = () => {
  console.log('=== DEBUG FILE INFO ===')
  console.log('selectedFile.value:', selectedFile.value)
  console.log('Type:', typeof selectedFile.value)
  console.log('Is array:', Array.isArray(selectedFile.value))
  
  if (selectedFile.value && selectedFile.value.length > 0) {
    const file = selectedFile.value[0]
    console.log('File object:', file)
    console.log('File name:', file.name)
    console.log('File type:', file.type)
    console.log('File size:', file.size)
    console.log('File lastModified:', file.lastModified)
    console.log('Is File instance:', file instanceof File)
  }
  console.log('========================')
}

// Función para convertir valores vacíos a null
const convertEmptyToNull = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        return convertEmptyToNull(item)
      } else if (item === '' || item === undefined) {
        return null
      } else if (Array.isArray(item)) {
        return convertEmptyToNull(item)
      }
      return item
    })
  } else if (typeof data === 'object' && data !== null) {
    const result = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key]
        if (value === '' || value === undefined) {
          result[key] = null
        } else if (typeof value === 'object' && value !== null) {
          result[key] = convertEmptyToNull(value)
        } else if (Array.isArray(value)) {
          result[key] = convertEmptyToNull(value)
        } else {
          result[key] = value
        }
      }
    }
    return result
  }
  return data
}

// Función para normalizar objetos en un array para que todos tengan las mismas claves
const normalizeObjects = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return data
  }

  // Verificar si todos los elementos son objetos
  const allObjects = data.every(item => typeof item === 'object' && item !== null && !Array.isArray(item))
  
  if (!allObjects) {
    return data
  }

  // Recopilar todas las claves únicas de todos los objetos
  const allKeys = new Set()
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => allKeys.add(key))
    }
  })

  const keysArray = Array.from(allKeys)

  // Normalizar cada objeto para que tenga todas las claves
  return data.map(item => {
    if (typeof item === 'object' && item !== null) {
      const normalizedItem = {}
      keysArray.forEach(key => {
        normalizedItem[key] = item.hasOwnProperty(key) ? item[key] : null
      })
      return normalizedItem
    }
    return item
  })
}

// Convertir archivo
const convertFile = async () => {
  console.log('convertFile called')
  
  if (!selectedFile.value || selectedFile.value.length === 0) {
    error.value = 'Por favor selecciona un archivo'
    return
  }

  isProcessing.value = true
  error.value = ''
  success.value = ''

  try {
    const file = selectedFile.value[0]
    console.log('Converting file:', file.name)
    console.log('Selected sheet:', sheetName.value)
    console.log('Output format:', outputFormat.value)
    console.log('Include headers:', includeHeaders.value)
    
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        console.log('FileReader onload for conversion')
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        console.log('Workbook loaded for conversion:', workbook.SheetNames)
        
        let worksheet
        if (sheetName.value && workbook.Sheets[sheetName.value]) {
          worksheet = workbook.Sheets[sheetName.value]
          console.log('Using selected sheet:', sheetName.value)
        } else {
          worksheet = workbook.Sheets[workbook.SheetNames[0]]
          console.log('Using first sheet:', workbook.SheetNames[0])
        }

        if (!worksheet) {
          throw new Error('No se pudo encontrar la hoja de cálculo')
        }

        let result
        if (outputFormat.value === 'json') {
          if (includeHeaders.value) {
            result = XLSX.utils.sheet_to_json(worksheet)
            console.log('Converted to JSON with headers:', result.length, 'rows')
          } else {
            result = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            console.log('Converted to JSON array:', result.length, 'rows')
          }
        } else {
          result = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          console.log('Converted to Array:', result.length, 'rows')
        }

        // Convertir valores vacíos a null
        result = convertEmptyToNull(result)
        
        // Normalizar objetos para que todos tengan las mismas claves (solo si es array de objetos)
        if (Array.isArray(result) && outputFormat.value === 'json' && includeHeaders.value) {
          result = normalizeObjects(result)
        }

        convertedData.value = result
        success.value = `Archivo convertido exitosamente. ${Array.isArray(result) ? result.length : 1} elementos procesados.`
        activeTab.value = 'preview'
        console.log('Conversion completed successfully')
      } catch (err) {
        console.error('Error processing file:', err)
        error.value = 'Error al procesar el archivo: ' + err.message
      } finally {
        isProcessing.value = false
      }
    }

    reader.onerror = (e) => {
      console.error('FileReader error during conversion:', e)
      error.value = 'Error al leer el archivo'
      isProcessing.value = false
    }

    reader.readAsArrayBuffer(file)
  } catch (err) {
    console.error('Error in convertFile:', err)
    error.value = 'Error: ' + err.message
    isProcessing.value = false
  }
}

// Descargar resultado
const downloadResult = () => {
  if (!convertedData.value) return

  const dataStr = JSON.stringify(convertedData.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `converted_data_${new Date().getTime()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Limpiar datos cuando se cambia el archivo
watch(selectedFile, (newFile) => {
  console.log('selectedFile watcher triggered with:', newFile)
  
  if (!newFile || (Array.isArray(newFile) && newFile.length === 0)) {
    convertedData.value = null
    error.value = ''
    success.value = ''
    sheetNames.value = []
    sheetName.value = ''
    return
  }
  
  // Si hay un archivo nuevo, procesarlo
  if (newFile) {
    handleFileSelect(newFile)
  }
})
</script>

<style scoped>
.font-family-monospace {
  font-family: 'Courier New', Courier, monospace;
}

.small-table :deep(.v-data-table) {
  font-size: 0.65rem !important;
}

.small-table :deep(.v-data-table th),
.small-table :deep(.v-data-table td) {
  font-size: 0.65rem !important;
  padding: 4px 8px !important;
}

.small-table :deep(.v-data-table-header) {
  font-size: 0.65rem !important;
}

.small-text {
  font-size: 0.65rem !important;
}
</style>

