const fs = require('fs');
const path = require('path');

// Leer el archivo de marcas únicas
const filePath = path.join(__dirname, 'marcas_unicas.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log(`📊 Total de marcas a procesar: ${data.total}`);

// Generar el código PHP
let phpCode = `<?php
// Array asociativo de marcas
// Total de marcas: ${data.total}
// Generado automáticamente

$marcas = [
`;

// Agregar cada marca al array
data.marcas.forEach((marca, index) => {
  // Escapar comillas simples en el nombre de la marca
  const marcaEscapada = marca.replace(/'/g, "\\'");
  
  phpCode += `    [\n`;
  phpCode += `        'nombre' => '${marcaEscapada}',\n`;
  phpCode += `        'estado' => 1\n`;
  phpCode += `    ]`;
  
  // Agregar coma si no es el último elemento
  if (index < data.marcas.length - 1) {
    phpCode += ',';
  }
  
  phpCode += '\n';
});

phpCode += `];

// Función para obtener todas las marcas activas
function obtenerMarcasActivas($marcas) {
    return array_filter($marcas, function($marca) {
        return $marca['estado'] === 1;
    });
}

// Función para buscar una marca por nombre
function buscarMarcaPorNombre($marcas, $nombre) {
    foreach ($marcas as $marca) {
        if (strtoupper($marca['nombre']) === strtoupper($nombre)) {
            return $marca;
        }
    }
    return null;
}

// Función para obtener lista de nombres de marcas
function obtenerNombresMarcas($marcas) {
    return array_map(function($marca) {
        return $marca['nombre'];
    }, $marcas);
}

// Estadísticas
echo "Total de marcas: " . count($marcas) . "\\n";
echo "Marcas activas: " . count(obtenerMarcasActivas($marcas)) . "\\n";

?>`;

// Guardar el archivo PHP
const archivoPHP = path.join(__dirname, 'marcas_array.php');
fs.writeFileSync(archivoPHP, phpCode);

console.log('✅ Archivo PHP generado exitosamente!');
console.log(`💾 Archivo: marcas_array.php`);
console.log(`📦 Total de marcas: ${data.total}`);

// Generar también versión JSON para referencia
const marcasArray = data.marcas.map(marca => ({
  nombre: marca,
  estado: 1
}));

const archivoJSON = path.join(__dirname, 'marcas_array.json');
fs.writeFileSync(archivoJSON, JSON.stringify(marcasArray, null, 2));

console.log(`💾 Archivo JSON generado: marcas_array.json`);

// Mostrar preview del código PHP
console.log('\n📄 PREVIEW DEL CÓDIGO PHP:');
console.log('═══════════════════════════════════════════════════');
console.log(phpCode.substring(0, 800) + '\n... (continúa)');

console.log('\n✨ ¡Proceso completado!');
console.log('\n📋 INSTRUCCIONES DE USO:');
console.log('1. El archivo marcas_array.php contiene el array con todas las marcas');
console.log('2. Cada marca tiene: nombre (string) y estado (1 = activo)');
console.log('3. Incluye funciones auxiliares para trabajar con el array');
console.log('4. Puedes incluir el archivo en tu proyecto PHP con: require_once("marcas_array.php");');



