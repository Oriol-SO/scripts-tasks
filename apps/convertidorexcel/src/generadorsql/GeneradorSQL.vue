<template>
  <v-container fluid class="pa-4">
    <!-- Sección SQL Generator -->
    <v-row justify="center" class="mb-4">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="3" class="pa-4">
          <v-card-title class="text-h5 mb-4">
            <v-icon left color="success">mdi-database</v-icon>
            Generador de SQL
          </v-card-title>

          <v-text-field
            v-model="sqlTableName"
            label="Nombre de la tabla"
            variant="outlined"
            prepend-icon="mdi-table"
            hint="Ejemplo: categorias, tipos, etc."
            persistent-hint
            class="mb-4"
          />

          <v-radio-group v-model="sqlInputMode" inline class="mb-4">
            <v-radio label="Lista simple" value="simple" />
            <v-radio label="Datos con columnas" value="columns" />
          </v-radio-group>

          <v-textarea
            v-if="sqlInputMode === 'simple'"
            v-model="sqlListInput"
            label="Lista de elementos (uno por línea)"
            variant="outlined"
            rows="6"
            hint="Ingresa cada elemento en una línea diferente"
            persistent-hint
            class="mb-4"
          />

          <div v-if="sqlInputMode === 'columns'">
            <v-text-field
              v-model="sqlColumnNames"
              label="Nombres de columnas (separados por coma)"
              variant="outlined"
              prepend-icon="mdi-table-column"
              hint="Ejemplo: nombre, codigo, estado, categoria_id"
              persistent-hint
              class="mb-4"
            />

            <v-textarea
              v-model="sqlColumnsInput"
              label="Datos (cada fila es un registro, separados por tabulación o coma)"
              variant="outlined"
              rows="8"
              hint="Pega los datos desde Excel. Cada fila es un registro."
              persistent-hint
              class="mb-4"
            />
            
            <v-alert
              v-if="detectedColumns.length > 0"
              type="info"
              class="mb-4"
              density="compact"
            >
              {{ detectedColumns.length }} columna(s) configurada(s)
            </v-alert>

            <v-card-title class="text-subtitle-1 mb-2" v-if="detectedColumns.length > 0">
              <v-icon left size="small">mdi-cog</v-icon>
              Configuración de Columnas
            </v-card-title>

            <v-card variant="outlined" class="pa-3 mb-4" v-if="detectedColumns.length > 0">
              <v-row v-for="(col, index) in detectedColumns" :key="index" align="center" class="mb-2">
                <v-col cols="12" sm="4">
                  <v-text-field
                    :model-value="col"
                    label="Nombre"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-select
                    v-model="columnConfigs[index].type"
                    :items="sqlFieldTypes"
                    label="Tipo"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="columnConfigs[index].defaultValue"
                    label="Valor por defecto"
                    variant="outlined"
                    density="compact"
                    placeholder="ej: 5, 'texto', NULL"
                    hint="Dejar vacío para NULL"
                    persistent-hint
                  />
                </v-col>
              </v-row>
            </v-card>
          </div>

          <v-card-title class="text-subtitle-1 mb-2">
            <v-icon left size="small">mdi-cog</v-icon>
            Campos Adicionales
          </v-card-title>

          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="sqlFields.id"
                label="ID (AUTO_INCREMENT)"
                color="primary"
                density="compact"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="sqlFields.estado"
                label="Estado (INT, default: 1)"
                color="primary"
                density="compact"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="sqlFields.created_at"
                label="created_at (TIMESTAMP)"
                color="primary"
                density="compact"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="sqlFields.updated_at"
                label="updated_at (TIMESTAMP)"
                color="primary"
                density="compact"
              />
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-checkbox
                v-model="sqlFields.codigo"
                label="Código (VARCHAR)"
                color="primary"
                density="compact"
              />
            </v-col>
          </v-row>

          <v-btn
            color="success"
            size="large"
            block
            @click="generateSQL"
            :disabled="isGenerateSQLDisabled"
            class="mt-4"
          >
            <v-icon left>mdi-code-tags</v-icon>
            Generar SQL
          </v-btn>

          <v-alert
            v-if="sqlError"
            type="error"
            class="mt-4"
            closable
            @click:close="sqlError = ''"
          >
            {{ sqlError }}
          </v-alert>

          <v-alert
            v-if="sqlSuccess"
            type="success"
            class="mt-4"
            closable
            @click:close="sqlSuccess = ''"
          >
            {{ sqlSuccess }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resultado SQL -->
    <v-row v-if="generatedSQL" justify="center" class="mb-4">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="3">
          <v-card-title class="d-flex justify-space-between align-center">
            <span>
              <v-icon left color="success">mdi-database-check</v-icon>
              SQL Generado
            </span>
            <v-btn
              color="primary"
              variant="outlined"
              @click="downloadSQL"
              :disabled="!generatedSQL"
            >
              <v-icon left>mdi-download</v-icon>
              Descargar SQL
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-textarea
              :model-value="generatedSQL"
              readonly
              variant="outlined"
              rows="20"
              class="font-family-monospace"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Estado SQL Generator
const sqlTableName = ref('')
const sqlListInput = ref('')
const sqlInputMode = ref('simple')
const sqlColumnNames = ref('')
const sqlColumnsInput = ref('')
const detectedColumns = ref([])
const columnConfigs = ref([])
const sqlFields = ref({
  id: true,
  estado: true,
  created_at: false,
  updated_at: false,
  codigo: false
})
const generatedSQL = ref('')
const sqlError = ref('')
const sqlSuccess = ref('')

// Tipos de campos SQL disponibles
const sqlFieldTypes = [
  { title: 'INT', value: 'INT' },
  { title: 'VARCHAR(255)', value: 'VARCHAR(255)' },
  { title: 'VARCHAR(100)', value: 'VARCHAR(100)' },
  { title: 'VARCHAR(50)', value: 'VARCHAR(50)' },
  { title: 'TEXT', value: 'TEXT' },
  { title: 'DECIMAL(10,2)', value: 'DECIMAL(10,2)' },
  { title: 'DATE', value: 'DATE' },
  { title: 'DATETIME', value: 'DATETIME' },
  { title: 'TIMESTAMP', value: 'TIMESTAMP' },
  { title: 'BOOLEAN', value: 'BOOLEAN' }
]

// Verificar si el botón de generar SQL debe estar deshabilitado
const isGenerateSQLDisabled = computed(() => {
  if (!sqlTableName.value || !sqlTableName.value.trim()) {
    return true
  }
  
  if (sqlInputMode.value === 'simple') {
    return !sqlListInput.value || !sqlListInput.value.trim()
  } else {
    // Modo con columnas
    return !sqlColumnNames.value || !sqlColumnNames.value.trim() || 
           !sqlColumnsInput.value || !sqlColumnsInput.value.trim()
  }
})

// Detectar columnas desde nombres ingresados
const detectColumns = () => {
  if (!sqlColumnNames.value.trim()) {
    detectedColumns.value = []
    columnConfigs.value = []
    return
  }
  
  // Obtener nombres de columnas separados por coma
  const columns = sqlColumnNames.value
    .split(',')
    .map(col => col.trim())
    .filter(col => col)
  
  if (columns.length === 0) {
    detectedColumns.value = []
    columnConfigs.value = []
    return
  }
  
  // Mantener configs existentes para columnas que ya existían
  const existingConfigs = [...columnConfigs.value]
  const newConfigs = []
  
  columns.forEach((col, index) => {
    // Si ya existe un config para este índice y el nombre coincide, mantenerlo
    if (existingConfigs[index] && detectedColumns.value[index] === col) {
      newConfigs.push(existingConfigs[index])
    } else {
      // Crear nuevo config con tipo por defecto
      newConfigs.push({
        type: 'VARCHAR(255)',
        defaultValue: ''
      })
    }
  })
  
  detectedColumns.value = columns
  columnConfigs.value = newConfigs
}

// Función auxiliar para formatear valores SQL
const formatSQLValue = (value) => {
  if (!value || value === 'NULL' || value.trim() === '') return 'NULL'
  
  const trimmed = value.trim()
  const upper = trimmed.toUpperCase()
  
  // Funciones SQL
  if (upper === 'NOW()' || upper === 'CURRENT_TIMESTAMP') {
    return trimmed
  }
  
  // Números
  if (/^\d+$/.test(trimmed)) {
    return trimmed
  }
  if (/^\d+\.\d+$/.test(trimmed)) {
    return trimmed
  }
  
  // Texto con comillas
  if (trimmed.startsWith("'") || trimmed.startsWith('"')) {
    return trimmed.replace(/'/g, "''")
  }
  
  // Texto sin comillas
  return `'${trimmed.replace(/'/g, "''")}'`
}

// Generar SQL (solo INSERTs)
const generateSQL = () => {
  sqlError.value = ''
  sqlSuccess.value = ''
  
  if (!sqlTableName.value.trim()) {
    sqlError.value = 'Por favor ingresa un nombre de tabla'
    return
  }
  
  try {
    const tableName = sqlTableName.value.trim().toLowerCase()
    const fields = sqlFields.value
    
    let insertSQL = ''
    let rows = 0
    
    if (sqlInputMode.value === 'simple') {
      // Modo simple: lista de elementos
      if (!sqlListInput.value.trim()) {
        sqlError.value = 'Por favor ingresa al menos un elemento en la lista'
        return
      }
      
      const items = sqlListInput.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      if (items.length === 0) {
        sqlError.value = 'No se encontraron elementos válidos en la lista'
        return
      }
      
      items.forEach((item, index) => {
        const insertFields = ['nombre']
        const insertValues = [formatSQLValue(item)]
        
        // Campos predefinidos
        if (fields.codigo) {
          insertFields.push('codigo')
          insertValues.push(formatSQLValue(String(index + 1).padStart(3, '0')))
        }
        
        if (fields.estado) {
          insertFields.push('estado')
          insertValues.push('1')
        }
        
        if (fields.created_at) {
          insertFields.push('created_at')
          insertValues.push('NOW()')
        }
        
        if (fields.updated_at) {
          insertFields.push('updated_at')
          insertValues.push('NOW()')
        }
        
        insertSQL += `INSERT INTO \`${tableName}\` (${insertFields.map(f => `\`${f}\``).join(', ')}) VALUES (${insertValues.join(', ')});\n`
        rows++
      })
    } else {
      // Modo con columnas
      if (!sqlColumnNames.value.trim()) {
        sqlError.value = 'Por favor ingresa los nombres de las columnas'
        return
      }
      
      if (!sqlColumnsInput.value.trim()) {
        sqlError.value = 'Por favor pega los datos'
        return
      }
      
      // Detectar columnas si no están detectadas
      if (detectedColumns.value.length === 0) {
        detectColumns()
      }
      
      if (detectedColumns.value.length === 0) {
        sqlError.value = 'No se pudieron detectar las columnas. Verifica los nombres ingresados.'
        return
      }
      
      const lines = sqlColumnsInput.value.split('\n').filter(line => line.trim())
      if (lines.length === 0) {
        sqlError.value = 'No hay datos para procesar'
        return
      }
      
      // Detectar separador (tab o coma) desde la primera línea de datos
      const hasTabs = lines[0]?.includes('\t')
      const separator = hasTabs ? '\t' : ','
      
      // Todas las filas son datos
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const values = line.split(separator).map(v => v.trim())
        
        if (values.length === 0 || values.every(v => !v)) continue
        
        const insertFields = []
        const insertValues = []
        
        // Procesar cada columna detectada
        detectedColumns.value.forEach((colName, colIndex) => {
          const config = columnConfigs.value[colIndex]
          const fieldName = colName // El nombre de la columna es el nombre del campo
          
          // Obtener el valor de los datos
          let value = values[colIndex] || ''
          value = value.trim()
          
          // Si hay valor en los datos, usarlo
          if (value) {
            insertFields.push(fieldName)
            insertValues.push(formatSQLValue(value))
          } 
          // Si no hay valor en los datos pero hay valor por defecto configurado, usarlo
          else if (config.defaultValue && config.defaultValue.trim()) {
            insertFields.push(fieldName)
            insertValues.push(formatSQLValue(config.defaultValue))
          }
          // Si no hay ni valor ni valor por defecto, no agregar el campo (será NULL o tendrá su default en la BD)
        })
        
        // Agregar campos predefinidos que no estén en las columnas
        if (fields.estado && !insertFields.includes('estado')) {
          insertFields.push('estado')
          insertValues.push('1')
        }
        
        if (fields.created_at && !insertFields.includes('created_at')) {
          insertFields.push('created_at')
          insertValues.push('NOW()')
        }
        
        if (fields.updated_at && !insertFields.includes('updated_at')) {
          insertFields.push('updated_at')
          insertValues.push('NOW()')
        }
        
        if (insertFields.length > 0) {
          insertSQL += `INSERT INTO \`${tableName}\` (${insertFields.map(f => `\`${f}\``).join(', ')}) VALUES (${insertValues.join(', ')});\n`
          rows++
        }
      }
    }
    
    if (rows === 0) {
      sqlError.value = 'No se generaron filas. Verifica los datos ingresados.'
      return
    }
    
    generatedSQL.value = insertSQL
    sqlSuccess.value = `SQL generado exitosamente. ${rows} filas procesadas.`
  } catch (err) {
    console.error('Error generating SQL:', err)
    sqlError.value = 'Error al generar SQL: ' + err.message
  }
}

// Descargar SQL
const downloadSQL = () => {
  if (!generatedSQL.value) return
  
  const dataBlob = new Blob([generatedSQL.value], { type: 'text/sql' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${sqlTableName.value || 'table'}_${new Date().getTime()}.sql`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Detectar columnas automáticamente cuando cambian los nombres de columnas
watch(sqlColumnNames, () => {
  if (sqlInputMode.value === 'columns') {
    detectColumns()
  }
})

// Detectar columnas cuando cambia el modo de entrada
watch(sqlInputMode, () => {
  if (sqlInputMode.value === 'columns' && sqlColumnNames.value) {
    detectColumns()
  } else {
    detectedColumns.value = []
    columnConfigs.value = []
  }
})
</script>

<style scoped>
.font-family-monospace {
  font-family: 'Courier New', Courier, monospace;
}
</style>

