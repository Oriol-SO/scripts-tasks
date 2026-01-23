const fs = require('fs');
const path = require('path');

console.log('🔗 Asociando IDs de catálogos...\n');

// Leer archivos necesarios
console.log('📂 Cargando archivos...');
const insumosLimpio = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_estructura_nueva_limpio.json'), 'utf8'));
const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, 'categorias.json'), 'utf8'));
const detalles = JSON.parse(fs.readFileSync(path.join(__dirname, 'detalles.json'), 'utf8'));
const tipoCostos = JSON.parse(fs.readFileSync(path.join(__dirname, 'tipo_costos.json'), 'utf8'));
const marcas = JSON.parse(fs.readFileSync(path.join(__dirname, 'marcas_unicas.json'), 'utf8'));
const unidades = JSON.parse(fs.readFileSync(path.join(__dirname, 'unidades_unicas.json'), 'utf8'));

console.log(`✅ Insumos: ${insumosLimpio.length}`);
console.log(`✅ Categorías: ${categorias.length}`);
console.log(`✅ Detalles: ${detalles.length}`);
console.log(`✅ Tipo Costos: ${tipoCostos.length}`);
console.log(`✅ Marcas: ${marcas.marcas.length}`);
console.log(`✅ Unidades: ${unidades.unidades.length}\n`);

// Crear mapas de búsqueda rápida (por nombre normalizado)
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto.toString().trim().toUpperCase();
}

// Crear mapa de categorías
const categoriasMap = new Map();
categorias.forEach(cat => {
  const nombreNormalizado = normalizarTexto(cat.nombre);
  categoriasMap.set(nombreNormalizado, cat.id);
});

// Crear mapa de detalles (puede haber duplicados, tomar el primero)
const detallesMap = new Map();
detalles.forEach(det => {
  const nombreNormalizado = normalizarTexto(det.nombre);
  if (!detallesMap.has(nombreNormalizado)) {
    detallesMap.set(nombreNormalizado, det.id);
  }
});

// Crear mapa de tipo costos
const tipoCostosMap = new Map();
tipoCostos.forEach(tipo => {
  const nombreNormalizado = normalizarTexto(tipo.nombre);
  tipoCostosMap.set(nombreNormalizado, tipo.id);
});

// Crear mapa de marcas
const marcasMap = new Map();
let marcaIdCounter = 1;
marcas.marcas.forEach(marca => {
  const nombreNormalizado = normalizarTexto(marca);
  if (!marcasMap.has(nombreNormalizado)) {
    marcasMap.set(nombreNormalizado, marcaIdCounter++);
  }
});

// Crear mapa de unidades
const unidadesMap = new Map();
let unidadIdCounter = 1;
unidades.unidades.forEach(unidad => {
  const nombreNormalizado = normalizarTexto(unidad);
  if (!unidadesMap.has(nombreNormalizado)) {
    unidadesMap.set(nombreNormalizado, unidadIdCounter++);
  }
});

console.log('🗺️  Mapas de búsqueda creados');
console.log(`   Categorías: ${categoriasMap.size}`);
console.log(`   Detalles: ${detallesMap.size}`);
console.log(`   Tipo Costos: ${tipoCostosMap.size}`);
console.log(`   Marcas: ${marcasMap.size}`);
console.log(`   Unidades: ${unidadesMap.size}\n`);

// Estadísticas de asociación
const stats = {
  total: insumosLimpio.length,
  categorias_encontradas: 0,
  categorias_no_encontradas: 0,
  detalles_encontrados: 0,
  detalles_no_encontrados: 0,
  tipo_costos_encontrados: 0,
  tipo_costos_no_encontrados: 0,
  marcas_encontradas: 0,
  marcas_no_encontradas: 0,
  unidades_encontradas: 0,
  unidades_no_encontradas: 0,
  
  categorias_sin_valor: [],
  detalles_sin_valor: [],
  tipo_costos_sin_valor: [],
  marcas_sin_valor: [],
  unidades_sin_valor: []
};

// Asociar IDs
console.log('🔄 Asociando IDs...');
const insumosConIDs = insumosLimpio.map((insumo, index) => {
  // Normalizar nombres
  const categoriaNombre = normalizarTexto(insumo.categoria_delphin_insumo_id);
  const detalleNombre = normalizarTexto(insumo.clase_delphin_insumo_id);
  const tipoCostoNombre = normalizarTexto(insumo.tipo_costodelphi_insumo_id);
  const marcaNombre = normalizarTexto(insumo.marca_id);
  const unidadNombre = normalizarTexto(insumo.unidad_medida_id);
  
  // Buscar IDs en los mapas
  let categoriaId = null;
  let detalleId = null;
  let tipoCostoId = null;
  let marcaId = null;
  let unidadId = null;
  
  // Categoría
  if (categoriaNombre) {
    categoriaId = categoriasMap.get(categoriaNombre);
    if (categoriaId) {
      stats.categorias_encontradas++;
    } else {
      stats.categorias_no_encontradas++;
      if (!stats.categorias_sin_valor.includes(insumo.categoria_delphin_insumo_id)) {
        stats.categorias_sin_valor.push(insumo.categoria_delphin_insumo_id);
      }
    }
  }
  
  // Detalle
  if (detalleNombre) {
    detalleId = detallesMap.get(detalleNombre);
    if (detalleId) {
      stats.detalles_encontrados++;
    } else {
      stats.detalles_no_encontrados++;
      if (!stats.detalles_sin_valor.includes(insumo.clase_delphin_insumo_id)) {
        stats.detalles_sin_valor.push(insumo.clase_delphin_insumo_id);
      }
    }
  }
  
  // Tipo Costo
  if (tipoCostoNombre) {
    tipoCostoId = tipoCostosMap.get(tipoCostoNombre);
    if (tipoCostoId) {
      stats.tipo_costos_encontrados++;
    } else {
      stats.tipo_costos_no_encontrados++;
      if (!stats.tipo_costos_sin_valor.includes(insumo.tipo_costodelphi_insumo_id)) {
        stats.tipo_costos_sin_valor.push(insumo.tipo_costodelphi_insumo_id);
      }
    }
  }
  
  // Marca - NO SE CONVIERTEN A ID, SE MANTIENEN COMO NOMBRE
  // Unidad - NO SE CONVIERTEN A ID, SE MANTIENEN COMO NOMBRE
  // (Estas líneas están comentadas porque marca y unidad se mantienen como texto)
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumosLimpio.length}`);
  }
  
  // Retornar insumo con IDs asociados
  return {
    nombre: insumo.nombre,
    estado: insumo.estado,
    categoria_delphin_insumo_id: categoriaId,
    clase_delphin_insumo_id: detalleId,
    clase_conta_insumo_id: insumo.clase_conta_insumo_id,
    tipo_costodelphi_insumo_id: tipoCostoId,
    unidad_medida_id: insumo.unidad_medida_id, // MANTENER NOMBRE ORIGINAL
    marca_id: insumo.marca_id, // MANTENER NOMBRE ORIGINAL
    precio_unitario: insumo.precio_unitario,
    observaciones: insumo.observaciones,
    user_creator_id: insumo.user_creator_id,
    activo_fijo: insumo.activo_fijo,
    
    // Campos originales para referencia
    _original: {
      categoria_nombre: insumo.categoria_delphin_insumo_id,
      clase_nombre: insumo.clase_delphin_insumo_id,
      tipo_costo_nombre: insumo.tipo_costodelphi_insumo_id,
      marca_nombre: insumo.marca_id,
      unidad_nombre: insumo.unidad_medida_id
    }
  };
});

console.log('✅ Asociación completada\n');

// Guardar archivo con IDs asociados
const archivoConIDs = path.join(__dirname, 'insumos_con_ids.json');
fs.writeFileSync(archivoConIDs, JSON.stringify(insumosConIDs, null, 2));
console.log(`💾 Archivo guardado: insumos_con_ids.json`);

// Guardar versión sin campos originales (para producción)
const insumosSinOriginales = insumosConIDs.map(insumo => {
  const { _original, ...insumoLimpio } = insumo;
  return insumoLimpio;
});

const archivoFinal = path.join(__dirname, 'insumos_final.json');
fs.writeFileSync(archivoFinal, JSON.stringify(insumosSinOriginales, null, 2));
console.log(`💾 Archivo final guardado: insumos_final.json`);

// Guardar estadísticas
const archivoStats = path.join(__dirname, 'estadisticas_asociacion.json');
fs.writeFileSync(archivoStats, JSON.stringify(stats, null, 2));
console.log(`📊 Estadísticas guardadas: estadisticas_asociacion.json`);

// Mostrar resumen
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN DE ASOCIACIÓN DE IDs');
console.log('═'.repeat(70));
console.log(`📦 Total de registros: ${stats.total.toLocaleString()}\n`);

console.log('🏷️  CATEGORÍAS:');
console.log(`   ✅ Encontradas: ${stats.categorias_encontradas.toLocaleString()} (${((stats.categorias_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.categorias_no_encontradas.toLocaleString()}`);
if (stats.categorias_sin_valor.length > 0) {
  console.log(`   ⚠️  Valores sin match: ${stats.categorias_sin_valor.slice(0, 5).join(', ')}${stats.categorias_sin_valor.length > 5 ? '...' : ''}`);
}

console.log('\n📋 DETALLES (CLASES):');
console.log(`   ✅ Encontrados: ${stats.detalles_encontrados.toLocaleString()} (${((stats.detalles_encontrados / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontrados: ${stats.detalles_no_encontrados.toLocaleString()}`);
if (stats.detalles_sin_valor.length > 0) {
  console.log(`   ⚠️  Valores sin match: ${stats.detalles_sin_valor.slice(0, 5).join(', ')}${stats.detalles_sin_valor.length > 5 ? '...' : ''}`);
}

console.log('\n💰 TIPO DE COSTOS:');
console.log(`   ✅ Encontrados: ${stats.tipo_costos_encontrados.toLocaleString()} (${((stats.tipo_costos_encontrados / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontrados: ${stats.tipo_costos_no_encontrados.toLocaleString()}`);
if (stats.tipo_costos_sin_valor.length > 0) {
  console.log(`   ⚠️  Valores sin match: ${stats.tipo_costos_sin_valor.slice(0, 5).join(', ')}${stats.tipo_costos_sin_valor.length > 5 ? '...' : ''}`);
}

console.log('\n🏷️  MARCAS: Se mantienen como TEXTO (no se convierten a ID)');

console.log('\n📏 UNIDADES: Se mantienen como TEXTO (no se convierten a ID)');

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═'.repeat(70));
console.log('📄 insumos_con_ids.json - Con IDs asociados y nombres originales');
console.log('📄 insumos_final.json - Solo con IDs (listo para producción)');
console.log('📄 estadisticas_asociacion.json - Estadísticas detalladas');

console.log('\n📋 EJEMPLO DE REGISTRO FINAL:');
console.log('═'.repeat(70));
console.log(JSON.stringify(insumosSinOriginales[0], null, 2));

console.log('\n✨ ¡Asociación de IDs completada exitosamente!');

