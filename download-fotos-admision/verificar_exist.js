const fs = require('fs');
const path = require('path');

const folderPath = 'fotos'; // Ruta de la carpeta

const fileLinks= fs.readFileSync('link_fotos.json','utf8');
const links=JSON.parse(fileLinks);

const outputFile = 'no_existen.json';
const missingFiles = [];

links.forEach(item => {
    const fileName =item.foto_user.split('/').pop();
    const filePath = path.join(folderPath, fileName);
    if(!fs.existsSync(filePath)){
       missingFiles.push(item.foto_user);
    }
});

fs.writeFileSync(outputFile, JSON.stringify(missingFiles, null, 2), 'utf8');
console.log('Se ha creado el archivo con los links de las fotos que no existen.');