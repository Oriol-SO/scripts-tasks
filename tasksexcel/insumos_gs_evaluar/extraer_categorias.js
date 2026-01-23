const fs = require('fs');
const path = require('path');

// Leer el archivo JSON sin duplicados
const filePath = path.join(__dirname, 'insumos_sin_duplicados.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`📊 Total de registros a procesar: ${data.length}`);

// Conjuntos para almacenar valores únicos
const marcasSet = new Set();
const unidadesSet = new Set();
const insumosSet = new Set();
const detallesSet = new Set();

// Contadores para estadísticas
let registrosConMarca = 0;
let registrosConUnd = 0;
let registrosConInsumo = 0;
let registrosConDetalle = 0;

// Función para normalizar y limpiar valores
function limpiarValor(valor) {
  if (!valor || valor === null || valor === undefined) return null;
  const valorLimpio = valor.toString().trim();
  if (valorLimpio === '' || valorLimpio.toUpperCase() === 'NULL' || valorLimpio === '0') return null;
  return valorLimpio;
}

console.log('🔍 Extrayendo categorías únicas...');

// Procesar cada registro
data.forEach((registro, index) => {
  // Extraer MARCA
  const marca = limpiarValor(registro.MARCA);
  if (marca) {
    marcasSet.add(marca);
    registrosConMarca++;
  }

  // Extraer UND (Unidad)
  const und = limpiarValor(registro.UND);
  if (und) {
    unidadesSet.add(und);
    registrosConUnd++;
  }

  // Extraer INSUMO
  const insumo = limpiarValor(registro.INSUMO);
  if (insumo) {
    insumosSet.add(insumo);
    registrosConInsumo++;
  }

  // Extraer DETALLE
  const detalle = limpiarValor(registro.DETALLE);
  if (detalle) {
    detallesSet.add(detalle);
    registrosConDetalle++;
  }

  // Mostrar progreso cada 1000 registros
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${data.length}`);
  }
});

// Convertir Sets a Arrays ordenados
const marcas = Array.from(marcasSet).sort();
const unidades = Array.from(unidadesSet).sort();
const insumos = Array.from(insumosSet).sort();
const detalles = Array.from(detallesSet).sort();

console.log('\n✅ Extracción completada!');

// Crear objeto con todas las categorías
const categorias = {
  marcas: {
    total: marcas.length,
    registrosConDato: registrosConMarca,
    valores: marcas
  },
  unidades: {
    total: unidades.length,
    registrosConDato: registrosConUnd,
    valores: unidades
  },
  insumos: {
    total: insumos.length,
    registrosConDato: registrosConInsumo,
    valores: insumos
  },
  detalles: {
    total: detalles.length,
    registrosConDato: registrosConDetalle,
    valores: detalles
  }
};

// Guardar archivo con todas las categorías
const archivoCategorias = path.join(__dirname, 'categorias_extraidas.json');
fs.writeFileSync(archivoCategorias, JSON.stringify(categorias, null, 2));

// Guardar archivos individuales para cada categoría
const archivoMarcas = path.join(__dirname, 'marcas_unicas.json');
fs.writeFileSync(archivoMarcas, JSON.stringify({ total: marcas.length, marcas: marcas }, null, 2));

const archivoUnidades = path.join(__dirname, 'unidades_unicas.json');
fs.writeFileSync(archivoUnidades, JSON.stringify({ total: unidades.length, unidades: unidades }, null, 2));

const archivoInsumos = path.join(__dirname, 'insumos_unicos.json');
fs.writeFileSync(archivoInsumos, JSON.stringify({ total: insumos.length, insumos: insumos }, null, 2));

const archivoDetalles = path.join(__dirname, 'detalles_unicos.json');
fs.writeFileSync(archivoDetalles, JSON.stringify({ total: detalles.length, detalles: detalles }, null, 2));

// Crear un resumen más detallado
const resumen = {
  totalRegistros: data.length,
  categorias: {
    marcas: {
      total: marcas.length,
      registrosConDato: registrosConMarca,
      registrosSinDato: data.length - registrosConMarca,
      cobertura: ((registrosConMarca / data.length) * 100).toFixed(2) + '%'
    },
    unidades: {
      total: unidades.length,
      registrosConDato: registrosConUnd,
      registrosSinDato: data.length - registrosConUnd,
      cobertura: ((registrosConUnd / data.length) * 100).toFixed(2) + '%'
    },
    insumos: {
      total: insumos.length,
      registrosConDato: registrosConInsumo,
      registrosSinDato: data.length - registrosConInsumo,
      cobertura: ((registrosConInsumo / data.length) * 100).toFixed(2) + '%'
    },
    detalles: {
      total: detalles.length,
      registrosConDato: registrosConDetalle,
      registrosSinDato: data.length - registrosConDetalle,
      cobertura: ((registrosConDetalle / data.length) * 100).toFixed(2) + '%'
    }
  },
  ejemplos: {
    marcas: marcas.slice(0, 10),
    unidades: unidades.slice(0, 10),
    insumos: insumos.slice(0, 10),
    detalles: detalles.slice(0, 10)
  }
};

const archivoResumen = path.join(__dirname, 'resumen_categorias.json');
fs.writeFileSync(archivoResumen, JSON.stringify(resumen, null, 2));

// Mostrar resumen en consola
console.log('\n📋 RESUMEN DE EXTRACCIÓN:');
console.log('═══════════════════════════════════════════════════');
console.log(`📊 Total de registros procesados: ${data.length}`);
console.log('\n🏷️  MARCAS:');
console.log(`   Total únicas: ${marcas.length}`);
console.log(`   Registros con marca: ${registrosConMarca} (${resumen.categorias.marcas.cobertura})`);
console.log(`   Registros sin marca: ${data.length - registrosConMarca}`);

console.log('\n📏 UNIDADES (UND):');
console.log(`   Total únicas: ${unidades.length}`);
console.log(`   Registros con unidad: ${registrosConUnd} (${resumen.categorias.unidades.cobertura})`);
console.log(`   Registros sin unidad: ${data.length - registrosConUnd}`);

console.log('\n📦 INSUMOS:');
console.log(`   Total únicos: ${insumos.length}`);
console.log(`   Registros con insumo: ${registrosConInsumo} (${resumen.categorias.insumos.cobertura})`);
console.log(`   Registros sin insumo: ${data.length - registrosConInsumo}`);

console.log('\n📝 DETALLES:');
console.log(`   Total únicos: ${detalles.length}`);
console.log(`   Registros con detalle: ${registrosConDetalle} (${resumen.categorias.detalles.cobertura})`);
console.log(`   Registros sin detalle: ${data.length - registrosConDetalle}`);

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═══════════════════════════════════════════════════');
console.log('📄 categorias_extraidas.json - Todas las categorías juntas');
console.log('📄 marcas_unicas.json - Lista de marcas únicas');
console.log('📄 unidades_unicas.json - Lista de unidades únicas');
console.log('📄 insumos_unicos.json - Lista de insumos únicos');
console.log('📄 detalles_unicos.json - Lista de detalles únicos');
console.log('📄 resumen_categorias.json - Resumen detallado con estadísticas');

console.log('\n📋 EJEMPLOS:');
console.log('═══════════════════════════════════════════════════');

if (marcas.length > 0) {
  console.log('\n🏷️  Primeras 10 MARCAS:');
  marcas.slice(0, 10).forEach((marca, index) => {
    console.log(`   ${index + 1}. ${marca}`);
  });
  if (marcas.length > 10) console.log(`   ... y ${marcas.length - 10} más`);
}

if (unidades.length > 0) {
  console.log('\n📏 Primeras 10 UNIDADES:');
  unidades.slice(0, 10).forEach((und, index) => {
    console.log(`   ${index + 1}. ${und}`);
  });
  if (unidades.length > 10) console.log(`   ... y ${unidades.length - 10} más`);
}

if (insumos.length > 0) {
  console.log('\n📦 Primeros 10 INSUMOS:');
  insumos.slice(0, 10).forEach((insumo, index) => {
    console.log(`   ${index + 1}. ${insumo}`);
  });
  if (insumos.length > 10) console.log(`   ... y ${insumos.length - 10} más`);
}

if (detalles.length > 0) {
  console.log('\n📝 Primeros 10 DETALLES:');
  detalles.slice(0, 10).forEach((detalle, index) => {
    console.log(`   ${index + 1}. ${detalle}`);
  });
  if (detalles.length > 10) console.log(`   ... y ${detalles.length - 10} más`);
}

console.log('\n✨ ¡Proceso completado exitosamente!');



