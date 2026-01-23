const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando combinación de insumos...\n');

// Leer archivos JSON
console.log('📂 Cargando archivos...');
const insumosSinDuplicados = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_sin_duplicados.json'), 'utf8'));
const delphiInsumos = JSON.parse(fs.readFileSync(path.join(__dirname, 'delphi_insumos.json'), 'utf8'));

console.log(`✅ Insumos sin duplicados: ${insumosSinDuplicados.length} registros`);
console.log(`✅ Delphi insumos: ${delphiInsumos.length} registros\n`);

// Función para normalizar texto (eliminar espacios, convertir a mayúsculas, eliminar caracteres especiales)
function normalizarTexto(texto) {
  if (!texto) return '';
  return texto.toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/gi, '');
}

// Crear un mapa de Delphi insumos por descripción normalizada
console.log('🔨 Creando índice de productos Delphi...');
const delphiMap = new Map();
const delphiMapExacto = new Map();

delphiInsumos.forEach((producto, index) => {
  const descripcionNormalizada = normalizarTexto(producto.descripcion_producto);
  const descripcionExacta = producto.descripcion_producto ? producto.descripcion_producto.trim().toUpperCase() : '';
  
  if (descripcionNormalizada) {
    // Guardar por descripción normalizada (puede haber múltiples)
    if (!delphiMap.has(descripcionNormalizada)) {
      delphiMap.set(descripcionNormalizada, []);
    }
    delphiMap.get(descripcionNormalizada).push(producto);
    
    // Guardar por descripción exacta
    if (!delphiMapExacto.has(descripcionExacta)) {
      delphiMapExacto.set(descripcionExacta, []);
    }
    delphiMapExacto.get(descripcionExacta).push(producto);
  }
  
  if ((index + 1) % 5000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${delphiInsumos.length}`);
  }
});

console.log(`✅ Índice creado: ${delphiMap.size} descripciones únicas\n`);

// Combinar los datos
console.log('🔗 Combinando datos...');
const insumosCombinados = [];
const noEncontrados = [];
const estadisticas = {
  totalProcesados: 0,
  conCoincidenciaExacta: 0,
  conCoincidenciaNormalizada: 0,
  sinCoincidencia: 0,
  conMultiplesCoincidencias: 0
};

insumosSinDuplicados.forEach((insumo, index) => {
  estadisticas.totalProcesados++;
  
  const descripcionOriginal = insumo.DESCRIPCIÓN || insumo.DESCRIPCION || '';
  const descripcionNormalizada = normalizarTexto(descripcionOriginal);
  const descripcionExacta = descripcionOriginal.trim().toUpperCase();
  
  let productosDelphi = null;
  let tipoCoincidencia = 'ninguna';
  
  // Buscar primero coincidencia exacta
  if (delphiMapExacto.has(descripcionExacta)) {
    productosDelphi = delphiMapExacto.get(descripcionExacta);
    tipoCoincidencia = 'exacta';
    estadisticas.conCoincidenciaExacta++;
  }
  // Si no hay coincidencia exacta, buscar normalizada
  else if (delphiMap.has(descripcionNormalizada)) {
    productosDelphi = delphiMap.get(descripcionNormalizada);
    tipoCoincidencia = 'normalizada';
    estadisticas.conCoincidenciaNormalizada++;
  }
  
  if (productosDelphi && productosDelphi.length > 0) {
    // Hay coincidencia(s)
    if (productosDelphi.length > 1) {
      estadisticas.conMultiplesCoincidencias++;
    }
    
    // Si hay múltiples coincidencias, tomar la primera (o aplicar alguna lógica)
    const productoDelphi = productosDelphi[0];
    
    // Combinar datos
    const insumoCombinado = {
      // Datos originales del insumo
      ...insumo,
      
      // Datos de Delphi
      delphi_id_producto: productoDelphi.id_producto,
      delphi_codigo_producto: productoDelphi.codigo_producto,
      delphi_codigo_barras: productoDelphi.codigo_barras,
      delphi_costo_unitario: productoDelphi.costo_unitario,
      delphi_categoria: productoDelphi.categoria,
      delphi_clase: productoDelphi.clase,
      delphi_subclase: productoDelphi.subclase,
      delphi_unidad: productoDelphi.unidad,
      delphi_elemento: productoDelphi.elemento,
      delphi_origen: productoDelphi.origen,
      delphi_fecha_listaprecio: productoDelphi.fecha_listaprecio,
      
      // Metadatos de la coincidencia
      coincidencia_tipo: tipoCoincidencia,
      coincidencia_total: productosDelphi.length,
      coincidencia_encontrada: true
    };
    
    insumosCombinados.push(insumoCombinado);
  } else {
    // No hay coincidencia
    estadisticas.sinCoincidencia++;
    
    const insumoSinCoincidencia = {
      ...insumo,
      coincidencia_encontrada: false,
      coincidencia_tipo: 'ninguna'
    };
    
    insumosCombinados.push(insumoSinCoincidencia);
    noEncontrados.push({
      CODIGO: insumo.CODIGO,
      DESCRIPCIÓN: descripcionOriginal,
      INSUMO: insumo.INSUMO,
      DETALLE: insumo.DETALLE
    });
  }
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumosSinDuplicados.length}`);
  }
});

console.log('✅ Combinación completada\n');

// Guardar resultados
console.log('💾 Guardando archivos...');

// Archivo con todos los insumos combinados
fs.writeFileSync(
  path.join(__dirname, 'insumos_combinados.json'),
  JSON.stringify(insumosCombinados, null, 2)
);
console.log('✅ insumos_combinados.json');

// Archivo con insumos que tienen coincidencia
const insumosConCoincidencia = insumosCombinados.filter(i => i.coincidencia_encontrada);
fs.writeFileSync(
  path.join(__dirname, 'insumos_con_coincidencia.json'),
  JSON.stringify(insumosConCoincidencia, null, 2)
);
console.log('✅ insumos_con_coincidencia.json');

// Archivo con insumos sin coincidencia
const insumosSinCoincidencia = insumosCombinados.filter(i => !i.coincidencia_encontrada);
fs.writeFileSync(
  path.join(__dirname, 'insumos_sin_coincidencia.json'),
  JSON.stringify(insumosSinCoincidencia, null, 2)
);
console.log('✅ insumos_sin_coincidencia.json');

// Archivo con lista de no encontrados
fs.writeFileSync(
  path.join(__dirname, 'no_encontrados_en_delphi.json'),
  JSON.stringify(noEncontrados, null, 2)
);
console.log('✅ no_encontrados_en_delphi.json');

// Generar reporte detallado
const reporte = {
  fecha_proceso: new Date().toISOString(),
  estadisticas: {
    total_procesados: estadisticas.totalProcesados,
    con_coincidencia: estadisticas.conCoincidenciaExacta + estadisticas.conCoincidenciaNormalizada,
    con_coincidencia_exacta: estadisticas.conCoincidenciaExacta,
    con_coincidencia_normalizada: estadisticas.conCoincidenciaNormalizada,
    sin_coincidencia: estadisticas.sinCoincidencia,
    con_multiples_coincidencias: estadisticas.conMultiplesCoincidencias,
    porcentaje_coincidencia: ((estadisticas.conCoincidenciaExacta + estadisticas.conCoincidenciaNormalizada) / estadisticas.totalProcesados * 100).toFixed(2) + '%',
    porcentaje_sin_coincidencia: (estadisticas.sinCoincidencia / estadisticas.totalProcesados * 100).toFixed(2) + '%'
  },
  archivos_generados: [
    'insumos_combinados.json - Todos los insumos con datos combinados',
    'insumos_con_coincidencia.json - Solo insumos que se encontraron en Delphi',
    'insumos_sin_coincidencia.json - Solo insumos que NO se encontraron en Delphi',
    'no_encontrados_en_delphi.json - Lista resumida de no encontrados',
    'reporte_combinacion.json - Este reporte'
  ],
  ejemplos_no_encontrados: noEncontrados.slice(0, 20)
};

fs.writeFileSync(
  path.join(__dirname, 'reporte_combinacion.json'),
  JSON.stringify(reporte, null, 2)
);
console.log('✅ reporte_combinacion.json');

// Mostrar resumen en consola
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN DE COMBINACIÓN');
console.log('═'.repeat(70));
console.log(`📦 Total procesados:              ${estadisticas.totalProcesados.toLocaleString()}`);
console.log(`✅ Con coincidencia:              ${(estadisticas.conCoincidenciaExacta + estadisticas.conCoincidenciaNormalizada).toLocaleString()} (${reporte.estadisticas.porcentaje_coincidencia})`);
console.log(`   - Coincidencia exacta:         ${estadisticas.conCoincidenciaExacta.toLocaleString()}`);
console.log(`   - Coincidencia normalizada:    ${estadisticas.conCoincidenciaNormalizada.toLocaleString()}`);
console.log(`❌ Sin coincidencia:              ${estadisticas.sinCoincidencia.toLocaleString()} (${reporte.estadisticas.porcentaje_sin_coincidencia})`);
console.log(`⚠️  Con múltiples coincidencias:  ${estadisticas.conMultiplesCoincidencias.toLocaleString()}`);
console.log('═'.repeat(70));

if (noEncontrados.length > 0) {
  console.log('\n📋 EJEMPLOS DE INSUMOS NO ENCONTRADOS EN DELPHI:');
  console.log('─'.repeat(70));
  noEncontrados.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. [${item.CODIGO}] ${item.DESCRIPCIÓN}`);
    console.log(`   Categoría: ${item.INSUMO} | Detalle: ${item.DETALLE}`);
  });
  if (noEncontrados.length > 10) {
    console.log(`   ... y ${noEncontrados.length - 10} más`);
  }
}

console.log('\n✨ ¡Proceso completado exitosamente!');
console.log('\n💡 ARCHIVOS GENERADOS:');
console.log('   📄 insumos_combinados.json - Archivo principal con todos los datos');
console.log('   📄 insumos_con_coincidencia.json - Insumos encontrados en Delphi');
console.log('   📄 insumos_sin_coincidencia.json - Insumos NO encontrados en Delphi');
console.log('   📄 no_encontrados_en_delphi.json - Lista resumida de no encontrados');
console.log('   📄 reporte_combinacion.json - Reporte detallado del proceso');


