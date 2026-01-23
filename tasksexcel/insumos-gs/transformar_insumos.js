const fs = require('fs');
const path = require('path');

console.log('🔄 Transformando insumos...\n');

// Leer todos los archivos necesarios
console.log('📂 Cargando archivos...');
const insumos = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos.json'), 'utf8'));
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, 'categorias.json'), 'utf8'));
const clases = JSON.parse(fs.readFileSync(path.join(__dirname, 'clases.json'), 'utf8'));
const subclases = JSON.parse(fs.readFileSync(path.join(__dirname, 'subclases.json'), 'utf8'));
const unidades = JSON.parse(fs.readFileSync(path.join(__dirname, 'unidades.json'), 'utf8'));

console.log(`✅ Insumos: ${insumos.length}`);
console.log(`✅ Categorías: ${categorias.length}`);
console.log(`✅ Clases: ${clases.length}`);
console.log(`✅ Subclases: ${subclases.length}`);
console.log(`✅ Unidades: ${unidades.length}\n`);

// Crear mapas de búsqueda
console.log('🗺️  Creando mapas de búsqueda...');

// Mapa de categorías por nombre (normalizado)
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto.toString().trim().toUpperCase();
}

const categoriasMapPorNombre = new Map();
categorias.forEach(cat => {
  const nombreNormalizado = normalizarTexto(cat.descripcion_categoria);
  categoriasMapPorNombre.set(nombreNormalizado, cat.id);
});

// Mapa de clases por id_clase
const clasesMap = new Map();
clases.forEach(clase => {
  clasesMap.set(clase.id_clase, clase.id);
});

// Mapa de subclases por id_subclase
const subclasesMap = new Map();
subclases.forEach(subclase => {
  subclasesMap.set(subclase.id_subclase, subclase.id);
});

// Mapa de unidades por id_unidad
const unidadesMap = new Map();
unidades.forEach(unidad => {
  unidadesMap.set(unidad.id_unidad, unidad.id);
});

console.log(`   Categorías: ${categoriasMapPorNombre.size}`);
console.log(`   Clases: ${clasesMap.size}`);
console.log(`   Subclases: ${subclasesMap.size}`);
console.log(`   Unidades: ${unidadesMap.size}\n`);

// Estadísticas
const stats = {
  total: insumos.length,
  categorias_encontradas: 0,
  categorias_no_encontradas: 0,
  clases_encontradas: 0,
  clases_no_encontradas: 0,
  subclases_encontradas: 0,
  subclases_no_encontradas: 0,
  unidades_encontradas: 0,
  unidades_no_encontradas: 0,
  categorias_sin_match: new Set(),
  clases_sin_match: new Set(),
  subclases_sin_match: new Set(),
  unidades_sin_match: new Set()
};

// Transformar insumos
console.log('🔄 Transformando insumos...');
const insumosTransformados = insumos.map((insumo, index) => {
  let categoriaId = null;
  let claseId = null;
  let subclaseId = null;
  let unidadId = null;
  
  // Buscar categoría por nombre
  if (insumo.categoria) {
    const categoriaNombre = normalizarTexto(insumo.categoria);
    categoriaId = categoriasMapPorNombre.get(categoriaNombre);
    if (categoriaId) {
      stats.categorias_encontradas++;
    } else {
      stats.categorias_no_encontradas++;
      stats.categorias_sin_match.add(insumo.categoria);
    }
  }
  
  // Buscar clase por id_clase
  if (insumo.clase_id) {
    claseId = clasesMap.get(insumo.clase_id);
    if (claseId) {
      stats.clases_encontradas++;
    } else {
      stats.clases_no_encontradas++;
      stats.clases_sin_match.add(insumo.clase_id);
    }
  }
  
  // Buscar subclase por id_subclase
  if (insumo.subclase_id) {
    subclaseId = subclasesMap.get(insumo.subclase_id);
    if (subclaseId) {
      stats.subclases_encontradas++;
    } else {
      stats.subclases_no_encontradas++;
      stats.subclases_sin_match.add(insumo.subclase_id);
    }
  }
  
  // Buscar unidad por id_unidad
  if (insumo.unidad_id) {
    unidadId = unidadesMap.get(insumo.unidad_id);
    if (unidadId) {
      stats.unidades_encontradas++;
    } else {
      stats.unidades_no_encontradas++;
      stats.unidades_sin_match.add(insumo.unidad_id);
    }
  }
  
  // Mostrar progreso
  if ((index + 1) % 2000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumos.length}`);
  }
  
  // Retornar insumo transformado
  return {
    nombre: insumo.descripcion_producto || null,
    codigo: insumo.id_producto || null, // USAR id_producto como código
    codigo_barras: insumo.codigo_barras || null, // AGREGAR codigo_barras
    estado: 1,
    categoria_insumo_id: categoriaId,
    clase_insumo_id: claseId,
    subclase_insumo_id: subclaseId,
    clase_conta_insumo_id: null,
    unidad_medida_id: unidadId,
    marca_id: null, // No hay marca en este archivo
    precio_unitario: insumo.costo_unitario || null,
    
    // Metadatos para referencia
    _metadata: {
      codigo_barras: insumo.codigo_barras,
      codigo_producto: insumo.codigo_producto,
      codigo_clase: insumo.codigo_clase,
      codigo_subclase: insumo.codigo_subclase,
      categoria_nombre: insumo.categoria,
      clase_codigo: insumo.clase_id,
      subclase_codigo: insumo.subclase_id,
      unidad_codigo: insumo.unidad_id,
      elemento_id: insumo.elemento_id,
      especificaciones: insumo.especificaciones,
      fecha_listaprecio: insumo.fecha_listaprecio
    }
  };
});

console.log('✅ Transformación completada\n');

// Convertir Sets a Arrays
stats.categorias_sin_match = Array.from(stats.categorias_sin_match);
stats.clases_sin_match = Array.from(stats.clases_sin_match);
stats.subclases_sin_match = Array.from(stats.subclases_sin_match);
stats.unidades_sin_match = Array.from(stats.unidades_sin_match);

// Guardar archivo con metadata
const archivoConMetadata = path.join(__dirname, 'insumos_transformado.json');
fs.writeFileSync(archivoConMetadata, JSON.stringify(insumosTransformados, null, 2));
console.log(`💾 Archivo con metadata guardado: insumos_transformado.json`);

// Guardar versión sin metadata (limpia)
const insumosLimpio = insumosTransformados.map(insumo => {
  const { _metadata, ...insumoLimpio } = insumo;
  return insumoLimpio;
});

const archivoLimpio = path.join(__dirname, 'insumos_limpio.json');
fs.writeFileSync(archivoLimpio, JSON.stringify(insumosLimpio, null, 2));
console.log(`💾 Archivo limpio guardado: insumos_limpio.json`);

// Guardar estadísticas
const archivoStats = path.join(__dirname, 'estadisticas_transformacion.json');
fs.writeFileSync(archivoStats, JSON.stringify(stats, null, 2));
console.log(`📊 Estadísticas guardadas: estadisticas_transformacion.json`);

// Mostrar resumen
console.log('\n' + '═'.repeat(80));
console.log('📊 RESUMEN DE TRANSFORMACIÓN');
console.log('═'.repeat(80));
console.log(`📦 Total de registros: ${stats.total.toLocaleString()}\n`);

console.log('🏷️  CATEGORÍAS:');
console.log(`   ✅ Encontradas: ${stats.categorias_encontradas.toLocaleString()} (${((stats.categorias_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.categorias_no_encontradas.toLocaleString()}`);
if (stats.categorias_sin_match.length > 0) {
  console.log(`   ⚠️  Nombres sin match: ${stats.categorias_sin_match.slice(0, 5).join(', ')}${stats.categorias_sin_match.length > 5 ? '...' : ''}`);
}

console.log('\n📋 CLASES:');
console.log(`   ✅ Encontradas: ${stats.clases_encontradas.toLocaleString()} (${((stats.clases_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.clases_no_encontradas.toLocaleString()}`);
if (stats.clases_sin_match.length > 0) {
  console.log(`   ⚠️  Códigos sin match: ${stats.clases_sin_match.slice(0, 5).join(', ')}${stats.clases_sin_match.length > 5 ? '...' : ''}`);
}

console.log('\n📑 SUBCLASES:');
console.log(`   ✅ Encontradas: ${stats.subclases_encontradas.toLocaleString()} (${((stats.subclases_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.subclases_no_encontradas.toLocaleString()}`);
if (stats.subclases_sin_match.length > 0) {
  console.log(`   ⚠️  Códigos sin match: ${stats.subclases_sin_match.slice(0, 5).join(', ')}${stats.subclases_sin_match.length > 5 ? '...' : ''}`);
}

console.log('\n📏 UNIDADES:');
console.log(`   ✅ Encontradas: ${stats.unidades_encontradas.toLocaleString()} (${((stats.unidades_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.unidades_no_encontradas.toLocaleString()}`);
if (stats.unidades_sin_match.length > 0) {
  console.log(`   ⚠️  Códigos sin match: ${stats.unidades_sin_match.slice(0, 5).join(', ')}${stats.unidades_sin_match.length > 5 ? '...' : ''}`);
}

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═'.repeat(80));
console.log('📄 insumos_transformado.json - Con metadata de referencia');
console.log('📄 insumos_limpio.json - Solo estructura final (listo para uso)');
console.log('📄 estadisticas_transformacion.json - Estadísticas detalladas');

console.log('\n📋 EJEMPLO DE REGISTRO TRANSFORMADO:');
console.log('═'.repeat(80));
console.log(JSON.stringify(insumosLimpio[0], null, 2));

console.log('\n✨ ¡Transformación completada exitosamente!');

