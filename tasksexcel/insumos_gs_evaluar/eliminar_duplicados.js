const fs = require('fs');
const path = require('path');

// Leer el archivo JSON
const filePath = path.join(__dirname, 'insumos.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`📊 Total de registros originales: ${data.length}`);

// Crear un Map para almacenar registros únicos
// La clave será la combinación de INSUMO + DETALLE + DESCRIPCIÓN
const registrosUnicos = new Map();
const duplicados = [];
const registrosProcesados = [];

// Función para normalizar texto (eliminar espacios extra, convertir a mayúsculas)
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto.toString().trim().toUpperCase();
}

// Función para crear clave única
function crearClave(registro) {
  const insumo = normalizarTexto(registro.INSUMO);
  const detalle = normalizarTexto(registro.DETALLE);
  const descripcion = normalizarTexto(registro.DESCRIPCIÓN);
  
  return `${insumo}|${detalle}|${descripcion}`;
}

console.log('🔍 Analizando duplicados...');

// Procesar cada registro
data.forEach((registro, index) => {
  const clave = crearClave(registro);
  
  if (registrosUnicos.has(clave)) {
    // Es un duplicado
    duplicados.push({
      original: registrosUnicos.get(clave),
      duplicado: registro,
      clave: clave
    });
    console.log(`❌ Duplicado encontrado en línea ${index + 1}: ${clave}`);
  } else {
    // Es único, agregarlo
    registrosUnicos.set(clave, registro);
    registrosProcesados.push(registro);
  }
});

console.log(`✅ Registros únicos: ${registrosProcesados.length}`);
console.log(`❌ Duplicados encontrados: ${duplicados.length}`);

// Guardar el archivo sin duplicados
const archivoSinDuplicados = path.join(__dirname, 'insumos_sin_duplicados.json');
fs.writeFileSync(archivoSinDuplicados, JSON.stringify(registrosProcesados, null, 2));

// Guardar reporte de duplicados
const reporteDuplicados = {
  resumen: {
    totalOriginal: data.length,
    totalUnicos: registrosProcesados.length,
    totalDuplicados: duplicados.length,
    porcentajeDuplicados: ((duplicados.length / data.length) * 100).toFixed(2) + '%'
  },
  duplicados: duplicados.map(dup => ({
    clave: dup.clave,
    original: {
      CODIGO: dup.original.CODIGO,
      INSUMO: dup.original.INSUMO,
      DETALLE: dup.original.DETALLE,
      DESCRIPCIÓN: dup.original.DESCRIPCIÓN,
      PRECIO: dup.original.PRECIO
    },
    duplicado: {
      CODIGO: dup.duplicado.CODIGO,
      INSUMO: dup.duplicado.INSUMO,
      DETALLE: dup.duplicado.DETALLE,
      DESCRIPCIÓN: dup.duplicado.DESCRIPCIÓN,
      PRECIO: dup.duplicado.PRECIO
    }
  }))
};

const archivoReporte = path.join(__dirname, 'reporte_duplicados.json');
fs.writeFileSync(archivoReporte, JSON.stringify(reporteDuplicados, null, 2));

console.log('\n📋 RESUMEN:');
console.log(`📊 Total original: ${data.length}`);
console.log(`✅ Únicos: ${registrosProcesados.length}`);
console.log(`❌ Duplicados: ${duplicados.length}`);
console.log(`📈 Porcentaje de duplicados: ${reporteDuplicados.resumen.porcentajeDuplicados}`);

console.log('\n💾 Archivos generados:');
console.log(`📄 insumos_sin_duplicados.json - ${registrosProcesados.length} registros únicos`);
console.log(`📊 reporte_duplicados.json - Reporte detallado de duplicados`);

// Mostrar algunos ejemplos de duplicados
if (duplicados.length > 0) {
  console.log('\n🔍 Ejemplos de duplicados encontrados:');
  duplicados.slice(0, 5).forEach((dup, index) => {
    console.log(`\n${index + 1}. Clave: ${dup.clave}`);
    console.log(`   Original (CODIGO: ${dup.original.CODIGO}): ${dup.original.INSUMO} | ${dup.original.DETALLE} | ${dup.original.DESCRIPCIÓN}`);
    console.log(`   Duplicado (CODIGO: ${dup.duplicado.CODIGO}): ${dup.duplicado.INSUMO} | ${dup.duplicado.DETALLE} | ${dup.duplicado.DESCRIPCIÓN}`);
  });
  
  if (duplicados.length > 5) {
    console.log(`   ... y ${duplicados.length - 5} duplicados más`);
  }
}
