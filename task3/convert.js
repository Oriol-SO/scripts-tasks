/**
 * ahora leemos el json obtenido y los datos lo pasamos para que se pueda insertar en el mysql
 *
 */

const fs = require("fs");

// 📂 Ruta del archivo JSON generado
const jsonFilePath = "datos.json";

// 📖 Leer el archivo JSON
fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
        console.error("❌ Error al leer el archivo JSON:", err);
        return;
    }

    try {
        // 📌 Convertir el JSON en un objeto de JavaScript
        const jsonData = JSON.parse(data);
        const newdatos=[];

        jsonData.forEach(el => {
            newdatos.push({
                fecha:el.FECHA_F,
                descripcion:el.DESCRIPCION,
                ordenes:el.ORDENES,
                proveedor:el.PROVEEDOR,
                empresas:el.EMPRESAS
            })
        });


        const jsonFilePath = "ouput2.json";
        fs.writeFileSync(jsonFilePath, JSON.stringify(newdatos, null, 2));

    } catch (parseError) {
        console.error("❌ Error al parsear JSON:", parseError);
    }
});
