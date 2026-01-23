/**
 * de la lista general de arcvhivos de la carpeta resoluciones y de las resoluciones registradas se obtiene lo siguiente
 * 
 * -lista de resoluciones ok (estan en la base de datos y el ftp)
 * -lista de archivos que no estan registradas (estan en el ftp pero no en la base de datos )
 * - lista de archivos que estanregistradas pero no estan en el ftp
 */

const fs = require("fs");

const file = fs.readFileSync("resoluciones.json", "utf8");
const resoluciones = JSON.parse(file);

const file2= fs.readFileSync("lista_archivos.json", "utf8");
const archivos = JSON.parse(file2);

//obtener p´rimero la lista ok
function init(){
    const array=[];
    const array2=[];
    for (const archivo of archivos) {
        const res= resoluciones.find((item)=>(item.file==archivo));
        if(res){
            //tiene su archivo
            array.push(res)
        }else{
            //existe en el ftp pero no esta registrado
            array2.push(archivo)
        }

    }

    //estan registradas pero no tiene su archivo guardado en ftp
    const array3=[];
    for (const reso of resoluciones) {
        const file=reso.file;

        const exist=archivos.find((item)=>(item==file));
        if(!exist){
            //no tiene su archivo
            array3.push(reso);
        }
    }

    
    fs.writeFileSync("output/registradas_ok.json", JSON.stringify(array, null, 2));
    console.log("✅ - "+array.length+" Resoluciones registradas guardados en 'registradas_ok.json'");

    fs.writeFileSync("output/no_registradas.json", JSON.stringify(array2, null, 2));
    console.log("⚠️ - "+array2.length+" Archivos no registrados guardados en 'no_registradas.json'");
    
    fs.writeFileSync("output/no_existe.json", JSON.stringify(array3, null, 2));
    console.log("⚠️ - "+array3.length+" Archivos que no existen guardados en 'no_existe.json'");

}

//obtener la lista que esta regi


init();