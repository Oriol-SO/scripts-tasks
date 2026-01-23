const fs = require('fs');
const path = require('path');

console.log('📊 Analizando campos vacíos/nulos en insumos_final_completo.json...\n');

// Leer archivo
const insumos = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_final_completo.json'), 'utf8'));

console.log(`📦 Total de registros: ${insumos.length}\n`);

// Inicializar contadores
const stats = {
  total: insumos.length,
  campos: {
    nombre: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    categoria_delphin_insumo_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    clase_delphin_insumo_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    clase_conta_insumo_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    tipo_costodelphi_insumo_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    unidad_medida_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    marca_id: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    precio_unitario: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 },
    observaciones: { con_valor: 0, sin_valor: 0, porcentaje_vacio: 0 }
  },
  registros_completos: 0,
  registros_con_campos_vacios: 0,
  registros_por_campos_vacios: {
    '0': 0, // Sin campos vacíos
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6+': 0
  }
};

// Función para verificar si un valor está vacío
function estaVacio(valor) {
  return valor === null || valor === undefined || valor === '' || valor === 0;
}

// Analizar cada registro
console.log('🔍 Analizando registros...');
insumos.forEach((insumo, index) => {
  let camposVacios = 0;
  
  // Analizar cada campo
  Object.keys(stats.campos).forEach(campo => {
    if (estaVacio(insumo[campo])) {
      stats.campos[campo].sin_valor++;
      camposVacios++;
    } else {
      stats.campos[campo].con_valor++;
    }
  });
  
  // Contar registros completos vs incompletos
  if (camposVacios === 0) {
    stats.registros_completos++;
  } else {
    stats.registros_con_campos_vacios++;
  }
  
  // Agrupar por cantidad de campos vacíos
  if (camposVacios === 0) {
    stats.registros_por_campos_vacios['0']++;
  } else if (camposVacios === 1) {
    stats.registros_por_campos_vacios['1']++;
  } else if (camposVacios === 2) {
    stats.registros_por_campos_vacios['2']++;
  } else if (camposVacios === 3) {
    stats.registros_por_campos_vacios['3']++;
  } else if (camposVacios === 4) {
    stats.registros_por_campos_vacios['4']++;
  } else if (camposVacios === 5) {
    stats.registros_por_campos_vacios['5']++;
  } else {
    stats.registros_por_campos_vacios['6+']++;
  }
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumos.length}`);
  }
});

// Calcular porcentajes
Object.keys(stats.campos).forEach(campo => {
  stats.campos[campo].porcentaje_vacio = ((stats.campos[campo].sin_valor / stats.total) * 100).toFixed(2);
  stats.campos[campo].porcentaje_completo = ((stats.campos[campo].con_valor / stats.total) * 100).toFixed(2);
});

console.log('✅ Análisis completado\n');

// Guardar estadísticas completas
const archivoStats = path.join(__dirname, 'estadisticas_campos_vacios.json');
fs.writeFileSync(archivoStats, JSON.stringify(stats, null, 2));
console.log(`💾 Estadísticas guardadas: estadisticas_campos_vacios.json`);

// Crear reporte detallado
const reporte = {
  resumen: {
    total_registros: stats.total,
    registros_completos: stats.registros_completos,
    registros_incompletos: stats.registros_con_campos_vacios,
    porcentaje_completos: ((stats.registros_completos / stats.total) * 100).toFixed(2) + '%',
    porcentaje_incompletos: ((stats.registros_con_campos_vacios / stats.total) * 100).toFixed(2) + '%'
  },
  por_campo: {},
  distribucion_campos_vacios: stats.registros_por_campos_vacios,
  campos_mas_vacios: [],
  campos_mas_completos: []
};

// Preparar datos por campo
Object.keys(stats.campos).forEach(campo => {
  reporte.por_campo[campo] = {
    con_valor: stats.campos[campo].con_valor,
    sin_valor: stats.campos[campo].sin_valor,
    porcentaje_vacio: stats.campos[campo].porcentaje_vacio + '%',
    porcentaje_completo: stats.campos[campo].porcentaje_completo + '%'
  };
});

// Identificar campos más vacíos
const camposOrdenadosPorVacios = Object.keys(stats.campos)
  .map(campo => ({
    campo,
    sin_valor: stats.campos[campo].sin_valor,
    porcentaje: stats.campos[campo].porcentaje_vacio
  }))
  .sort((a, b) => b.sin_valor - a.sin_valor);

reporte.campos_mas_vacios = camposOrdenadosPorVacios.slice(0, 5);
reporte.campos_mas_completos = camposOrdenadosPorVacios.slice().reverse().slice(0, 5);

const archivoReporte = path.join(__dirname, 'reporte_campos_vacios.json');
fs.writeFileSync(archivoReporte, JSON.stringify(reporte, null, 2));
console.log(`📊 Reporte detallado guardado: reporte_campos_vacios.json`);

// Mostrar resumen en consola
console.log('\n' + '═'.repeat(80));
console.log('📊 ANÁLISIS DE CAMPOS VACÍOS/NULOS');
console.log('═'.repeat(80));

console.log('\n📦 RESUMEN GENERAL:');
console.log(`   Total de registros: ${stats.total.toLocaleString()}`);
console.log(`   ✅ Registros completos (sin campos vacíos): ${stats.registros_completos.toLocaleString()} (${reporte.resumen.porcentaje_completos})`);
console.log(`   ⚠️  Registros incompletos (con campos vacíos): ${stats.registros_con_campos_vacios.toLocaleString()} (${reporte.resumen.porcentaje_incompletos})`);

console.log('\n📊 ANÁLISIS POR CAMPO:');
console.log('─'.repeat(80));

const camposOrdenados = [
  { nombre: 'nombre', label: 'Nombre' },
  { nombre: 'categoria_delphin_insumo_id', label: 'Categoría' },
  { nombre: 'clase_delphin_insumo_id', label: 'Clase (Detalle)' },
  { nombre: 'clase_conta_insumo_id', label: 'Clase Contable' },
  { nombre: 'tipo_costodelphi_insumo_id', label: 'Tipo Costo' },
  { nombre: 'unidad_medida_id', label: 'Unidad Medida' },
  { nombre: 'marca_id', label: 'Marca' },
  { nombre: 'precio_unitario', label: 'Precio Unitario' },
  { nombre: 'observaciones', label: 'Observaciones' }
];

camposOrdenados.forEach(({ nombre, label }) => {
  const campo = stats.campos[nombre];
  const indicador = campo.sin_valor === 0 ? '✅' : campo.sin_valor > stats.total * 0.5 ? '🔴' : '⚠️';
  console.log(`${indicador} ${label.padEnd(25)}: ${campo.con_valor.toLocaleString().padStart(6)} con valor (${campo.porcentaje_completo}%)  |  ${campo.sin_valor.toLocaleString().padStart(6)} vacíos (${campo.porcentaje_vacio}%)`);
});

console.log('\n📈 DISTRIBUCIÓN POR CANTIDAD DE CAMPOS VACÍOS:');
console.log('─'.repeat(80));
console.log(`   0 campos vacíos (completo): ${stats.registros_por_campos_vacios['0'].toLocaleString()}`);
console.log(`   1 campo vacío: ${stats.registros_por_campos_vacios['1'].toLocaleString()}`);
console.log(`   2 campos vacíos: ${stats.registros_por_campos_vacios['2'].toLocaleString()}`);
console.log(`   3 campos vacíos: ${stats.registros_por_campos_vacios['3'].toLocaleString()}`);
console.log(`   4 campos vacíos: ${stats.registros_por_campos_vacios['4'].toLocaleString()}`);
console.log(`   5 campos vacíos: ${stats.registros_por_campos_vacios['5'].toLocaleString()}`);
console.log(`   6+ campos vacíos: ${stats.registros_por_campos_vacios['6+'].toLocaleString()}`);

console.log('\n🔴 TOP 5 CAMPOS MÁS VACÍOS:');
console.log('─'.repeat(80));
reporte.campos_mas_vacios.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.campo.padEnd(30)}: ${item.sin_valor.toLocaleString()} vacíos (${item.porcentaje}%)`);
});

console.log('\n✅ TOP 5 CAMPOS MÁS COMPLETOS:');
console.log('─'.repeat(80));
reporte.campos_mas_completos.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.campo.padEnd(30)}: ${(stats.total - item.sin_valor).toLocaleString()} completos (${(100 - parseFloat(item.porcentaje)).toFixed(2)}%)`);
});

console.log('\n💾 ARCHIVOS GENERADOS:');
console.log('═'.repeat(80));
console.log('📄 estadisticas_campos_vacios.json - Estadísticas completas');
console.log('📄 reporte_campos_vacios.json - Reporte resumido y ordenado');

console.log('\n✨ ¡Análisis completado exitosamente!');


