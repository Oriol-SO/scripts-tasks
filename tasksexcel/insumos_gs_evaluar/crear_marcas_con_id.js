const fs = require('fs');
const path = require('path');

console.log('🏷️  Creando JSON de marcas con ID...\n');

// Leer el archivo de marcas únicas
const marcasData = JSON.parse(fs.readFileSync(path.join(__dirname, 'marcas_unicas.json'), 'utf8'));

console.log(`📊 Total de marcas: ${marcasData.total}`);

// Crear array de marcas con ID, nombre y estado
const marcasConId = marcasData.marcas.map((marca, index) => ({
  id: index + 1,
  nombre: marca,
  estado: 1
}));

console.log(`✅ ${marcasConId.length} marcas procesadas\n`);

// Guardar el archivo
const archivoMarcas = path.join(__dirname, 'marcas.json');
fs.writeFileSync(archivoMarcas, JSON.stringify(marcasConId, null, 2));

console.log('💾 Archivo guardado: marcas.json');

// Mostrar estadísticas
console.log('\n' + '═'.repeat(70));
console.log('📊 RESUMEN');
console.log('═'.repeat(70));
console.log(`📦 Total de marcas: ${marcasConId.length}`);
console.log(`🆔 Rango de IDs: 1 - ${marcasConId.length}`);

// Mostrar primeras 10 marcas
console.log('\n📋 PRIMERAS 10 MARCAS:');
console.log('═'.repeat(70));
marcasConId.slice(0, 10).forEach(marca => {
  console.log(`ID: ${marca.id.toString().padStart(3, ' ')} | ${marca.nombre}`);
});

if (marcasConId.length > 10) {
  console.log(`... y ${marcasConId.length - 10} marcas más`);
}

// Mostrar últimas 5 marcas
console.log('\n📋 ÚLTIMAS 5 MARCAS:');
console.log('═'.repeat(70));
marcasConId.slice(-5).forEach(marca => {
  console.log(`ID: ${marca.id.toString().padStart(3, ' ')} | ${marca.nombre}`);
});

console.log('\n✨ ¡Proceso completado!');
console.log('\n📄 Estructura de ejemplo:');
console.log(JSON.stringify(marcasConId[0], null, 2));


