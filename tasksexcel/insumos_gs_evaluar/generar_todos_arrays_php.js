const fs = require('fs');
const path = require('path');

// Leer todos los archivos JSON
const marcasData = JSON.parse(fs.readFileSync(path.join(__dirname, 'marcas_unicas.json'), 'utf8'));
const unidadesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'unidades_unicas.json'), 'utf8'));
const insumosData = JSON.parse(fs.readFileSync(path.join(__dirname, 'insumos_unicos.json'), 'utf8'));
const detallesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'detalles_unicos.json'), 'utf8'));

console.log('📊 Datos cargados:');
console.log(`   - Marcas: ${marcasData.total}`);
console.log(`   - Unidades: ${unidadesData.total}`);
console.log(`   - Insumos: ${insumosData.total}`);
console.log(`   - Detalles: ${detallesData.total}`);

// Función para generar array PHP
function generarArrayPHP(items, nombreArray, titulo) {
  let phpCode = `<?php
// ${titulo}
// Total de ${nombreArray}: ${items.length}
// Generado automáticamente

$${nombreArray} = [
`;

  items.forEach((item, index) => {
    const itemEscapado = item.replace(/'/g, "\\'");
    phpCode += `    [\n`;
    phpCode += `        'nombre' => '${itemEscapado}',\n`;
    phpCode += `        'estado' => 1\n`;
    phpCode += `    ]`;
    
    if (index < items.length - 1) {
      phpCode += ',';
    }
    phpCode += '\n';
  });

  phpCode += `];
?>`;

  return phpCode;
}

// Función para generar funciones auxiliares PHP
function generarFuncionesAuxiliares(nombreArray, nombreSingular) {
  return `<?php
// Funciones auxiliares para ${nombreArray}

// Obtener todos los ${nombreArray} activos
function obtener${nombreArray.charAt(0).toUpperCase() + nombreArray.slice(1)}Activos($${nombreArray}) {
    return array_filter($${nombreArray}, function($item) {
        return $item['estado'] === 1;
    });
}

// Buscar por nombre
function buscar${nombreSingular.charAt(0).toUpperCase() + nombreSingular.slice(1)}PorNombre($${nombreArray}, $nombre) {
    foreach ($${nombreArray} as $item) {
        if (strtoupper($item['nombre']) === strtoupper($nombre)) {
            return $item;
        }
    }
    return null;
}

// Obtener lista de nombres
function obtenerNombres${nombreArray.charAt(0).toUpperCase() + nombreArray.slice(1)}($${nombreArray}) {
    return array_map(function($item) {
        return $item['nombre'];
    }, $${nombreArray});
}

// Contar ${nombreArray} activos
function contar${nombreArray.charAt(0).toUpperCase() + nombreArray.slice(1)}Activos($${nombreArray}) {
    return count(obtener${nombreArray.charAt(0).toUpperCase() + nombreArray.slice(1)}Activos($${nombreArray}));
}
?>`;
}

// Generar archivos PHP individuales
console.log('\n🔨 Generando archivos PHP...');

// 1. Marcas
const phpMarcas = generarArrayPHP(marcasData.marcas, 'marcas', 'Array asociativo de marcas');
fs.writeFileSync(path.join(__dirname, 'marcas_array.php'), phpMarcas);
console.log('✅ marcas_array.php generado');

// 2. Unidades
const phpUnidades = generarArrayPHP(unidadesData.unidades, 'unidades', 'Array asociativo de unidades de medida');
fs.writeFileSync(path.join(__dirname, 'unidades_array.php'), phpUnidades);
console.log('✅ unidades_array.php generado');

// 3. Insumos
const phpInsumos = generarArrayPHP(insumosData.insumos, 'insumos', 'Array asociativo de categorías de insumos');
fs.writeFileSync(path.join(__dirname, 'insumos_array.php'), phpInsumos);
console.log('✅ insumos_array.php generado');

// 4. Detalles
const phpDetalles = generarArrayPHP(detallesData.detalles, 'detalles', 'Array asociativo de detalles');
fs.writeFileSync(path.join(__dirname, 'detalles_array.php'), phpDetalles);
console.log('✅ detalles_array.php generado');

// Generar archivo consolidado con todas las categorías
const phpConsolidado = `<?php
// Archivo consolidado con todas las categorías
// Generado automáticamente

// Incluir todos los arrays
require_once('marcas_array.php');
require_once('unidades_array.php');
require_once('insumos_array.php');
require_once('detalles_array.php');

// Clase para gestionar todas las categorías
class CategoriasInsumos {
    private $marcas;
    private $unidades;
    private $insumos;
    private $detalles;
    
    public function __construct($marcas, $unidades, $insumos, $detalles) {
        $this->marcas = $marcas;
        $this->unidades = $unidades;
        $this->insumos = $insumos;
        $this->detalles = $detalles;
    }
    
    // Obtener todas las marcas
    public function getMarcas() {
        return $this->marcas;
    }
    
    // Obtener todas las unidades
    public function getUnidades() {
        return $this->unidades;
    }
    
    // Obtener todos los insumos
    public function getInsumos() {
        return $this->insumos;
    }
    
    // Obtener todos los detalles
    public function getDetalles() {
        return $this->detalles;
    }
    
    // Buscar marca por nombre
    public function buscarMarca($nombre) {
        return $this->buscarEnArray($this->marcas, $nombre);
    }
    
    // Buscar unidad por nombre
    public function buscarUnidad($nombre) {
        return $this->buscarEnArray($this->unidades, $nombre);
    }
    
    // Buscar insumo por nombre
    public function buscarInsumo($nombre) {
        return $this->buscarEnArray($this->insumos, $nombre);
    }
    
    // Buscar detalle por nombre
    public function buscarDetalle($nombre) {
        return $this->buscarEnArray($this->detalles, $nombre);
    }
    
    // Método auxiliar para buscar en arrays
    private function buscarEnArray($array, $nombre) {
        foreach ($array as $item) {
            if (strtoupper($item['nombre']) === strtoupper($nombre)) {
                return $item;
            }
        }
        return null;
    }
    
    // Obtener estadísticas
    public function getEstadisticas() {
        return [
            'marcas' => count($this->marcas),
            'unidades' => count($this->unidades),
            'insumos' => count($this->insumos),
            'detalles' => count($this->detalles),
            'total' => count($this->marcas) + count($this->unidades) + 
                      count($this->insumos) + count($this->detalles)
        ];
    }
    
    // Exportar todas las categorías como JSON
    public function exportarJSON() {
        return json_encode([
            'marcas' => $this->marcas,
            'unidades' => $this->unidades,
            'insumos' => $this->insumos,
            'detalles' => $this->detalles
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

// Crear instancia global
$categorias = new CategoriasInsumos($marcas, $unidades, $insumos, $detalles);

// Ejemplo de uso:
// $estadisticas = $categorias->getEstadisticas();
// $marca = $categorias->buscarMarca('NACIONAL');
// $todasMarcas = $categorias->getMarcas();

?>`;

fs.writeFileSync(path.join(__dirname, 'categorias_consolidado.php'), phpConsolidado);
console.log('✅ categorias_consolidado.php generado');

// Generar archivo de ejemplo de uso
const ejemploUso = `<?php
// Ejemplo de uso de las categorías

// Incluir el archivo consolidado
require_once('categorias_consolidado.php');

// Mostrar estadísticas
echo "=== ESTADÍSTICAS ===\\n";
$stats = $categorias->getEstadisticas();
echo "Total de marcas: " . $stats['marcas'] . "\\n";
echo "Total de unidades: " . $stats['unidades'] . "\\n";
echo "Total de insumos: " . $stats['insumos'] . "\\n";
echo "Total de detalles: " . $stats['detalles'] . "\\n";
echo "Total general: " . $stats['total'] . "\\n\\n";

// Buscar una marca
echo "=== BÚSQUEDA DE MARCA ===\\n";
$marca = $categorias->buscarMarca('NACIONAL');
if ($marca) {
    echo "Marca encontrada: " . $marca['nombre'] . " (Estado: " . $marca['estado'] . ")\\n\\n";
}

// Listar las primeras 5 unidades
echo "=== PRIMERAS 5 UNIDADES ===\\n";
$unidades = $categorias->getUnidades();
foreach (array_slice($unidades, 0, 5) as $index => $unidad) {
    echo ($index + 1) . ". " . $unidad['nombre'] . "\\n";
}
echo "\\n";

// Listar todos los insumos
echo "=== CATEGORÍAS DE INSUMOS ===\\n";
$insumos = $categorias->getInsumos();
foreach ($insumos as $index => $insumo) {
    echo ($index + 1) . ". " . $insumo['nombre'] . "\\n";
}
echo "\\n";

// Exportar como JSON
// echo $categorias->exportarJSON();

?>`;

fs.writeFileSync(path.join(__dirname, 'ejemplo_uso.php'), ejemploUso);
console.log('✅ ejemplo_uso.php generado');

// Generar resumen en formato texto
const resumenTexto = `
╔════════════════════════════════════════════════════════════╗
║           ARCHIVOS PHP GENERADOS - RESUMEN                 ║
╚════════════════════════════════════════════════════════════╝

📦 ARCHIVOS INDIVIDUALES:
   • marcas_array.php       - ${marcasData.total} marcas
   • unidades_array.php     - ${unidadesData.total} unidades
   • insumos_array.php      - ${insumosData.total} categorías de insumos
   • detalles_array.php     - ${detallesData.total} detalles

📦 ARCHIVOS CONSOLIDADOS:
   • categorias_consolidado.php - Clase para gestionar todas las categorías
   • ejemplo_uso.php            - Ejemplos de cómo usar los arrays

📋 ESTRUCTURA DE CADA ITEM:
   [
       'nombre' => 'NOMBRE_ITEM',
       'estado' => 1
   ]

🚀 USO BÁSICO:
   1. Incluir: require_once('categorias_consolidado.php');
   2. Usar: $categorias->getMarcas();
   3. Buscar: $categorias->buscarMarca('NACIONAL');

📊 ESTADÍSTICAS TOTALES:
   • Marcas:    ${marcasData.total}
   • Unidades:  ${unidadesData.total}
   • Insumos:   ${insumosData.total}
   • Detalles:  ${detallesData.total}
   • TOTAL:     ${marcasData.total + unidadesData.total + insumosData.total + detallesData.total}
`;

fs.writeFileSync(path.join(__dirname, 'RESUMEN_PHP.txt'), resumenTexto);
console.log('✅ RESUMEN_PHP.txt generado');

console.log('\n✨ ¡Proceso completado exitosamente!');
console.log(resumenTexto);



