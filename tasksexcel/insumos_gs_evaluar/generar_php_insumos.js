const fs = require('fs');
const path = require('path');

console.log('🔨 Generando archivo PHP de insumos...\n');

// Leer archivo JSON
const insumos = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_final_completo.json'), 'utf8'));

console.log(`📊 Total de insumos: ${insumos.length}\n`);

// Función para escapar comillas simples en PHP
function escaparPHP(valor) {
  if (valor === null || valor === undefined) {
    return 'null';
  }
  if (typeof valor === 'string') {
    return "'" + valor.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
  }
  if (typeof valor === 'number') {
    return valor;
  }
  if (typeof valor === 'boolean') {
    return valor ? 'true' : 'false';
  }
  return 'null';
}

// Generar el código PHP
let phpCode = `<?php
// Array de insumos finales
// Total de insumos: ${insumos.length}
// Generado automáticamente

$insumos = [
`;

// Agregar cada insumo al array
console.log('🔄 Generando código PHP...');
insumos.forEach((insumo, index) => {
  phpCode += `    [\n`;
  phpCode += `        'nombre' => ${escaparPHP(insumo.nombre)},\n`;
  phpCode += `        'estado' => ${escaparPHP(insumo.estado)},\n`;
  phpCode += `        'categoria_delphin_insumo_id' => ${escaparPHP(insumo.categoria_delphin_insumo_id)},\n`;
  phpCode += `        'clase_delphin_insumo_id' => ${escaparPHP(insumo.clase_delphin_insumo_id)},\n`;
  phpCode += `        'clase_conta_insumo_id' => ${escaparPHP(insumo.clase_conta_insumo_id)},\n`;
  phpCode += `        'tipo_costodelphi_insumo_id' => ${escaparPHP(insumo.tipo_costodelphi_insumo_id)},\n`;
  phpCode += `        'unidad_medida_id' => ${escaparPHP(insumo.unidad_medida_id)},\n`;
  phpCode += `        'marca_id' => ${escaparPHP(insumo.marca_id)},\n`;
  phpCode += `        'precio_unitario' => ${escaparPHP(insumo.precio_unitario)},\n`;
  phpCode += `        'observaciones' => ${escaparPHP(insumo.observaciones)},\n`;
  phpCode += `        'user_creator_id' => ${escaparPHP(insumo.user_creator_id)},\n`;
  phpCode += `        'activo_fijo' => ${escaparPHP(insumo.activo_fijo)}\n`;
  phpCode += `    ]`;
  
  // Agregar coma si no es el último elemento
  if (index < insumos.length - 1) {
    phpCode += ',';
  }
  
  phpCode += '\n';
  
  // Mostrar progreso
  if ((index + 1) % 1000 === 0) {
    console.log(`   Procesados: ${index + 1} / ${insumos.length}`);
  }
});

phpCode += `];

// Funciones auxiliares

// Obtener todos los insumos activos
function obtenerInsumosActivos($insumos) {
    return array_filter($insumos, function($insumo) {
        return $insumo['estado'] === 1;
    });
}

// Buscar insumo por nombre
function buscarInsumoPorNombre($insumos, $nombre) {
    $nombreUpper = strtoupper($nombre);
    foreach ($insumos as $insumo) {
        if (strtoupper($insumo['nombre']) === $nombreUpper) {
            return $insumo;
        }
    }
    return null;
}

// Buscar insumos que contengan un texto
function buscarInsumosPorTexto($insumos, $texto) {
    $resultado = [];
    $textoUpper = strtoupper($texto);
    foreach ($insumos as $insumo) {
        if (strpos(strtoupper($insumo['nombre']), $textoUpper) !== false) {
            $resultado[] = $insumo;
        }
    }
    return $resultado;
}

// Obtener insumos por categoría
function obtenerInsumosPorCategoria($insumos, $categoriaId) {
    return array_filter($insumos, function($insumo) use ($categoriaId) {
        return $insumo['categoria_delphin_insumo_id'] === $categoriaId;
    });
}

// Obtener insumos por clase (detalle)
function obtenerInsumosPorClase($insumos, $claseId) {
    return array_filter($insumos, function($insumo) use ($claseId) {
        return $insumo['clase_delphin_insumo_id'] === $claseId;
    });
}

// Obtener insumos por tipo de costo
function obtenerInsumosPorTipoCosto($insumos, $tipoCostoId) {
    return array_filter($insumos, function($insumo) use ($tipoCostoId) {
        return $insumo['tipo_costodelphi_insumo_id'] === $tipoCostoId;
    });
}

// Obtener insumos por marca
function obtenerInsumosPorMarca($insumos, $marcaId) {
    return array_filter($insumos, function($insumo) use ($marcaId) {
        return $insumo['marca_id'] === $marcaId;
    });
}

// Obtener insumos por unidad de medida
function obtenerInsumosPorUnidad($insumos, $unidadId) {
    return array_filter($insumos, function($insumo) use ($unidadId) {
        return $insumo['unidad_medida_id'] === $unidadId;
    });
}

// Obtener insumos por rango de precio
function obtenerInsumosPorRangoPrecio($insumos, $precioMin, $precioMax) {
    return array_filter($insumos, function($insumo) use ($precioMin, $precioMax) {
        $precio = $insumo['precio_unitario'];
        return $precio !== null && $precio >= $precioMin && $precio <= $precioMax;
    });
}

// Obtener estadísticas de insumos
function obtenerEstadisticasInsumos($insumos) {
    $stats = [
        'total' => count($insumos),
        'activos' => 0,
        'con_precio' => 0,
        'con_marca' => 0,
        'con_unidad' => 0,
        'con_categoria' => 0,
        'con_clase' => 0,
        'precio_promedio' => 0,
        'precio_minimo' => null,
        'precio_maximo' => null
    ];
    
    $precios = [];
    
    foreach ($insumos as $insumo) {
        if ($insumo['estado'] === 1) $stats['activos']++;
        if ($insumo['precio_unitario'] !== null) {
            $stats['con_precio']++;
            $precios[] = $insumo['precio_unitario'];
        }
        if ($insumo['marca_id'] !== null) $stats['con_marca']++;
        if ($insumo['unidad_medida_id'] !== null) $stats['con_unidad']++;
        if ($insumo['categoria_delphin_insumo_id'] !== null) $stats['con_categoria']++;
        if ($insumo['clase_delphin_insumo_id'] !== null) $stats['con_clase']++;
    }
    
    if (count($precios) > 0) {
        $stats['precio_promedio'] = array_sum($precios) / count($precios);
        $stats['precio_minimo'] = min($precios);
        $stats['precio_maximo'] = max($precios);
    }
    
    return $stats;
}

// Ejemplo de uso:
// $insumosActivos = obtenerInsumosActivos($insumos);
// $insumo = buscarInsumoPorNombre($insumos, 'CEMENTO');
// $insumosPorCategoria = obtenerInsumosPorCategoria($insumos, 3);
// $estadisticas = obtenerEstadisticasInsumos($insumos);

?>`;

console.log('✅ Código PHP generado\n');

// Guardar el archivo PHP
const archivoPHP = path.join(__dirname, 'insumos_array.php');
fs.writeFileSync(archivoPHP, phpCode);

console.log('💾 Archivo guardado: insumos_array.php');

// Mostrar estadísticas del archivo generado
const tamanoKB = (phpCode.length / 1024).toFixed(2);
const tamanoMB = (phpCode.length / (1024 * 1024)).toFixed(2);

console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN');
console.log('═'.repeat(70));
console.log(`📦 Total de insumos: ${insumos.length.toLocaleString()}`);
console.log(`📄 Tamaño del archivo: ${tamanoKB} KB (${tamanoMB} MB)`);
console.log(`📝 Líneas de código: ~${phpCode.split('\n').length.toLocaleString()}`);

console.log('\n✨ FUNCIONES INCLUIDAS:');
console.log('   • obtenerInsumosActivos()');
console.log('   • buscarInsumoPorNombre()');
console.log('   • buscarInsumosPorTexto()');
console.log('   • obtenerInsumosPorCategoria()');
console.log('   • obtenerInsumosPorClase()');
console.log('   • obtenerInsumosPorTipoCosto()');
console.log('   • obtenerInsumosPorMarca()');
console.log('   • obtenerInsumosPorUnidad()');
console.log('   • obtenerInsumosPorRangoPrecio()');
console.log('   • obtenerEstadisticasInsumos()');

console.log('\n💡 EJEMPLO DE USO:');
console.log('═'.repeat(70));
console.log('<?php');
console.log('require_once("insumos_array.php");');
console.log('');
console.log('// Obtener estadísticas');
console.log('$stats = obtenerEstadisticasInsumos($insumos);');
console.log('echo "Total: " . $stats["total"];');
console.log('');
console.log('// Buscar por nombre');
console.log('$insumo = buscarInsumoPorNombre($insumos, "CEMENTO");');
console.log('');
console.log('// Filtrar por categoría');
console.log('$materiales = obtenerInsumosPorCategoria($insumos, 3);');
console.log('?>');

console.log('\n✨ ¡Archivo PHP generado exitosamente!');


