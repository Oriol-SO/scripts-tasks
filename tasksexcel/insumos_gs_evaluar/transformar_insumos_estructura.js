const fs = require('fs');
const path = require('path');

console.log('🔄 Transformando estructura de insumos...\n');

// Leer archivo de insumos con coincidencia
const insumosConCoincidencia = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'insumos_con_coincidencia.json'), 'utf8')
);

console.log(`📊 Total de insumos a transformar: ${insumosConCoincidencia.length}`);

// Función para obtener el valor o null si está vacío
function obtenerValorONull(valor) {
  if (valor === undefined || valor === null || valor === '' || valor === 0) {
    return null;
  }
  return valor;
}

// Transformar cada registro a la nueva estructura
const insumosTransformados = insumosConCoincidencia.map((insumo, index) => {
  const nuevoInsumo = {
    // nombre => DESCRIPCIÓN
    nombre: obtenerValorONull(insumo.DESCRIPCIÓN) || obtenerValorONull(insumo.DESCRIPCION),
    
    // estado => 1
    estado: 1,
    
    // categoria_delphin_insumo_id => INSUMO
    categoria_delphin_insumo_id: obtenerValorONull(insumo.INSUMO),
    
    // clase_delphin_insumo_id => DETALLE
    clase_delphin_insumo_id: obtenerValorONull(insumo.DETALLE),
    
    // clase_conta_insumo_id => null
    clase_conta_insumo_id: null,
    
    // tipo_costodelphi_insumo_id => delphi_categoria
    tipo_costodelphi_insumo_id: obtenerValorONull(insumo.delphi_categoria),
    
    // unidad_medida_id => delphi_unidad
    unidad_medida_id: obtenerValorONull(insumo.delphi_unidad),
    
    // marca_id => MARCA
    marca_id: obtenerValorONull(insumo.MARCA),
    
    // precio_unitario => delphi_costo_unitario
    precio_unitario: obtenerValorONull(insumo.delphi_costo_unitario),
    
    // observaciones => null
    observaciones: null,
    
    // user_creator_id => 1
    user_creator_id: 1,
    
    // activo_fijo => 1
    activo_fijo: 1,
    
    // Campos adicionales para referencia (opcionales)
    _metadata: {
      codigo_original: obtenerValorONull(insumo.CODIGO),
      delphi_id_producto: obtenerValorONull(insumo.delphi_id_producto),
      delphi_codigo_producto: obtenerValorONull(insumo.delphi_codigo_producto),
      delphi_clase: obtenerValorONull(insumo.delphi_clase),
      delphi_subclase: obtenerValorONull(insumo.delphi_subclase),
      delphi_elemento: obtenerValorONull(insumo.delphi_elemento),
      precio_original: obtenerValorONull(insumo.PRECIO),
      unidad_original: obtenerValorONull(insumo.UND),
      coincidencia_tipo: obtenerValorONull(insumo.coincidencia_tipo)
    }
  };
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumosConCoincidencia.length}`);
  }
  
  return nuevoInsumo;
});

console.log('✅ Transformación completada\n');

// Guardar el archivo transformado
const archivoTransformado = path.join(__dirname, 'insumos_estructura_nueva.json');
fs.writeFileSync(archivoTransformado, JSON.stringify(insumosTransformados, null, 2));
console.log(`💾 Archivo guardado: insumos_estructura_nueva.json`);

// Crear versión sin metadata para uso en producción
const insumosSinMetadata = insumosTransformados.map(insumo => {
  const { _metadata, ...insumoLimpio } = insumo;
  return insumoLimpio;
});

const archivoSinMetadata = path.join(__dirname, 'insumos_estructura_nueva_limpio.json');
fs.writeFileSync(archivoSinMetadata, JSON.stringify(insumosSinMetadata, null, 2));
console.log(`💾 Archivo sin metadata guardado: insumos_estructura_nueva_limpio.json`);

// Generar estadísticas
const estadisticas = {
  total_registros: insumosTransformados.length,
  con_precio: insumosTransformados.filter(i => i.precio_unitario !== null).length,
  con_marca: insumosTransformados.filter(i => i.marca_id !== null).length,
  con_unidad: insumosTransformados.filter(i => i.unidad_medida_id !== null).length,
  con_categoria: insumosTransformados.filter(i => i.categoria_delphin_insumo_id !== null).length,
  con_clase: insumosTransformados.filter(i => i.clase_delphin_insumo_id !== null).length,
  
  categorias_unicas: [...new Set(insumosTransformados.map(i => i.categoria_delphin_insumo_id).filter(c => c))],
  clases_unicas: [...new Set(insumosTransformados.map(i => i.clase_delphin_insumo_id).filter(c => c))],
  marcas_unicas: [...new Set(insumosTransformados.map(i => i.marca_id).filter(m => m))],
  unidades_unicas: [...new Set(insumosTransformados.map(i => i.unidad_medida_id).filter(u => u))],
  
  precio_promedio: (insumosTransformados
    .filter(i => i.precio_unitario !== null)
    .reduce((sum, i) => sum + i.precio_unitario, 0) / 
    insumosTransformados.filter(i => i.precio_unitario !== null).length
  ).toFixed(2),
  
  precio_minimo: Math.min(...insumosTransformados
    .filter(i => i.precio_unitario !== null)
    .map(i => i.precio_unitario)),
  
  precio_maximo: Math.max(...insumosTransformados
    .filter(i => i.precio_unitario !== null)
    .map(i => i.precio_unitario))
};

// Guardar estadísticas
const archivoEstadisticas = path.join(__dirname, 'estadisticas_transformacion.json');
fs.writeFileSync(archivoEstadisticas, JSON.stringify({
  ...estadisticas,
  categorias_unicas_count: estadisticas.categorias_unicas.length,
  clases_unicas_count: estadisticas.clases_unicas.length,
  marcas_unicas_count: estadisticas.marcas_unicas.length,
  unidades_unicas_count: estadisticas.unidades_unicas.length
}, null, 2));
console.log(`📊 Estadísticas guardadas: estadisticas_transformacion.json`);

// Mostrar resumen en consola
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN DE TRANSFORMACIÓN');
console.log('═'.repeat(70));
console.log(`📦 Total de registros: ${estadisticas.total_registros.toLocaleString()}`);
console.log(`\n💰 PRECIOS:`);
console.log(`   Con precio: ${estadisticas.con_precio.toLocaleString()} (${((estadisticas.con_precio / estadisticas.total_registros) * 100).toFixed(2)}%)`);
console.log(`   Precio promedio: S/. ${estadisticas.precio_promedio}`);
console.log(`   Precio mínimo: S/. ${estadisticas.precio_minimo}`);
console.log(`   Precio máximo: S/. ${estadisticas.precio_maximo.toLocaleString()}`);

console.log(`\n🏷️  CAMPOS COMPLETADOS:`);
console.log(`   Con marca: ${estadisticas.con_marca.toLocaleString()} (${((estadisticas.con_marca / estadisticas.total_registros) * 100).toFixed(2)}%)`);
console.log(`   Con unidad: ${estadisticas.con_unidad.toLocaleString()} (${((estadisticas.con_unidad / estadisticas.total_registros) * 100).toFixed(2)}%)`);
console.log(`   Con categoría: ${estadisticas.con_categoria.toLocaleString()} (${((estadisticas.con_categoria / estadisticas.total_registros) * 100).toFixed(2)}%)`);
console.log(`   Con clase: ${estadisticas.con_clase.toLocaleString()} (${((estadisticas.con_clase / estadisticas.total_registros) * 100).toFixed(2)}%)`);

console.log(`\n📂 VALORES ÚNICOS:`);
console.log(`   Categorías únicas: ${estadisticas.categorias_unicas.length}`);
console.log(`   Clases únicas: ${estadisticas.clases_unicas.length}`);
console.log(`   Marcas únicas: ${estadisticas.marcas_unicas.length}`);
console.log(`   Unidades únicas: ${estadisticas.unidades_unicas.length}`);

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═'.repeat(70));
console.log('📄 insumos_estructura_nueva.json - Con metadata de referencia');
console.log('📄 insumos_estructura_nueva_limpio.json - Sin metadata (producción)');
console.log('📄 estadisticas_transformacion.json - Estadísticas detalladas');

console.log('\n📋 ESTRUCTURA DE EJEMPLO:');
console.log('═'.repeat(70));
console.log(JSON.stringify(insumosSinMetadata[0], null, 2));

console.log('\n✨ ¡Transformación completada exitosamente!');


