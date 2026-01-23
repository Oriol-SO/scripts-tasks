const fs = require('fs');
const path = require('path');

console.log('🔄 Transformando insumos de Delphi...\n');

// Leer todos los archivos necesarios
console.log('📂 Cargando archivos...');
const insumosDelphin = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_delphin.json'), 'utf8'));
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, 'categorias.json'), 'utf8'));
const clases = JSON.parse(fs.readFileSync(path.join(__dirname, 'clases_delphin.json'), 'utf8'));
const subclases = JSON.parse(fs.readFileSync(path.join(__dirname, 'sub_clases_delphin.json'), 'utf8'));
const unidades = JSON.parse(fs.readFileSync(path.join(__dirname, 'unidad_medidas.json'), 'utf8'));

console.log(`✅ Insumos Delphi: ${insumosDelphin.length}`);
console.log(`✅ Categorías: ${categorias.length}`);
console.log(`✅ Clases: ${clases.length}`);
console.log(`✅ Subclases: ${subclases.length}`);
console.log(`✅ Unidades: ${unidades.length}\n`);

// Crear mapas de búsqueda por código
console.log('🗺️  Creando mapas de búsqueda...');

const categoriasMap = new Map();
categorias.forEach(cat => {
  categoriasMap.set(cat.codigo, cat.id);
});

const clasesMap = new Map();
clases.forEach(clase => {
  clasesMap.set(clase.codigo, clase.id);
});

const subclasesMap = new Map();
subclases.forEach(subclase => {
  subclasesMap.set(subclase.codigo, subclase.id);
});

const unidadesMap = new Map();
unidades.forEach(unidad => {
  unidadesMap.set(unidad.id_unidad, unidad.id);
});

console.log(`   Categorías: ${categoriasMap.size}`);
console.log(`   Clases: ${clasesMap.size}`);
console.log(`   Subclases: ${subclasesMap.size}`);
console.log(`   Unidades: ${unidadesMap.size}\n`);

// Estadísticas
const stats = {
  total: insumosDelphin.length,
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
const insumosTransformados = insumosDelphin.map((insumo, index) => {
  // Buscar IDs en los mapas
  let categoriaId = null;
  let claseId = null;
  let subclaseId = null;
  let unidadId = null;
  
  // Buscar categoría por código
  if (insumo.id_categoria) {
    categoriaId = categoriasMap.get(insumo.id_categoria);
    if (categoriaId) {
      stats.categorias_encontradas++;
    } else {
      stats.categorias_no_encontradas++;
      stats.categorias_sin_match.add(insumo.id_categoria);
    }
  }
  
  // Buscar clase por código
  if (insumo.id_clase) {
    claseId = clasesMap.get(insumo.id_clase);
    if (claseId) {
      stats.clases_encontradas++;
    } else {
      stats.clases_no_encontradas++;
      stats.clases_sin_match.add(insumo.id_clase);
    }
  }
  
  // Buscar subclase por código
  if (insumo.id_subclase) {
    subclaseId = subclasesMap.get(insumo.id_subclase);
    if (subclaseId) {
      stats.subclases_encontradas++;
    } else {
      stats.subclases_no_encontradas++;
      stats.subclases_sin_match.add(insumo.id_subclase);
    }
  }
  
  // Buscar unidad por código
  if (insumo.id_unidad) {
    unidadId = unidadesMap.get(insumo.id_unidad);
    if (unidadId) {
      stats.unidades_encontradas++;
    } else {
      stats.unidades_no_encontradas++;
      stats.unidades_sin_match.add(insumo.id_unidad);
    }
  }
  
  // Mostrar progreso
  if ((index + 1) % 2000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumosDelphin.length}`);
  }
  
  // Retornar insumo transformado
  return {
    nombre: insumo.descripcion_producto || null,
    estado: 1,
    categoria_insumo_id: categoriaId,
    clase_insumo_id: claseId,
    subclase_insumo_id: subclaseId,
    clase_conta_insumo_id: null,
    unidad_medida_id: unidadId,
    marca_id: null, // No hay marca en insumos_delphin
    precio_unitario: insumo.costo_unitario || null,
    
    // Metadatos para referencia
    _metadata: {
      id_producto: insumo.id_producto,
      codigo_producto: insumo.codigo_producto,
      codigo_barras: insumo.codigo_barras,
      categoria_codigo: insumo.id_categoria,
      categoria_nombre: insumo.categoria,
      clase_codigo: insumo.id_clase,
      clase_nombre: insumo.clase,
      subclase_codigo: insumo.id_subclase,
      subclase_nombre: insumo.subclase,
      unidad_codigo: insumo.id_unidad,
      unidad_nombre: insumo.unidad,
      elemento: insumo.elemento,
      origen: insumo.origen
    }
  };
});

console.log('✅ Transformación completada\n');

// Convertir Sets a Arrays para las estadísticas
stats.categorias_sin_match = Array.from(stats.categorias_sin_match);
stats.clases_sin_match = Array.from(stats.clases_sin_match);
stats.subclases_sin_match = Array.from(stats.subclases_sin_match);
stats.unidades_sin_match = Array.from(stats.unidades_sin_match);

// Guardar archivo con metadata
const archivoConMetadata = path.join(__dirname, 'insumos_delphin_transformado.json');
fs.writeFileSync(archivoConMetadata, JSON.stringify(insumosTransformados, null, 2));
console.log(`💾 Archivo con metadata guardado: insumos_delphin_transformado.json`);

// Guardar versión sin metadata (limpia)
const insumosLimpio = insumosTransformados.map(insumo => {
  const { _metadata, ...insumoLimpio } = insumo;
  return insumoLimpio;
});

const archivoLimpio = path.join(__dirname, 'insumos_delphin_limpio.json');
fs.writeFileSync(archivoLimpio, JSON.stringify(insumosLimpio, null, 2));
console.log(`💾 Archivo limpio guardado: insumos_delphin_limpio.json`);

// Guardar estadísticas
const archivoStats = path.join(__dirname, 'estadisticas_transformacion_delphin.json');
fs.writeFileSync(archivoStats, JSON.stringify(stats, null, 2));
console.log(`📊 Estadísticas guardadas: estadisticas_transformacion_delphin.json`);

// Mostrar resumen
console.log('\n' + '═'.repeat(80));
console.log('📊 RESUMEN DE TRANSFORMACIÓN');
console.log('═'.repeat(80));
console.log(`📦 Total de registros: ${stats.total.toLocaleString()}\n`);

console.log('🏷️  CATEGORÍAS:');
console.log(`   ✅ Encontradas: ${stats.categorias_encontradas.toLocaleString()} (${((stats.categorias_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.categorias_no_encontradas.toLocaleString()}`);
if (stats.categorias_sin_match.length > 0) {
  console.log(`   ⚠️  Códigos sin match: ${stats.categorias_sin_match.slice(0, 5).join(', ')}${stats.categorias_sin_match.length > 5 ? '...' : ''}`);
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
console.log('📄 insumos_delphin_transformado.json - Con metadata de referencia');
console.log('📄 insumos_delphin_limpio.json - Solo estructura final (listo para uso)');
console.log('📄 estadisticas_transformacion_delphin.json - Estadísticas detalladas');

console.log('\n📋 EJEMPLO DE REGISTRO TRANSFORMADO:');
console.log('═'.repeat(80));
console.log(JSON.stringify(insumosLimpio[0], null, 2));

console.log('\n✨ ¡Transformación completada exitosamente!');


