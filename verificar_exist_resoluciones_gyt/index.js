/**
 * Conectarse al FTP de GYT y verificar si existen o no los archivos.
 * Los que no existan se almacenan en un JSON.
 */

require("dotenv").config({ path: "../.env" });

const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

const fileLinks = fs.readFileSync("resoluciones.json", "utf8");
const links = JSON.parse(fileLinks);

async function listFiles() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_GYT_HOST,
            user: process.env.FTP_GYT_USER,
            password: process.env.FTP_GYT_PASSWORD,
            port: 21,
            secure: false, // Cambiar a true si el servidor usa FTPS
        });

        console.log("✅ Conectado al servidor FTP");

        const carpeta = "resolucion_cu";
        await client.cd(carpeta);
        console.log(`📂 Cambiado al directorio: ${carpeta}`);

        const archivosNoEncontrados = [];

        for (const item of links) {
            const fileName = item.file.match(/[^/]+$/)[0]; // Extraer el nombre del archivo

            try {
                await client.size(fileName); // Verifica si el archivo existe en el FTP
                console.log(`✅ El archivo "${fileName}" EXISTE.`);
            } catch (error) {
                console.log(`❌ El archivo "${fileName}" NO EXISTE.`);
                archivosNoEncontrados.push(fileName);
            }
        }

        // Guardar los archivos no encontrados en un JSON
        if (archivosNoEncontrados.length > 0) {
            fs.writeFileSync("archivos_no_encontrados.json", JSON.stringify(archivosNoEncontrados, null, 2));
            console.log("⚠️ Archivos no encontrados guardados en 'archivos_no_encontrados.json'");
        }

    } catch (error) {
        console.error("❌ Error al conectar:", error);
    } finally {
        client.close(); // Cierra la conexión
    }
}

listFiles();
