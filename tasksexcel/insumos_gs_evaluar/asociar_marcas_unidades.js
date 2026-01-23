const fs = require('fs');
const path = require('path');

console.log('🔗 Asociando IDs de marcas y unidades...\n');

// Leer archivos necesarios
console.log('📂 Cargando archivos...');
const insumosFinal = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_final.json'), 'utf8'));
const marcas = JSON.parse(fs.readFileSync(path.join(__dirname, 'marcas.json'), 'utf8'));
const unidades = JSON.parse(fs.readFileSync(path.join(__dirname, 'unidades_id.json'), 'utf8'));

console.log(`✅ Insumos: ${insumosFinal.length}`);
console.log(`✅ Marcas: ${marcas.length}`);
console.log(`✅ Unidades: ${unidades.length}\n`);

// Función para normalizar texto
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto.toString().trim().toUpperCase();
}

// Crear mapa de marcas (por nombre normalizado)
const marcasMap = new Map();
marcas.forEach(marca => {
  const nombreNormalizado = normalizarTexto(marca.nombre);
  marcasMap.set(nombreNormalizado, marca.id);
});

// Crear mapa de unidades (por siglas normalizadas)
const unidadesMap = new Map();
unidades.forEach(unidad => {
  const siglasNormalizadas = normalizarTexto(unidad.siglas);
  unidadesMap.set(siglasNormalizadas, unidad.id);
});

// También crear mapa adicional de unidades por variaciones comunes
const unidadesVariacionesMap = new Map();
unidades.forEach(unidad => {
  const siglas = normalizarTexto(unidad.siglas);
  unidadesVariacionesMap.set(siglas, unidad.id);
  
  // Agregar variaciones comunes
  if (siglas === 'M3') {
    unidadesVariacionesMap.set('M³', unidad.id);
    unidadesVariacionesMap.set('METRO CUBICO', unidad.id);
    unidadesVariacionesMap.set('METRO CÚBICO', unidad.id);
  } else if (siglas === 'M2') {
    unidadesVariacionesMap.set('M²', unidad.id);
    unidadesVariacionesMap.set('METRO CUADRADO', unidad.id);
  } else if (siglas === 'UND') {
    unidadesVariacionesMap.set('UNIDAD', unidad.id);
    unidadesVariacionesMap.set('U', unidad.id);
  } else if (siglas === 'KG') {
    unidadesVariacionesMap.set('KILOGRAMO', unidad.id);
  } else if (siglas === 'GLN') {
    unidadesVariacionesMap.set('GALON', unidad.id);
    unidadesVariacionesMap.set('GAL', unidad.id);
  } else if (siglas === 'MTR') {
    unidadesVariacionesMap.set('M', unidad.id);
    unidadesVariacionesMap.set('METRO', unidad.id);
  } else if (siglas === 'BOL') {
    unidadesVariacionesMap.set('BOLSA', unidad.id);
  } else if (siglas === 'CAJA') {
    unidadesVariacionesMap.set('CJA', unidad.id);
  } else if (siglas === 'JGO') {
    unidadesVariacionesMap.set('JUEGO', unidad.id);
  } else if (siglas === 'PZA') {
    unidadesVariacionesMap.set('PZ', unidad.id);
    unidadesVariacionesMap.set('PIEZA', unidad.id);
  } else if (siglas === 'RLL') {
    unidadesVariacionesMap.set('ROLLO', unidad.id);
  } else if (siglas === 'SAC') {
    unidadesVariacionesMap.set('SACO', unidad.id);
  } else if (siglas === 'PAQ') {
    unidadesVariacionesMap.set('PAQUETE', unidad.id);
    unidadesVariacionesMap.set('PQT', unidad.id);
  } else if (siglas === 'L') {
    unidadesVariacionesMap.set('LITRO', unidad.id);
  } else if (siglas === 'MES') {
    unidadesVariacionesMap.set('MESES', unidad.id);
  } else if (siglas === 'DIA') {
    unidadesVariacionesMap.set('DIAS', unidad.id);
  } else if (siglas === 'HH') {
    unidadesVariacionesMap.set('HORA HOMBRE', unidad.id);
  } else if (siglas === 'HM') {
    unidadesVariacionesMap.set('HORA MAQUINA', unidad.id);
    unidadesVariacionesMap.set('HOMBRE MES', unidad.id);
  } else if (siglas === 'GBL') {
    unidadesVariacionesMap.set('GLOBAL', unidad.id);
  }
});

console.log('🗺️  Mapas de búsqueda creados');
console.log(`   Marcas: ${marcasMap.size}`);
console.log(`   Unidades: ${unidadesMap.size}`);
console.log(`   Unidades (con variaciones): ${unidadesVariacionesMap.size}\n`);

// Estadísticas
const stats = {
  total: insumosFinal.length,
  marcas_encontradas: 0,
  marcas_no_encontradas: 0,
  marcas_nulas: 0,
  unidades_encontradas: 0,
  unidades_no_encontradas: 0,
  unidades_nulas: 0,
  marcas_sin_match: [],
  unidades_sin_match: []
};

// Asociar IDs
console.log('🔄 Asociando IDs de marcas y unidades...');
const insumosConMarcasYUnidades = insumosFinal.map((insumo, index) => {
  let marcaId = null;
  let unidadId = null;
  
  // Asociar marca
  const marcaNombre = normalizarTexto(insumo.marca_id);
  if (marcaNombre) {
    marcaId = marcasMap.get(marcaNombre);
    if (marcaId) {
      stats.marcas_encontradas++;
    } else {
      stats.marcas_no_encontradas++;
      if (!stats.marcas_sin_match.includes(insumo.marca_id)) {
        stats.marcas_sin_match.push(insumo.marca_id);
      }
    }
  } else {
    stats.marcas_nulas++;
  }
  
  // Asociar unidad (buscar primero por siglas exactas, luego por variaciones)
  const unidadNombre = normalizarTexto(insumo.unidad_medida_id);
  if (unidadNombre) {
    unidadId = unidadesMap.get(unidadNombre) || unidadesVariacionesMap.get(unidadNombre);
    if (unidadId) {
      stats.unidades_encontradas++;
    } else {
      stats.unidades_no_encontradas++;
      if (!stats.unidades_sin_match.includes(insumo.unidad_medida_id)) {
        stats.unidades_sin_match.push(insumo.unidad_medida_id);
      }
    }
  } else {
    stats.unidades_nulas++;
  }
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumosFinal.length}`);
  }
  
  // Retornar insumo con IDs de marca y unidad
  return {
    nombre: insumo.nombre,
    estado: insumo.estado,
    categoria_delphin_insumo_id: insumo.categoria_delphin_insumo_id,
    clase_delphin_insumo_id: insumo.clase_delphin_insumo_id,
    clase_conta_insumo_id: insumo.clase_conta_insumo_id,
    tipo_costodelphi_insumo_id: insumo.tipo_costodelphi_insumo_id,
    unidad_medida_id: unidadId,
    marca_id: marcaId,
    precio_unitario: insumo.precio_unitario,
    observaciones: insumo.observaciones,
    user_creator_id: insumo.user_creator_id,
    activo_fijo: insumo.activo_fijo
  };
});

console.log('✅ Asociación completada\n');

// Guardar archivo final
const archivoFinalConIDs = path.join(__dirname, 'insumos_final_completo.json');
fs.writeFileSync(archivoFinalConIDs, JSON.stringify(insumosConMarcasYUnidades, null, 2));
console.log(`💾 Archivo guardado: insumos_final_completo.json`);

// Guardar estadísticas
const archivoStats = path.join(__dirname, 'estadisticas_marcas_unidades.json');
fs.writeFileSync(archivoStats, JSON.stringify(stats, null, 2));
console.log(`📊 Estadísticas guardadas: estadisticas_marcas_unidades.json`);

// Mostrar resumen
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN DE ASOCIACIÓN DE MARCAS Y UNIDADES');
console.log('═'.repeat(70));
console.log(`📦 Total de registros: ${stats.total.toLocaleString()}\n`);

console.log('🏷️  MARCAS:');
console.log(`   ✅ Encontradas: ${stats.marcas_encontradas.toLocaleString()} (${((stats.marcas_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.marcas_no_encontradas.toLocaleString()} (${((stats.marcas_no_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ⚪ Nulas/Vacías: ${stats.marcas_nulas.toLocaleString()} (${((stats.marcas_nulas / stats.total) * 100).toFixed(2)}%)`);
if (stats.marcas_sin_match.length > 0) {
  console.log(`   ⚠️  Sin match (primeras 10): ${stats.marcas_sin_match.slice(0, 10).join(', ')}`);
}

console.log('\n📏 UNIDADES:');
console.log(`   ✅ Encontradas: ${stats.unidades_encontradas.toLocaleString()} (${((stats.unidades_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ❌ No encontradas: ${stats.unidades_no_encontradas.toLocaleString()} (${((stats.unidades_no_encontradas / stats.total) * 100).toFixed(2)}%)`);
console.log(`   ⚪ Nulas/Vacías: ${stats.unidades_nulas.toLocaleString()} (${((stats.unidades_nulas / stats.total) * 100).toFixed(2)}%)`);
if (stats.unidades_sin_match.length > 0) {
  console.log(`   ⚠️  Sin match (primeras 10): ${stats.unidades_sin_match.slice(0, 10).join(', ')}`);
}

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═'.repeat(70));
console.log('📄 insumos_final_completo.json - Con todos los IDs asociados');
console.log('📄 estadisticas_marcas_unidades.json - Estadísticas detalladas');

console.log('\n📋 EJEMPLO DE REGISTRO FINAL:');
console.log('═'.repeat(70));
console.log(JSON.stringify(insumosConMarcasYUnidades[0], null, 2));

console.log('\n✨ ¡Asociación completada exitosamente!');


