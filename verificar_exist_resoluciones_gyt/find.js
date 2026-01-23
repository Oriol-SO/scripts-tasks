/**
 * del json que se obtiene de no encontrados
 * se busca otra vez en el json y se obtiene todos sus datos completos
 */

const fs = require("fs");

const file = fs.readFileSync("archivos_no_encontrados.json", "utf8");
const linknames = JSON.parse(file);

const filereso= fs.readFileSync("resoluciones.json", "utf8");
const resoluciones = JSON.parse(filereso);


async function findlink(){
    const array=[];
    for (const pdfname of linknames) {
        const file='/storage/resolucion_cu/'+pdfname;
        //buscar dentro de las resoluciones
        const res=resoluciones.find((item)=>(item.file==file));
        if(res){
            array.push(res);
        }
    }
    
    fs.writeFileSync("resoluciones_no_econtrados.json", JSON.stringify(array, null, 2));
    console.log("⚠️ Resoluciones no encontrados guardados en 'resoluciones_no_econtrados.json'");

}

findlink();

